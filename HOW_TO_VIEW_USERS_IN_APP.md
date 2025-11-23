# How to View Users in the Application (After Admin Login)

## Quick Steps

1. **Login as Admin:**
   - Go to: `http://localhost:3000/login`
   - Email: `admin@stockmaster.com`
   - Password: `admin123`

2. **Access Users Page:**
   - After logging in, you'll see a **"Users"** menu item in the left sidebar
   - Click on **"Users"** to view all system users

3. **View User Details:**
   - The Users page displays:
     - User name and avatar
     - Email address
     - Role (Inventory Manager or Warehouse Staff)
     - Account creation date
     - User ID

## Features Available

### Search & Filter
- **Search**: Type in the search box to find users by name or email
- **Filter by Role**: Use the dropdown to filter by role (Inventory Manager or Warehouse Staff)

### User Information Displayed
- ✅ User Name
- ✅ Email Address
- ✅ Role (with color-coded badges)
- ✅ Creation Date
- ✅ User ID

### Security Notes
- ⚠️ **Passwords are NOT displayed** - They are securely hashed and cannot be viewed
- 🔒 **Admin Access Only** - Only users with "Inventory Manager" role can access this page
- 🛡️ **Protected Route** - The page requires authentication and admin privileges

## Access Control

- **Inventory Managers**: Can view the Users page (menu item visible)
- **Warehouse Staff**: Cannot access the Users page (menu item hidden, access denied if URL is accessed directly)

## Troubleshooting

### "Users" menu item not visible?
- Make sure you're logged in as an **Inventory Manager** (admin)
- Check your role in your profile page
- Logout and login again with admin credentials

### "Access Denied" message?
- You need admin privileges (Inventory Manager role)
- Contact your system administrator to change your role

### No users showing?
- The system creates default users on first start
- Users can also be created via the Signup page
- Check the server console for default user credentials

## Default Test Users

When the server starts, these users are automatically created:

1. **Admin User**
   - Email: `admin@stockmaster.com`
   - Password: `admin123`
   - Role: Inventory Manager

2. **Staff User**
   - Email: `staff@stockmaster.com`
   - Password: `staff123`
   - Role: Warehouse Staff

## API Endpoint (Alternative Method)

You can also view users via the API:

```bash
# Using curl (replace YOUR_TOKEN with actual JWT token)
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/auth/users
```

Or use Postman/Thunder Client with:
- Method: `GET`
- URL: `http://localhost:5000/api/auth/users`
- Headers: `Authorization: Bearer YOUR_TOKEN`
