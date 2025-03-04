#!/usr/bin/env node

/**
 * Tech Files Generator Script
 * This script creates the missing tech stack files in the local file system
 * which can later be uploaded to Vercel Blob when the API is working correctly.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TECH_STACKS = ['next', 'apple', 'cli', 'other'];
const DOCS_DIR = path.join(process.cwd(), 'docs');
const TEMPLATE_DIR = path.join(DOCS_DIR, 'template');
const TOOLS_DIR = path.join(DOCS_DIR, 'tools');

// Ensure docs directory exists
if (!fs.existsSync(DOCS_DIR)) {
  fs.mkdirSync(DOCS_DIR, { recursive: true });
  console.log(`Created docs directory at ${DOCS_DIR}`);
}

// Ensure template directory exists
if (!fs.existsSync(TEMPLATE_DIR)) {
  fs.mkdirSync(TEMPLATE_DIR, { recursive: true });
  console.log(`Created template directory at ${TEMPLATE_DIR}`);
}

// Ensure tools directory exists
if (!fs.existsSync(TOOLS_DIR)) {
  fs.mkdirSync(TOOLS_DIR, { recursive: true });
  console.log(`Created tools directory at ${TOOLS_DIR}`);
}

/**
 * Generate content for a specific tech stack
 */
function generateTechContent(stack) {
  let title = '';
  let coreItems = [];
  let libraries = [];
  
  switch (stack) {
    case 'next':
      title = 'Next.js';
      coreItems = [
        'React 19+', 
        'Next.js 15+', 
        'TypeScript 5.3+', 
        'Tailwind CSS 3.4+',
        'Server Components',
        'App Router'
      ];
      libraries = [
        'shadcn/ui', 
        'Tanstack Query', 
        'Zod', 
        'Prisma', 
        'Vercel Blob Storage',
        'Framer Motion'
      ];
      break;
    case 'apple':
      title = 'Apple Platform';
      coreItems = [
        'Swift 5.10+', 
        'SwiftUI 5+', 
        'Combine', 
        'Swift Data',
        'SwiftUI Navigation API'
      ];
      libraries = [
        'Swift Charts', 
        'Swift Async/Await', 
        'XCTest', 
        'Core Data',
        'Core ML'
      ];
      break;
    case 'cli':
      title = 'Command Line Interface';
      coreItems = [
        'Node.js 20+', 
        'Go 1.22+', 
        'Rust 1.76+', 
        'Cobra (Go)',
        'Clap (Rust)'
      ];
      libraries = [
        'Inquirer.js', 
        'Commander.js', 
        'Chalk/Termcolor', 
        'Bubbletea',
        'Lipgloss'
      ];
      break;
    case 'other':
      title = 'Full Stack';
      coreItems = [
        'JavaScript/TypeScript', 
        'Python 3.12+', 
        'Rust 1.76+', 
        'Go 1.22+',
        'PostgreSQL 16+'
      ];
      libraries = [
        'Docker', 
        'Kubernetes', 
        'Terraform', 
        'GraphQL',
        'REST APIs',
        'Firebase/Supabase'
      ];
      break;
  }
  
  return `# ${title} Technology Stack Guide

> Generated documentation for ${title} development.
> Last updated: ${new Date().toISOString()}

## Core Technologies

${coreItems.map(item => `- ${item}`).join('\n')}

## Recommended Libraries and Tools

${libraries.map(item => `- ${item}`).join('\n')}
`;
}

/**
 * Generate the main tech.md file
 */
function generateMainTechFile(stackContents) {
  return `# Technology Stack Guide 2024

> Comprehensive guide to modern development technologies across different platforms.
> Last updated: ${new Date().toISOString()}

${Object.entries(stackContents).map(([stack, content]) => {
  // Extract content without the header and last updated line
  const lines = content.split('\n');
  const filteredLines = lines.filter((line, index) => 
    index > 2 && !line.includes('Last updated')
  );
  return `## ${stack.charAt(0).toUpperCase() + stack.slice(1)} Technologies\n\n${filteredLines.join('\n')}`;
}).join('\n\n---\n\n')}
`;
}

// Generate and save tech stack files
const stackContents = {};

console.log('Generating tech stack files...');

for (const stack of TECH_STACKS) {
  const content = generateTechContent(stack);
  
  // Create stack directory in template
  const stackDir = path.join(TEMPLATE_DIR, stack);
  if (!fs.existsSync(stackDir)) {
    fs.mkdirSync(stackDir, { recursive: true });
  }
  
  // Save the main stack file in the stack directory
  const mainFilePath = path.join(stackDir, 'tech.md');
  fs.writeFileSync(mainFilePath, content, 'utf8');
  console.log(`✅ Created ${mainFilePath}`);
  
  // Also save a copy in the legacy location for backward compatibility
  const legacyFilePath = path.join(DOCS_DIR, `tech-${stack}.md`);
  fs.writeFileSync(legacyFilePath, content, 'utf8');
  console.log(`✅ Created legacy file ${legacyFilePath}`);
  
  stackContents[stack] = content;
  
  // Generate additional template files
  const readmeContent = `# ${stack.charAt(0).toUpperCase() + stack.slice(1)} Project

This is a template for ${stack.charAt(0).toUpperCase() + stack.slice(1)} projects generated with Luke.

## Getting Started

Follow the instructions in init.md to get started.
`;
  
  const initContent = `# Getting Started with Your ${stack.charAt(0).toUpperCase() + stack.slice(1)} Project

## Prerequisites

${stack === 'next' ? '- Node.js 20+\n- npm or yarn' : 
  stack === 'apple' ? '- Xcode 15+\n- macOS 13+' : 
  stack === 'cli' ? '- Go 1.22+ or Node.js 20+\n- Developer tools' : 
  '- Relevant development environment'}

## Setup

1. Clone the project
2. Install dependencies
3. Run the development server

## Project Structure

Refer to design.md for an overview of the project structure.
`;

  const designContent = `# ${stack.charAt(0).toUpperCase() + stack.slice(1)} Project Design

## Architecture

This document outlines the architecture and design decisions for the project.

## Components

Key components and their interactions.

## Data Flow

How data flows through the application.
`;

  // Write additional files to the stack directory
  fs.writeFileSync(path.join(stackDir, 'README.md'), readmeContent, 'utf8');
  console.log(`✅ Created ${path.join(stackDir, 'README.md')}`);
  
  fs.writeFileSync(path.join(stackDir, 'init.md'), initContent, 'utf8');
  console.log(`✅ Created ${path.join(stackDir, 'init.md')}`);
  
  fs.writeFileSync(path.join(stackDir, 'design.md'), designContent, 'utf8');
  console.log(`✅ Created ${path.join(stackDir, 'design.md')}`);
}

// Generate main tech.md file
const mainContent = generateMainTechFile(stackContents);

// Save in the tools directory
const toolsMainFilePath = path.join(TOOLS_DIR, 'tech.md');
fs.writeFileSync(toolsMainFilePath, mainContent, 'utf8');
console.log(`✅ Created ${toolsMainFilePath}`);

// Also save in legacy location for backward compatibility
const legacyMainFilePath = path.join(DOCS_DIR, 'tech.md');
fs.writeFileSync(legacyMainFilePath, mainContent, 'utf8');
console.log(`✅ Created legacy file ${legacyMainFilePath}`);

console.log('\nAll tech files have been generated in the docs directory.');
console.log('Using new structure:');
console.log('  - Tech stack templates: docs/template/{stack}/');
console.log('  - Main tech documentation: docs/tools/tech.md');
console.log('  - Legacy files maintained for backward compatibility');
console.log('\nTo manually test the files, run:');
console.log('  node scripts/generate-tech-files.js'); 