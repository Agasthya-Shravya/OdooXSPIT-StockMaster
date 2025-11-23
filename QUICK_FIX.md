# Quick Fix for White Page

## Immediate Steps:

1. **Open Browser Console** (Press F12)
   - Check for any red error messages
   - Share the error message if you see one

2. **Check Terminal Output**
   - Look at the terminal where you ran `npm run dev`
   - Check for compilation errors

3. **Try These Commands:**

```bash
# Stop the server (Ctrl+C)

# Navigate to client folder
cd client

# Clear cache and reinstall
rm -rf node_modules
rm package-lock.json
npm install

# Start again
npm run dev
```

4. **Check if Server is Running:**
   - Frontend should be on: http://localhost:3000
   - Backend should be on: http://localhost:5000
   - Make sure BOTH are running

5. **Hard Refresh Browser:**
   - Windows: Ctrl + Shift + R
   - Mac: Cmd + Shift + R

6. **Check Browser Console for:**
   - "Failed to fetch" - Backend not running
   - "Cannot find module" - Missing file
   - "Unexpected token" - Syntax error

## Most Common Issues:

### Issue 1: Backend Not Running
**Solution**: Open a new terminal and run:
```bash
npm run server
```

### Issue 2: Port Already in Use
**Solution**: Change port in `client/vite.config.js`:
```javascript
server: {
  port: 3001, // Change from 3000 to 3001
}
```

### Issue 3: Missing Dependencies
**Solution**: 
```bash
cd client
npm install
```

### Issue 4: Build Error
**Solution**: Check terminal for specific error and fix it

## If Still White Page:

1. Check if you can see the login page at: http://localhost:3000/login
2. If login page shows, the issue is with authentication/routing
3. If nothing shows, check browser console for errors

## Debug Mode:

Add this to `client/src/main.jsx` temporarily to see if React is loading:

```javascript
console.log('React is loading...');
```

If you see this in console, React is working. If not, there's a build issue.
