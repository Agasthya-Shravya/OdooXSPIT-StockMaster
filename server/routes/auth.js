import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Import authenticateToken - we'll define it locally to avoid circular dependency
const JWT_SECRET_AUTH = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET_AUTH, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
global.otpStore = global.otpStore || {};

// Sign up
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name, role = 'warehouse_staff' } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Check if user exists
    const existingUser = global.users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      name,
      role,
      createdAt: new Date().toISOString()
    };

    global.users.push(user);

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = global.users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Request OTP for password reset
router.post('/forgot-password', (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = global.users.find(u => u.email === email);
    if (!user) {
      // Don't reveal if user exists for security
      return res.json({ message: 'If the email exists, an OTP has been sent' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    global.otpStore[email] = {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    };

    // In production, send email here
    console.log(`OTP for ${email}: ${otp}`);

    res.json({ message: 'OTP sent to email', otp: otp }); // Remove otp in production
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify OTP and reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'Email, OTP, and new password are required' });
    }

    const otpData = global.otpStore[email];
    if (!otpData || otpData.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    if (Date.now() > otpData.expiresAt) {
      delete global.otpStore[email];
      return res.status(400).json({ error: 'OTP expired' });
    }

    const user = global.users.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    delete global.otpStore[email];

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users (for admin purposes only)
// NOTE: Passwords are hashed and cannot be retrieved
// This endpoint requires authentication
router.get('/users', authenticateToken, async (req, res) => {
  try {
    // Optional: Check if user is admin (inventory_manager)
    // For now, any authenticated user can view users
    // Uncomment below to restrict to admins only:
    // if (req.user.role !== 'inventory_manager') {
    //   return res.status(403).json({ error: 'Admin access required' });
    // }

    // Return users without password field for security
    const usersWithoutPasswords = global.users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt
    }));
    
    res.json({
      total: usersWithoutPasswords.length,
      users: usersWithoutPasswords,
      note: 'Passwords are hashed and cannot be retrieved. Use signup to create new users or reset-password to change passwords.'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
