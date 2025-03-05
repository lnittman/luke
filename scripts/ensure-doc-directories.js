#!/usr/bin/env node
/**
 * Script to ensure all necessary documentation directories exist
 * Run this with: node scripts/ensure-doc-directories.js
 */
const fs = require('fs');
const path = require('path');

// List of directories to create
const directories = [
  'docs',
  'docs/memory',
  'docs/prompts',
  'docs/architecture'
];

// Function to create directories if they don't exist
function ensureDirectories() {
  directories.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`Creating directory: ${dir}`);
      fs.mkdirSync(fullPath, { recursive: true });
    } else {
      console.log(`Directory already exists: ${dir}`);
    }
  });
  
  console.log('All documentation directories have been created.');
}

// Execute the function
ensureDirectories(); 