# MCP Client and Server

This repository contains a full-stack e-commerce application with multiple microservices. The project is built using modern web technologies and follows a microservices architecture pattern.

## Technologies Used

### Frontend Applications
- **Frontend (Customer Portal)**
  - React.js
  - TypeScript
  - Modern UI frameworks
  - State management libraries

- **Admin Dashboard**
  - React.js
  - TypeScript
  - Admin-specific UI components
  - Dashboard analytics

### Backend Services
- **Products API**
  - Node.js
  - Express.js
  - Database integration
  - RESTful API endpoints

- **Fulfillment API**
  - Node.js
  - Express.js
  - Order processing
  - Shipping integration

- **MCP Order Server**
  - Node.js
  - Express.js
  - Order management
  - Payment processing

### Development Tools
- PNPM for package management
- NX for monorepo management
- TypeScript for type safety
- Modern development tooling

## Features

### Customer Portal (Frontend)
- Product browsing and search
- Shopping cart functionality
- User authentication
- Order tracking
- Responsive design

### Admin Dashboard
- Product management
- Order management
- User management
- Analytics and reporting
- Inventory tracking

### Backend Services
- RESTful API endpoints
- Database integration
- Authentication and authorization
- Order processing
- Payment integration
- Shipping management

## Installation

### Prerequisites
- Node.js (Latest LTS version)
- PNPM (version 10.6.5 or higher)
- Git

### Setup Instructions

1. Clone the repository:
```bash
git clone [repository-url]
cd mcp-client-and-server
```

2. Install dependencies:

For Windows:
```bash
pnpm install:win
```

For Mac:
```bash
pnpm install:mac
```

## Usage

### Development Mode

For Windows:
```bash
# Run all services in parallel
pnpm dev:win

# Or run in separate terminals
pnpm dev:terminals:win
```

For Mac:
```bash
pnpm dev:mac
```

### Accessing the Applications

After starting the development servers, you can access the applications at:

- Frontend (Customer Portal): `http://localhost:3000`
- Admin Dashboard: `http://localhost:3001`
- Products API: `http://localhost:3002`
- Fulfillment API: `http://localhost:3003`
- MCP Order Server: `http://localhost:3004`

### Cleaning the Project

To clean all node_modules and lock files:

For Windows:
```bash
pnpm clean:win
```

For Mac:
```bash
pnpm clean:mac
```

## API Contract

### Products API (`http://localhost:8082`)
| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|-----------|
| GET | `/products` | Get all products | - | Array of products with image URLs |

### Fulfillment API (`http://localhost:8080`)
| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|-----------|
| GET | `/orders` | Get all orders | - | Array of orders |
| GET | `/inventory` | Get inventory status | - | Array of inventory items |
| POST | `/purchase` | Create a new purchase | `{ items: [{ guitarId: number, quantity: number }], customerName: string }` | Created order object |

### MCP Server Capabilities
The MCP (Model Context Protocol) Server provides the following tools:

1. **getOrders**
   - Description: Retrieves all product orders
   - Returns: List of orders in JSON format

2. **getInventory**
   - Description: Retrieves current product inventory
   - Returns: List of inventory items in JSON format

3. **purchase**
   - Description: Creates a new purchase order
   - Parameters:
     - `items`: Array of objects containing:
       - `guitarId`: ID of the guitar to purchase
       - `quantity`: Number of guitars to purchase
     - `customerName`: Name of the customer
   - Returns: Created order object in JSON format

The MCP Server can be accessed via:
- SSE (Server-Sent Events) endpoint: `http://localhost:8081/sse`
- Messages endpoint: `http://localhost:8081/messages`

## Project Structure

```
mcp-client-and-server/
├── apps/
│   ├── admin/              # Admin dashboard application
│   ├── frontend/           # Customer portal application
│   ├── mcp-order-server/   # Order management service
│   ├── fulfillment-api/    # Fulfillment service
│   └── products-api/       # Product management service
├── package.json           # Root package.json
└── pnpm-workspace.yaml    # PNPM workspace configuration
``` 