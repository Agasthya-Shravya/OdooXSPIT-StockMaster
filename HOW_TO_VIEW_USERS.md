# How to View Login Details / Users

Since the system uses **in-memory storage** (not a database), users are stored in the server's memory. Here are several ways to view and manage users:

## Method 1: API Endpoint (Recommended)

After starting the server, you can view all users via the API:

```bash
# View all users (without passwords - they're hashed)
curl http://localhost:5000/api/auth/users
```

Or use a browser/Postman:
- URL: `http://localhost:5000/api/auth/users`
- Method: `GET`

**Response:**
```json
{
  "total": 2,
  "users": [
    {
      "id": "user-id-1",
      "email": "admin@stockmaster.com",
      "name": "Admin User",
      "role": "inventory_manager",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "note": "Passwords are hashed and cannot be retrieved..."
}
```

## Method 2: Default Test Users

The server automatically creates default test users when it starts (if no users exist):

### Default Credentials:

**Admin User:**
- Email: `admin@stockmaster.com`
- Password: `admin123`
- Role: Inventory Manager

**Staff User:**
- Email: `staff@stockmaster.com`
- Password: `staff123`
- Role: Warehouse Staff

These credentials are displayed in the server console when you start the server.

## Method 3: Check Server Console

When the server starts, it will print the default users:
```
✓ Default users created:
  📧 admin@stockmaster.com / admin123 (Inventory Manager)
  📧 staff@stockmaster.com / staff123 (Warehouse Staff)
```

## Method 4: Create New Users via Signup

1. Go to the signup page: `http://localhost:3000/signup`
2. Fill in the form with:
   - Name
   - Email
   - Password
   - Role
3. Click "Sign Up"

The new user will be added to the system.

## Method 5: View Users in Code (Development)

If you want to see users directly in the code, you can add a console.log in `server/index.js`:

```javascript
// After server starts
console.log('Current users:', global.users.map(u => ({
  email: u.email,
  name: u.name,
  role: u.role
})));
```

## Important Notes:

⚠️ **Passwords are hashed** - You cannot see the actual passwords because they are encrypted using bcrypt. This is a security feature.

⚠️ **In-memory storage** - Users are stored in memory, so they will be lost when the server restarts (unless you've created them via signup and the server hasn't restarted).

⚠️ **For production** - Replace the in-memory storage with a real database (MongoDB, PostgreSQL, MySQL, etc.) for persistent storage.

## Quick Test:

1. Start the server: `npm run server`
2. Check the console for default user credentials
3. Or visit: `http://localhost:5000/api/auth/users`
4. Use the credentials to login at: `http://localhost:3000/login`

## For Database Integration:

If you want to use a real database, you would:

1. Install a database driver (e.g., `mongoose` for MongoDB, `pg` for PostgreSQL)
2. Replace `global.users` with database queries
3. Users will persist across server restarts

Example with MongoDB:
```javascript
// Instead of global.users.push(user)
await User.create(user);
```
