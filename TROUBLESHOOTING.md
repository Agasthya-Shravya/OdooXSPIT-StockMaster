# Troubleshooting White Page Issue

If you're seeing a white page, follow these steps:

## 1. Check Browser Console
Open browser DevTools (F12) and check the Console tab for JavaScript errors.

## 2. Check Network Tab
Verify that all files are loading correctly (no 404 errors).

## 3. Common Issues and Fixes

### Issue: JavaScript Error
**Solution**: Check the browser console for specific error messages. Common errors:
- Import errors: Make sure all imports are correct
- Component errors: Check if all components exist
- Syntax errors: Check for typos in code

### Issue: CSS Not Loading
**Solution**: 
1. Make sure Tailwind CSS is installed: `npm install`
2. Check if `index.css` is imported in `main.jsx`
3. Verify Tailwind config is correct

### Issue: Build Errors
**Solution**:
1. Stop the dev server (Ctrl+C)
2. Delete `node_modules` and `package-lock.json`
3. Run `npm install` again
4. Start server: `npm run dev`

### Issue: Port Already in Use
**Solution**:
1. Change port in `vite.config.js`
2. Or kill the process using the port

## 4. Quick Fix Steps

1. **Clear browser cache**: Ctrl+Shift+Delete
2. **Hard refresh**: Ctrl+Shift+R or Ctrl+F5
3. **Check terminal**: Look for error messages in the terminal where you ran `npm run dev`
4. **Check if server is running**: Make sure both frontend and backend servers are running

## 5. Verify Installation

Run these commands:
```bash
cd client
npm install
npm run dev
```

## 6. Check Files Exist

Verify these files exist:
- `client/src/App.jsx`
- `client/src/main.jsx`
- `client/src/index.css`
- `client/src/components/ErrorBoundary.jsx`
- `client/src/components/AnimatedCard.jsx`
- `client/src/components/StockIllustration.jsx`

## 7. Error Messages to Look For

- "Cannot find module" - Missing import or file
- "Unexpected token" - Syntax error
- "Cannot read property" - Null/undefined error
- "Failed to fetch" - API connection issue

## 8. If Still Not Working

1. Check the terminal output for compilation errors
2. Share the browser console error message
3. Verify Node.js version (should be 16+)
4. Try a fresh install:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
