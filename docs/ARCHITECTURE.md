# Architecture Documentation

## Overview

The Food Ordering Portal uses a microservices-inspired architecture with Docker containerization. The system consists of 4 independent services that communicate through Docker networks, with Nginx acting as a reverse proxy and API gateway.

## System Architecture

```
                    ┌─────────────────┐
                    │  Port 5000      │
                    │  Nginx Proxy    │
                    └────────┬────────┘
                             │
                ┌────────────┼────────────┐
                │            │            │
         / requests    /api requests     │
                │            │            │
         ┌──────▼──────┐  ┌─▼──────────┐ │
         │  Frontend   │  │  Backend   │ │
         │  React:3000 │  │  Express   │ │
         │             │  │  :4000     │ │
         └─────────────┘  └──────┬─────┘ │
                                 │       │
                          ┌──────▼───────▼─┐
                          │   MongoDB      │
                          │   :27017       │
                          └────────────────┘
```

## Services

### 1. Frontend (React Application)
- **Container Name**: `frontend`
- **Technology**: React 17.0.2, Material-UI v5
- **Port**: 3000 (internal), accessed via Nginx on port 5000
- **Dockerfile**: `frontend/Dockerfile`

**Purpose**: Serves the user interface for both buyers and vendors. Handles client-side routing, state management, and API calls to the backend.

**Key Features**:
- Component-based architecture
- Material-UI components for responsive design
- Client-side filtering and sorting
- Local-storage for session management

### 2. Backend (Express API Server)
- **Container Name**: `backend`
- **Technology**: Node.js 16.14.0, Express.js
- **Port**: 4000 (internal), accessed via Nginx reverse proxy
- **Dockerfile**: `backend/Dockerfile`

**Purpose**: RESTful API server handling authentication, data validation, and database operations.

**Key Features**:
- 20+ API endpoints across 4 resources
- bcrypt password hashing (10 salt rounds)
- Input validation using `validator` library
- mongoose-fuzzy-searching for product search

**Database Connection**:
```javascript
// In Docker: mongodb://mongo:27017/test1
// Local dev: mongodb://localhost:27017/test1
```

### 3. MongoDB (Database)
- **Container Name**: `mongo`
- **Technology**: MongoDB official image
- **Port**: 27017
- **Volume**: `mongo-data` (persistent storage)

**Purpose**: NoSQL database storing 6 collections (Buyer, Vendor, Product, Order, Review, Users).

**Key Features**:
- Schema flexibility for evolving product attributes
- Fuzzy search indexing on product names
- Persistent volume for data retention across container restarts

### 4. Nginx (Reverse Proxy)
- **Container Name**: `nginx`
- **Technology**: Nginx (Alpine-based)
- **Port**: 5000 (exposed to host)
- **Config**: `nginx/local.conf`

**Purpose**: Acts as reverse proxy and API gateway, routing requests to appropriate services.

**Routing Rules**:
```nginx
/                 → frontend:3000  (React app)
/api/*            → backend:4000   (API, strips /api prefix)
/sockjs-node/*    → frontend:3000  (Hot reload support)
```

## Docker Networks

The system uses two isolated networks for security:

### web-net (Frontend/Backend Communication)
**Connected Services**: `frontend`, `backend`, `nginx`

**Purpose**: Handles HTTP traffic between user-facing services.

**Security**: Database is NOT on this network, preventing direct frontend access to MongoDB.

### db-net (Backend/Database Communication)
**Connected Services**: `backend`, `mongo`, `nginx`

**Purpose**: Isolates database communication to backend only.

**Security**: Frontend cannot directly query or modify the database, enforcing API-based access control.

### Why Two Networks?

This defense-in-depth approach ensures:
- Frontend cannot bypass backend validation by directly querying MongoDB
- Even if frontend is compromised, database remains protected
- Clear separation of concerns (presentation layer vs data layer)
- Follows principle of least privilege

## Port Mappings

| Service | Internal Port | External Port | Access |
|---------|---------------|---------------|--------|
| Frontend | 3000 | - | Via Nginx only |
| Backend | 4000 | - | Via Nginx only |
| MongoDB | 27017 | - | Backend only |
| Nginx | 80 | 5000 | **Public access point** |

**Note**: Only Nginx port 5000 is exposed to the host machine. All other services are internal to Docker networks.

## Request Flow

### Frontend Request (e.g., loading home page)
```
1. Browser → http://localhost:5000/
2. Nginx receives request on port 5000
3. Nginx routes to frontend:3000
4. React app returns HTML/JS
5. Browser renders page
```

### API Request (e.g., fetching products)
```
1. Browser → http://localhost:5000/api/products
2. Nginx receives request on port 5000
3. Nginx strips /api prefix, routes to backend:4000/products
4. Express validates request, queries MongoDB at mongo:27017
5. Backend returns JSON response
6. Nginx forwards to browser
```

## Docker Compose Configuration

### Service Dependencies
```yaml
frontend:
  depends_on: []  # No dependencies

backend:
  depends_on:
    - mongo  # Waits for MongoDB to be ready

nginx:
  depends_on:
    - frontend
    - backend  # Waits for both web services
```

### Volume Persistence
```yaml
volumes:
  mongo-data:  # Named volume for MongoDB data
```

**Why?** Ensures database data persists across container restarts and rebuilds.

### Environment-Specific Configuration

**Development (docker-compose.yml)**:
- Hot reloading enabled via volume mounts
- `NODE_ENV=development`
- Source code mounted for live updates

**Production (recommended enhancements)**:
- Multi-stage builds for smaller images
- `NODE_ENV=production`
- No source code mounts
- Optimized React build served by Nginx

## Advantages of This Architecture

### 1. Service Isolation
Each service runs in its own container with defined resources. If frontend crashes, backend and database continue running.

### 2. Scalability
Can easily scale services independently:
```bash
docker-compose up --scale backend=3  # Run 3 backend instances
```
Nginx can act as load balancer across multiple backend containers.

### 3. Environment Consistency
"Works on my machine" problems eliminated. Docker ensures dev/staging/production parity.

### 4. Security Through Network Isolation
Two-network design prevents unauthorized database access from frontend.

### 5. Easy Deployment
Single command deployment:
```bash
docker-compose up
```

### 6. Technology Independence
Each service can use different tech stack. Could swap React for Vue, Express for FastAPI without affecting other services.

## Connection Strings

### Backend to MongoDB

**In Docker** (container-to-container communication):
```javascript
mongodb://mongo:27017/test1
```
Uses Docker's internal DNS resolution. `mongo` is the container name.

**Local Development** (direct connection):
```javascript
mongodb://localhost:27017/test1
```
Uses host machine's MongoDB instance.

### Frontend to Backend

**In Docker** (via Nginx):
```javascript
axios.post('/api/products/add', data)
```
Nginx proxies to `backend:4000/products/add`

**Local Development** (direct connection):
```javascript
axios.post('http://localhost:4000/products/add', data)
```
Direct connection to backend server.

## Network Topology Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  Docker Host (Port 5000)                                    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  web-net Network                                     │  │
│  │                                                       │  │
│  │  ┌──────────┐      ┌──────────┐      ┌──────────┐  │  │
│  │  │ Frontend │◄─────┤  Nginx   │─────►│ Backend  │  │  │
│  │  │  :3000   │      │   :80    │      │  :4000   │  │  │
│  │  └──────────┘      └────┬─────┘      └─────┬────┘  │  │
│  │                          │                  │        │  │
│  └──────────────────────────┼──────────────────┼───────┘  │
│                              │                  │           │
│  ┌──────────────────────────┼──────────────────┼───────┐  │
│  │  db-net Network          │                  │       │  │
│  │                          │                  │       │  │
│  │                    ┌─────▼──────┐      ┌────▼────┐ │  │
│  │                    │   Nginx    │      │ Backend │ │  │
│  │                    │  (bridge)  │      │         │ │  │
│  │                    └────────────┘      └────┬────┘ │  │
│  │                                              │      │  │
│  │                                        ┌─────▼────┐ │  │
│  │                                        │   Mongo  │ │  │
│  │                                        │  :27017  │ │  │
│  │                                        └──────────┘ │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Development vs Production

### Current Setup (Development)
- All services run via `docker-compose up`
- Volume mounts for hot reloading
- React runs in development mode
- Source maps enabled for debugging

### Production Recommendations
1. **Multi-stage Docker builds**: Smaller image sizes
2. **React production build**: Optimized bundle, served by Nginx
3. **Environment variables**: Store secrets in .env files
4. **HTTPS**: Add SSL/TLS certificates to Nginx
5. **Health checks**: Monitor service availability
6. **Logging**: Centralized logging (ELK stack, CloudWatch)
7. **CI/CD Pipeline**: Automated testing and deployment

## Troubleshooting

### Container won't start
```bash
docker-compose logs <service-name>
```

### Database connection failed
Check backend is using correct connection string (`mongo:27017` in Docker, not `localhost`).

### Nginx 502 Bad Gateway
Backend or frontend container is down. Check with:
```bash
docker-compose ps
```

### Port already in use
Change port mapping in `docker-compose.yml`:
```yaml
nginx:
  ports:
    - "8080:80"  # Use 8080 instead of 5000
```

### Volume permission errors
```bash
docker-compose down -v  # Remove volumes
docker-compose up       # Recreate
```
