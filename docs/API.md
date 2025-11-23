# API Documentation

## Base URL

- **Local Development**: `http://localhost:4000`
- **Docker Deployment**: `http://localhost:5000/api`

## Authentication

All endpoints use bcrypt password hashing for security. Passwords are hashed with 10 salt rounds before storage.

## Buyers API

**Base Route**: `/buyers`

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/` | List all buyers | - |
| POST | `/register` | Register new buyer | `{ name, email, password, contact_no, age, batch, money }` |
| POST | `/login` | Authenticate buyer | `{ email, password }` |
| POST | `/find` | Find buyer by email | `{ email }` |
| POST | `/update` | Update buyer profile | `{ email, ...updates }` |

**Note**: `batch` must be one of: UG1, UG2, UG3, UG4, UG5

## Vendors API

**Base Route**: `/vendors`

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/` | List all vendors | - |
| POST | `/register` | Register new vendor | `{ manager, shop, email, password, contact_no, op_time, ed_time }` |
| POST | `/login` | Authenticate vendor | `{ email, password }` |
| POST | `/find` | Find vendor by email | `{ email }` |
| POST | `/update` | Update vendor profile | `{ email, ...updates }` |

## Products API

**Base Route**: `/products`

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/` | List all products | - |
| POST | `/add` | Add new product | `{ name, shop, vendor_email, type, price, quantity, status, add_on }` |
| POST | `/update` | Update product | `{ _id, ...updates }` |
| POST | `/delete` | Delete product | `{ _id }` |
| POST | `/view` | View vendor's products | `{ vendor_email }` |

**Product Fields**:
- `type`: "Veg" or "Non-Veg"
- `status`: Boolean (available/unavailable)
- `add_on`: Array of objects `[{ name, price }]`
- `rating`: Number (0-5)
- `rate_count`: Number of ratings

**Fuzzy Search**: Products support fuzzy search via `mongoose-fuzzy-searching` plugin for typo-tolerant queries.

## Orders API

**Base Route**: `/orders`

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/` | List all orders | - |
| POST | `/add` | Create new order | `{ name, price, quantity, shop, vendor_email, buyer_email, status }` |
| POST | `/update` | Update order status | `{ _id, status }` |
| POST | `/view_buyer` | View buyer's orders | `{ buyer_email }` |
| POST | `/view_vendor` | View vendor's orders | `{ vendor_email }` |

**Order Status Values**:
- `"placed"` - Initial state
- `"accepted"` - Vendor accepted
- `"cooking"` - Being prepared
- `"ready"` - Ready for pickup
- `"completed"` - Picked up by buyer
- `"rejected"` - Vendor rejected

**Note**: Vendors can have max 10 concurrent orders in "accepted" + "cooking" stages.

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "error": "Error message description"
}
```

Status codes: `200` (success), `400` (bad request), `404` (not found)

## Example Requests

### Register a Buyer
```bash
POST /buyers/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "contact_no": "1234567890",
  "age": 20,
  "batch": "UG2",
  "money": 1000
}
```

### Add a Product
```bash
POST /products/add
Content-Type: application/json

{
  "name": "Cheese Maggi",
  "shop": "BBC",
  "vendor_email": "bbc@example.com",
  "type": "Veg",
  "price": 50,
  "quantity": 100,
  "status": true,
  "add_on": [
    { "name": "Extra Cheese", "price": 20 },
    { "name": "Vegetables", "price": 15 }
  ]
}
```

### Create an Order
```bash
POST /orders/add
Content-Type: application/json

{
  "name": "Cheese Maggi",
  "price": 70,
  "quantity": 2,
  "shop": "BBC",
  "vendor_email": "bbc@example.com",
  "buyer_email": "john@example.com",
  "status": "placed"
}
```

## Notes

- Most read operations use POST instead of GET for consistency and easier request body handling
- All email fields must be valid email format (validated using `validator` library)
- Price and quantity must be positive integers
- Contact numbers are validated for correct format
