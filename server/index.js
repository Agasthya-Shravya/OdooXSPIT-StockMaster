import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import authRoutes from './routes/auth.js';
import productsRoutes from './routes/products.js';
import receiptsRoutes from './routes/receipts.js';
import deliveriesRoutes from './routes/deliveries.js';
import transfersRoutes from './routes/transfers.js';
import adjustmentsRoutes from './routes/adjustments.js';
import dashboardRoutes from './routes/dashboard.js';
import warehousesRoutes from './routes/warehouses.js';
import ledgerRoutes from './routes/ledger.js';
import { initializeDefaultUsers } from './scripts/init-users.js';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

app.use(cors());
app.use(express.json());

// In-memory data storage (in production, use a proper database)
global.users = global.users || [];
global.products = global.products || [];
global.receipts = global.receipts || [];
global.deliveries = global.deliveries || [];
global.transfers = global.transfers || [];
global.adjustments = global.adjustments || [];
global.ledger = global.ledger || [];
global.warehouses = global.warehouses || [
  { id: '1', name: 'Main Warehouse', location: 'Headquarters', createdAt: new Date().toISOString() },
  { id: '2', name: 'Production Floor', location: 'Building A', createdAt: new Date().toISOString() }
];

// Middleware for authentication
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

app.use('/api/auth', authRoutes);
// Note: /api/auth/users endpoint requires authentication
// It's part of authRoutes but should be protected - we'll add middleware if needed
app.use('/api/products', authenticateToken, productsRoutes);
app.use('/api/receipts', authenticateToken, receiptsRoutes);
app.use('/api/deliveries', authenticateToken, deliveriesRoutes);
app.use('/api/transfers', authenticateToken, transfersRoutes);
app.use('/api/adjustments', authenticateToken, adjustmentsRoutes);
app.use('/api/dashboard', authenticateToken, dashboardRoutes);
app.use('/api/warehouses', authenticateToken, warehousesRoutes);
app.use('/api/ledger', authenticateToken, ledgerRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'StockMaster API Server' });
});

// Initialize default users on server start
initializeDefaultUsers().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}`);
    console.log(`\n📝 Test Login Credentials:`);
    console.log(`   Admin: admin@stockmaster.com / admin123`);
    console.log(`   Staff: staff@stockmaster.com / staff123\n`);
  });
});
