# StockMaster - Inventory Management System

A comprehensive, modular Inventory Management System (IMS) that digitizes and streamlines all stock-related operations within a business. This system replaces manual registers, Excel sheets, and scattered tracking methods with a centralized, real-time, easy-to-use application.

## Features

### 🔐 Authentication
- User sign up and login
- OTP-based password reset
- Role-based access (Inventory Manager, Warehouse Staff)
- Secure JWT token authentication

### 📊 Dashboard
- Real-time KPIs:
  - Total Products in Stock
  - Low Stock / Out of Stock Items
  - Pending Receipts
  - Pending Deliveries
  - Internal Transfers Scheduled
- Dynamic filters by document type, status, and warehouse
- Recent activity tracking

### 📦 Product Management
- Create, update, and delete products
- Product categories
- SKU/Code management
- Unit of measure tracking
- Stock availability per location/warehouse
- Search and filter capabilities

### 📥 Receipts (Incoming Goods)
- Create receipt orders from suppliers
- Add multiple products with quantities
- Validate receipts to automatically increase stock
- Track receipt status (Draft, Waiting, Ready, Done, Canceled)

### 📤 Delivery Orders (Outgoing Goods)
- Create delivery orders for customers
- Pick and pack items
- Validate deliveries to automatically decrease stock
- Stock availability checking before validation

### 🔄 Internal Transfers
- Move stock between warehouses/locations
- Track transfers from source to destination
- Automatic stock updates in both locations
- Complete transfer history

### ✏️ Stock Adjustments
- Fix mismatches between recorded and physical stock
- Select product and location
- Enter counted quantity
- Automatic adjustment calculation
- Logged in the ledger

### 📋 Move History (Stock Ledger)
- Complete audit trail of all stock movements
- Filter by product, warehouse, type, and date range
- Track receipts, deliveries, transfers, and adjustments
- Real-time stock movement logging

### ⚙️ Settings
- Warehouse management (Create, Edit, Delete)
- Warehouse location tracking
- Multi-warehouse support

### 👤 Profile
- User profile information
- Role display
- Account management

## Technology Stack

### Frontend
- **React 18** - UI library
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Icons** - Icon library
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **UUID** - Unique ID generation

## Installation

1. **Install root dependencies:**
```bash
npm install
```

2. **Install client dependencies:**
```bash
cd client
npm install
cd ..
```

Or use the convenience script:
```bash
npm run install-all
```

## Running the Application

### Development Mode

Run both server and client concurrently:
```bash
npm run dev
```

Or run them separately:

**Server (port 5000):**
```bash
npm run server
```

**Client (port 3000):**
```bash
npm run client
```

### Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Usage

### Getting Started

1. **Login**: The system automatically creates default test users when the server starts:
   - **Admin**: `admin@stockmaster.com` / `admin123` (Inventory Manager)
   - **Staff**: `staff@stockmaster.com` / `staff123` (Warehouse Staff)
   
   Or **Sign Up**: Create a new account with your email, name, and role

2. **Set Up Warehouses**: Go to Settings and add your warehouses
3. **Add Products**: Navigate to Products and create your inventory items
4. **Start Managing**: Use Receipts, Deliveries, Transfers, and Adjustments to manage your stock

### Viewing Users / Login Details

To view all users in the system:
- **API Endpoint**: `GET http://localhost:5000/api/auth/users`
- **Server Console**: Default users are printed when the server starts
- **Note**: Passwords are hashed and cannot be retrieved (security feature)

See `HOW_TO_VIEW_USERS.md` for more details.

### Workflow Example

1. **Receive Goods**: Create a Receipt → Add supplier and products → Validate to increase stock
2. **Move Stock**: Create an Internal Transfer → Select source and destination → Validate to move stock
3. **Deliver Goods**: Create a Delivery Order → Add customer and products → Validate to decrease stock
4. **Adjust Stock**: Create an Adjustment → Enter counted quantity → Apply to update stock

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request OTP
- `POST /api/auth/reset-password` - Reset password with OTP

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/categories/list` - Get all categories

### Receipts
- `GET /api/receipts` - Get all receipts
- `GET /api/receipts/:id` - Get receipt by ID
- `POST /api/receipts` - Create receipt
- `PUT /api/receipts/:id` - Update receipt
- `POST /api/receipts/:id/validate` - Validate receipt (update stock)

### Deliveries
- `GET /api/deliveries` - Get all deliveries
- `GET /api/deliveries/:id` - Get delivery by ID
- `POST /api/deliveries` - Create delivery
- `PUT /api/deliveries/:id` - Update delivery
- `POST /api/deliveries/:id/validate` - Validate delivery (update stock)

### Transfers
- `GET /api/transfers` - Get all transfers
- `GET /api/transfers/:id` - Get transfer by ID
- `POST /api/transfers` - Create transfer
- `PUT /api/transfers/:id` - Update transfer
- `POST /api/transfers/:id/validate` - Validate transfer (move stock)

### Adjustments
- `GET /api/adjustments` - Get all adjustments
- `GET /api/adjustments/:id` - Get adjustment by ID
- `POST /api/adjustments` - Create adjustment
- `POST /api/adjustments/:id/apply` - Apply adjustment (update stock)

### Dashboard
- `GET /api/dashboard/kpis` - Get dashboard KPIs
- `GET /api/dashboard/recent-activity` - Get recent activity

### Warehouses
- `GET /api/warehouses` - Get all warehouses
- `GET /api/warehouses/:id` - Get warehouse by ID
- `POST /api/warehouses` - Create warehouse
- `PUT /api/warehouses/:id` - Update warehouse
- `DELETE /api/warehouses/:id` - Delete warehouse

### Ledger
- `GET /api/ledger` - Get ledger entries
- `GET /api/ledger/product/:productId` - Get ledger for specific product

## Project Structure

```
Stock/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/       # React contexts (Auth)
│   │   ├── pages/          # Page components
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js backend
│   ├── routes/             # API routes
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── receipts.js
│   │   ├── deliveries.js
│   │   ├── transfers.js
│   │   ├── adjustments.js
│   │   ├── dashboard.js
│   │   ├── warehouses.js
│   │   └── ledger.js
│   └── index.js            # Server entry point
├── package.json
└── README.md
```

## Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile devices

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected API routes
- Input validation
- Secure password reset with OTP

## Future Enhancements

- Email notifications for low stock
- Barcode scanning support
- Advanced reporting and analytics
- Export to Excel/PDF
- Reordering rules automation
- Multi-language support
- Dark mode

## License

MIT

## Support

For issues, questions, or contributions, please open an issue on the repository.

---

**StockMaster** - Streamlining inventory management, one transaction at a time.
