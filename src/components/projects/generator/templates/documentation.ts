/**
 * Document Templates Module
 * Contains templates for generating project documentation with customizable parameters
 */

/**
 * Generate a design document based on project parameters
 */
export const generateDesignDoc = (projectName: string, description: string, techStack: string): string => {
  let frontend = 'Native platform UI';
  let backend = 'Node.js';
  let storage = 'SQLite';

  // Customize based on tech stack
  if (techStack === 'Next.js') {
    frontend = 'Next.js with React and TypeScript';
    backend = 'Next.js API routes';
    storage = 'Prisma with PostgreSQL';
  } else if (techStack === 'Apple') {
    frontend = 'SwiftUI and UIKit';
    backend = 'Swift backend';
    storage = 'CoreData and CloudKit';
  } else if (techStack === 'CLI') {
    frontend = 'Command-line interface';
    backend = 'Node.js backend';
    storage = 'Local file system';
  }

  return `# Design Document for ${projectName}

## Overview
${description}

## User Experience
- Clean, intuitive interface
- Responsive design for all devices
- Accessibility features for all users

## Technical Architecture
- Frontend: ${frontend}
- Backend: ${backend}
- Data Storage: ${storage}

## Design Principles
- Simplicity
- Performance
- Scalability
- Security
`;
};

/**
 * Generate an implementation guide based on project parameters
 */
export const generateImplementationDoc = (projectName: string, techStack: string): string => {
  let projectStructure = `
## Project Structure
- src/
  - components/
  - lib/
  - pages/
  - styles/`;

  let apiEndpoints = `
## API Endpoints
- GET /api/endpoint1
- POST /api/endpoint2
- PUT /api/endpoint3`;

  let deployment = `
## Deployment
- Instructions for deploying to production`;

  // Customize based on tech stack
  if (techStack === 'Next.js') {
    projectStructure = `
## Project Structure
- src/
  - app/         # App router pages
  - components/  # UI components
  - lib/         # Utilities and hooks
  - styles/      # Global styling`;
    
    deployment = `
## Deployment
- Vercel deployment recommended
- Environment variables:
  - DATABASE_URL
  - API_KEY`;
  } else if (techStack === 'Apple') {
    projectStructure = `
## Project Structure
- [ProjectName]/
  - Views/         # SwiftUI views
  - Models/        # Data models
  - ViewModels/    # Business logic
  - Services/      # API and data services
  - Resources/     # Assets and config files`;
    
    apiEndpoints = `
## Services
- UserService: Handles user authentication
- DataService: Manages data persistence
- APIService: Handles external API requests`;
    
    deployment = `
## Deployment
- TestFlight for beta testing
- App Store Connect for production release
- Certificates and provisioning profiles required`;
  } else if (techStack === 'CLI') {
    projectStructure = `
## Project Structure
- src/
  - commands/    # CLI commands
  - utils/       # Utility functions
  - config/      # Configuration
- bin/           # Executable scripts`;
    
    apiEndpoints = `
## Commands
- init: Initialize the application
- config: Configure settings
- run: Execute main functionality`;
    
    deployment = `
## Deployment
- npm publish for package distribution
- Binary distribution with pkg`;
  }

  return `# Implementation Guide for ${projectName}

## Getting Started
1. Clone the repository
2. Install dependencies
3. Run development server
${projectStructure}

## Key Components
- Component 1: Description
- Component 2: Description
- Component 3: Description
${apiEndpoints}
${deployment}
`;
};

/**
 * Generate an index (overview) document based on project parameters
 */
export const generateIndexDoc = (projectName: string, description: string): string => {
  return `# ${projectName}

${description}

## Features

- Feature 1
- Feature 2
- Feature 3
`;
}; 