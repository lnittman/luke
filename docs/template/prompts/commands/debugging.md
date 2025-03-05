# Debugging Commands

This document provides commands and workflows for debugging issues in [PROJECT_NAME]. Use these commands to identify, analyze, and fix problems during development.

## Debugging Environment Setup

### Browser DevTools

```bash
# Open Chrome DevTools
# Windows/Linux: F12 or Ctrl+Shift+I
# macOS: Cmd+Option+I

# Open Edge DevTools
# Windows/Linux: F12 or Ctrl+Shift+I
# macOS: Cmd+Option+I

# Open Firefox DevTools
# Windows/Linux: F12 or Ctrl+Shift+I
# macOS: Cmd+Option+I
```

### Framework DevTools

```bash
# For React/Next.js projects
# Install React DevTools Chrome Extension
# https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi

# For Vue projects
# Install Vue DevTools Chrome Extension
# https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd
```

## Console Debugging

### Basic Console Commands

```bash
# Log information to the console
console.log('Information message');

# Log warnings to the console
console.warn('Warning message');

# Log errors to the console
console.error('Error message');

# Log objects with expanded view
console.dir(object, { depth: null });

# Log tables of data
console.table(arrayOfObjects);
```

### Advanced Console Techniques

```bash
# Group related logs
console.group('Group name');
console.log('Message 1');
console.log('Message 2');
console.groupEnd();

# Track time between operations
console.time('operation');
// ... operations ...
console.timeEnd('operation');

# Count occurrences
console.count('label');
console.count('label');
// Output: label: 2

# Create conditional breakpoints
// Right-click line number in DevTools, select "Add conditional breakpoint"
// Example condition: user.role === 'admin'
```

## Network Debugging

### Network Request Analysis

```bash
# Check API endpoint response in terminal
curl -X GET "https://api.example.com/endpoint" | json_pp

# Check with headers
curl -X GET -H "Authorization: Bearer TOKEN" "https://api.example.com/endpoint" | json_pp

# Monitor all network traffic
# Use Network tab in browser DevTools
```

### Local Proxy Setup

```bash
# Install Proxy Tool (like Proxyman or Charles Proxy)
# Configure system to use proxy (typically localhost:8080)
# Install SSL certificate from the proxy tool
```

## Node.js Debugging

### Using Debug Module

```bash
# Add debug module
npm install debug

# In your code
const debug = require('debug')('app:component');
debug('Detailed debug information');

# Run with debug enabled
DEBUG=app:* node server.js
```

### Using Node Inspector

```bash
# Start Node.js with inspector
node --inspect server.js

# Start and break on first line
node --inspect-brk server.js

# Connect Chrome DevTools to inspector
# Open chrome://inspect in Chrome
```

## Testing Tools

### Unit Test Debugging

```bash
# Run specific tests in watch mode
npm test -- --watch ComponentName

# Run tests with coverage
npm test -- --coverage

# Debug failing test
node --inspect-brk node_modules/.bin/jest --runInBand TestName
```

## Performance Debugging

### Performance Analysis

```bash
# Profile React rendering
// Import Profiler
import { Profiler } from 'react';

// Use in code
<Profiler id="MyComponent" onRender={callback}>
  <MyComponent />
</Profiler>

# Analyze bundle size
npm run build -- --stats
npx webpack-bundle-analyzer build/bundle-stats.json
```

## Troubleshooting

### Common Issues

1. **"Cannot find module" errors**:
   ```bash
   # Check if module is installed
   npm ls module-name
   
   # Reinstall node modules
   rm -rf node_modules
   npm install
   ```

2. **API connection issues**:
   ```bash
   # Check API status and connectivity
   curl -I https://api.example.com/health
   
   # Check environment variables
   echo $API_URL
   ```

3. **Port already in use**:
   ```bash
   # Find process using the port
   lsof -i :3000
   
   # Kill the process
   kill -9 PROCESS_ID
   ```

4. **Memory leaks**:
   ```bash
   # Take heap snapshot in Chrome DevTools
   # Memory tab > Take snapshot
   
   # Run with increased memory
   NODE_OPTIONS=--max-old-space-size=4096 npm start
   ```

## Specialized Tools

### Framework-Specific Tools

React:
```bash
# Why did this render?
npm install @welldone-software/why-did-you-render
```

Next.js:
```bash
# Analyze bundle
ANALYZE=true npm run build
```

Vue:
```bash
# Vue CLI inspect webpack config
vue inspect > webpack.config.js
```

Node.js:
```bash
# Diagnostic report
node --report-on-fatalerror server.js
```

## Logging Best Practices

1. Use structured logging with levels
2. Include context in log messages
3. Use correlation IDs across service boundaries
4. Log at appropriate levels (debug, info, warn, error)
5. Don't log sensitive information

## Next Steps

After debugging issues:

1. Document the issue and solution
2. Add regression tests if applicable
3. Consider implementing monitoring for similar issues
4. Review error handling approach if needed 