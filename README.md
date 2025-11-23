# Food Ordering Web App

> Full-stack MERN application with Docker containerization

## About

This is a Web application based on MERN stack - MongoDB, Express.js, React.js, and Node.js.
With this application Vendors can sell their products while Buyers can surf and buy stuff from various vendors on the platform.

- Vendors and Buyers can create their accounts and edit their profiles.
- Adding of products is made convinient for the Vendors.
- Ordering system is made convinient for Buyers and even Vendors.
- Searching, Sorting and Filtering of Products from various Vendors is made easy through this app.
- Buyers can look at the status of their products as they are being prepared.

## Features

- **Dual User System**: Separate interfaces for Buyers and Vendors
- **Fuzzy Search**: Typo-tolerant product search
- **Virtual Wallet**: Cashless ordering system for buyers
- **Order Tracking**: Multi-stage order pipeline with real-time status updates
- **Vendor Analytics**: Dashboard with top-selling items and customer distribution graphs
- **Advanced Filtering**: Multi-dimensional product filtering (veg/non-veg, price, shop)

## Architecture

The application uses a multi-container Docker setup with 4 services:

- **frontend** (React) - Port 3000: User interface
- **backend** (Express/Node.js) - Port 4000: RESTful API server
- **mongo** (MongoDB) - Port 27017: Database
- **nginx** (Reverse Proxy) - Port 5000: Routes `/` to frontend, `/api` to backend

**Network Isolation:** Two Docker networks (`web-net`, `db-net`) isolate the database from direct frontend access for security.

For detailed architecture information, Docker setup, and network topology, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Installations

### Node

* For Linux:
```
curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
sudo apt-get install -y nodejs
```

* For Mac:
```
brew install node
```

### MongoDB

Install the community edition [here](https://docs.mongodb.com/manual/installation/#mongodb-community-edition-installation-tutorials).


### React

```
npm install -g create-react-app
```

* To create a new React app:
```
create-react-app name_of_app
```

* To run the app, cd into the directory and do:
```
npm start
```

## Running the App

### With Docker (Recommended)

```bash
# Start all services (Frontend, Backend, MongoDB, Nginx)
docker-compose up

# Access the application at http://localhost:5000

# Rebuild containers after code changes
docker-compose up --build

# Stop all services
docker-compose down
```

### Without Docker (Local Development)

* Run Mongo daemon:
```
sudo mongod
```
Mongo will be running on port 27017.


* Run Express Backend:
```
cd backend/
npm install
npm start
```

* Run React Frontend:
```
cd frontend
npm install
npm start
```

Navigate to [http://localhost:3000/](http://localhost:3000/) in your browser.

## API Documentation

The backend exposes RESTful APIs for managing buyers, vendors, products, and orders.

**Base URLs:**
- Local Development: `http://localhost:4000`
- Docker Deployment: `http://localhost:5000/api`

**API Resources:**
- `/buyers` - Buyer authentication and profile management
- `/vendors` - Vendor authentication and profile management
- `/products` - Product CRUD operations with fuzzy search
- `/orders` - Order creation and status tracking

For detailed endpoint documentation, request/response examples, and field specifications, see [docs/API.md](docs/API.md).
