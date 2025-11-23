/**
 * Initialize default users when server starts
 * This will be called from server/index.js
 */

import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export async function initializeDefaultUsers() {
  // Only create if no users exist
  if (global.users && global.users.length > 0) {
    console.log(`✓ ${global.users.length} user(s) already exist in system`);
    return;
  }

  console.log('Initializing default test users...');

  const defaultUsers = [
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

  for (const userData of defaultUsers) {
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
  }

  console.log('✓ Default users created:');
  console.log('  📧 admin@stockmaster.com / admin123 (Inventory Manager)');
  console.log('  📧 staff@stockmaster.com / staff123 (Warehouse Staff)');
  console.log('');
}
