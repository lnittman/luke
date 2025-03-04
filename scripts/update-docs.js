#!/usr/bin/env node

/**
 * Documentation Structure Update Script
 * 
 * This script organizes the documentation files into the new structure:
 * - docs/luke - Luke app specific documentation
 * - docs/tools - External tech/library/API documentation
 * - docs/template - Tech stack templates (apple/cli/next/other)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Directory constants
const DOCS_DIR = path.join(process.cwd(), 'docs');
const LUKE_DIR = path.join(DOCS_DIR, 'luke');
const TOOLS_DIR = path.join(DOCS_DIR, 'tools');
const TEMPLATE_DIR = path.join(DOCS_DIR, 'template');

// Ensure directories exist
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
}

// Copy file if it exists
function copyFileIfExists(src, dest) {
  if (fs.existsSync(src)) {
    // Create parent directory if needed
    const parentDir = path.dirname(dest);
    ensureDir(parentDir);
    
    // Copy the file
    fs.copyFileSync(src, dest);
    console.log(`Copied: ${src} -> ${dest}`);
    return true;
  }
  return false;
}

// Main script
async function main() {
  console.log('Updating documentation structure...');
  
  // Ensure base directories exist
  ensureDir(DOCS_DIR);
  ensureDir(LUKE_DIR);
  ensureDir(TOOLS_DIR);
  ensureDir(TEMPLATE_DIR);
  
  // Create stack directories
  const stacks = ['next', 'apple', 'cli', 'other'];
  stacks.forEach(stack => {
    ensureDir(path.join(TEMPLATE_DIR, stack));
  });
  
  // Move tech files to their proper locations
  let movedFiles = 0;
  
  // Main tech.md should go to docs/tools/
  if (copyFileIfExists(path.join(DOCS_DIR, 'tech.md'), path.join(TOOLS_DIR, 'tech.md'))) {
    movedFiles++;
  }
  
  // Stack-specific tech files
  stacks.forEach(stack => {
    const srcPath = path.join(DOCS_DIR, `tech-${stack}.md`);
    const destPath = path.join(TEMPLATE_DIR, stack, 'tech.md');
    
    if (copyFileIfExists(srcPath, destPath)) {
      movedFiles++;
    }
  });
  
  // Generate example files
  if (movedFiles === 0) {
    console.log('No existing tech files found. Generating sample content...');
    
    // Generate sample content for Luke documentation
    const lukeReadme = `# Luke CLI Documentation

> Documentation for the Luke CLI application.

## Overview

Luke is an AI-powered productivity tool that helps developers build software faster.
`;
    
    fs.writeFileSync(path.join(LUKE_DIR, 'README.md'), lukeReadme);
    console.log(`Created sample Luke readme`);
    
    // Generate sample content for Tools documentation
    const toolsReadme = `# Development Tools

> Documentation for various development tools and libraries.

## Categories

- Frontend Frameworks
- Backend Technologies
- Databases
- DevOps Tools
`;
    
    fs.writeFileSync(path.join(TOOLS_DIR, 'README.md'), toolsReadme);
    console.log(`Created sample Tools readme`);
    
    // Generate tech files using the generate-tech-files.js script if it exists
    const techGenScript = path.join(process.cwd(), 'scripts', 'generate-tech-files.js');
    if (fs.existsSync(techGenScript)) {
      console.log('Generating tech files using generate-tech-files.js...');
      try {
        execSync(`node ${techGenScript}`, { stdio: 'inherit' });
        console.log('Tech files generated successfully');
      } catch (error) {
        console.error('Error generating tech files:', error);
      }
    }
  }
  
  console.log('\nDocumentation structure update complete!');
  console.log('New structure:');
  console.log('- docs/luke - Luke app specific documentation');
  console.log('- docs/tools - Tech/library/API/tool documentation');
  console.log('- docs/template - Tech stack templates');
  console.log('  - docs/template/next - Next.js stack files');
  console.log('  - docs/template/apple - Apple stack files');
  console.log('  - docs/template/cli - CLI stack files');
  console.log('  - docs/template/other - Other stack files');
  
  // Instructions
  console.log('\nTo view documentation:');
  console.log('Run: go run cli/*.go docs');
}

// Run the script
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
}); 