/**
 * Script to create a test user for development
 * Run with: node server/scripts/create-test-user.js
 */

import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Initialize global users if not exists
global.users = global.users || [];

// Test user credentials
const testUsers = [
  {
    email: 'admin@stockmaster.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'inventory_manager'
  },
  {
    email: 'staff@stockmaster.com',
    password: 'staff123',
    name: 'Warehouse Staff',
    role: 'warehouse_staff'
  }
];

async function createTestUsers() {
  console.log('Creating test users...\n');

  for (const userData of testUsers) {
    // Check if user already exists
    const existingUser = global.users.find(u => u.email === userData.email);
    
    if (existingUser) {
      console.log(`User ${userData.email} already exists. Skipping...`);
      continue;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = {
      id: uuidv4(),
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      role: userData.role,
      createdAt: new Date().toISOString()
    };

    global.users.push(user);

    console.log('✅ User created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email:    ${userData.email}`);
    console.log(`Password: ${userData.password}`);
    console.log(`Name:     ${userData.name}`);
    console.log(`Role:     ${userData.role}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  }

  console.log(`Total users in system: ${global.users.length}`);
  console.log('\n⚠️  Note: This script only works with in-memory storage.');
  console.log('   Users will be lost when the server restarts.');
  console.log('   For persistent storage, integrate a database.\n');
}

// Run the script
createTestUsers().catch(console.error);
