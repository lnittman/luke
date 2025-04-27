// Import static templates instead of using fs
import * as path from 'path';
import * as fs from 'fs';

// Define the type for tech stack options
export type TechStackOption = 'Next.js' | 'Apple' | 'CLI' | 'Other';

// Map tech stack options to directory names
const TEMPLATE_DIRECTORIES: Record<TechStackOption, string> = {
  'Next.js': 'template/stack/next',
  'Apple': 'template/stack/apple',
  'CLI': 'template/stack/cli',
  'Other': 'template/stack/other'
};

// Define keys used in the templates object for type safety
type TemplateKey = 'next' | 'apple' | 'cli' | 'other';
type TemplateFileKey = 'index.md' | 'design.md' | 'code.md';

// Static templates for each tech stack with proper typing
const TEMPLATES: Record<TemplateKey, Record<TemplateFileKey, string>> = {
  next: {
    'index.md': `# Next.js AI Project Template 2025

This template provides a comprehensive guide for building AI-native applications with Next.js, Vercel AI SDK, and modern best practices.`,
    'design.md': `# Next.js Design System Guide

This document outlines the design principles and components for Next.js applications.`,
    'code.md': `# Next.js Implementation Guide

This document provides implementation details for the Next.js project.`
  },
  apple: {
    'index.md': `# Apple Platform Development Guide

This document provides a comprehensive guide for developing applications for Apple platforms.`,
    'design.md': `# Apple Platform Design Guide

This document outlines design principles for Apple platform applications.`,
    'code.md': `# Apple Platform Implementation Guide

This document provides implementation details for Apple platform applications.`
  },
  cli: {
    'index.md': `# CLI Application Framework

> Modern command-line application development framework with AI-enhanced capabilities`,
    'design.md': `# CLI Design System Guide

This document outlines design principles and patterns for command-line interfaces.`,
    'code.md': `# CLI Implementation Guide

This document provides implementation details for command-line applications.`
  },
  other: {
    'index.md': `# Custom Project Documentation

This project uses a custom technology stack tailored to its specific requirements.`,
    'design.md': `# Design System Documentation

This document outlines the design principles and UI/UX guidelines for the project.`,
    'code.md': `# Implementation Guide

This document provides implementation details and coding standards for the project.`
  }
};

// Default init template
const INIT_TEMPLATE = `# LLM Development Protocol

## Role Definition

You are an expert agentic development assistant with comprehensive knowledge of modern software engineering. Your primary objective is to successfully implement the project described in the documentation, using and maintaining memory to preserve context throughout development.

## Core Capabilities

1. **Context Management**: Actively seek, process and maintain relevant context from project documentation and code.
2. **Tool Utilization**: Intelligently use Cursor's AI code tools and filesystem navigation.
3. **Adaptive Reasoning**: Adjust your approach based on project requirements, tech stack, and evolving needs.
4. **Memory Management**: Store and retrieve key information in memory banks to maintain continuity.
5. **Role Adaptation**: Switch between different specialized roles as needed for different tasks.

## Context Awareness Protocol

When working on this project, follow these guidelines:

1. **Project Understanding**:
   - On first activation, read and comprehend the core documentation (index.md, design.md, code.md, tech.md)
   - Create a mental model of the project architecture
   - Reference the documentation frequently to ensure alignment with project vision

2. **Repository Navigation**:
   - Use project structure understanding to locate relevant files
   - When exploring new areas, examine file trees to understand organization
   - Recognize file patterns common to the project's tech stack (e.g., Next.js App Router, React components)

3. **Code Context Integration**:
   - Connect code changes to architectural principles defined in design.md
   - Ensure technology choices align with tech.md recommendations
   - Follow implementation patterns established in code.md`;

// Default instructions template
const INSTRUCTIONS_TEMPLATE = `# [PROJECT_NAME] Implementation Guide

## Project Overview

[PROJECT_NAME] is [SHORT_DESCRIPTION]. This document provides specific instructions for implementing the project using the documentation and codebase effectively.

## Implementation Workflow

Follow this sequence to implement the project efficiently:

1. **Environment Setup**
   - Set up development environment based on tech stack in \`tech.md\`
   - Install required dependencies
   - Configure development tools

2. **Core Architecture Implementation**
   - Set up the base project structure as outlined in \`design.md\`
   - Implement foundational components
   - Establish data models and services`;

// Default memory index template
const MEMORY_INDEX_TEMPLATE = `# Memory System Guide

This document explains how the memory system works for maintaining context in agentic LLM workflows. The memory system helps maintain project context, decisions, and progress throughout the development lifecycle.

## Memory Bank Structure

Memory is organized into numbered bank files with a consistent structure:

\`\`\`
memory/
├── index.md          # This file - explains the memory system
├── bank_1.md         # First memory bank
├── bank_2.md         # Second memory bank (created when bank_1 is full)
└── ...               # Additional banks as needed
\`\`\``;

// Default memory bank template
const MEMORY_BANK_TEMPLATE = `# Memory Bank 1

## Context Summary

This is the initial memory bank for [PROJECT_NAME]. It contains the initial project setup, key architectural decisions, and early implementation details. The project is a [SHORT_DESCRIPTION] using [TECH_STACK] technologies.

## Entries

### 2025-03-04T10:00:00Z - Initial Project Setup

Project initialized using the documentation provided. The core technology stack includes:
- Frontend: [FRONTEND_TECH]
- Backend: [BACKEND_TECH]
- Database: [DATABASE_TECH]`;

// Default architect role prompt
const ARCHITECT_PROMPT_TEMPLATE = `# Architect Role Prompt

## Role Definition

You are a senior software architect with expertise in [TECH_STACK] and deep knowledge of modern architectural patterns. Your primary focus is on system design, architecture planning, and making technical decisions that align with project requirements and best practices.

## Responsibilities

As the architect, you are responsible for:

1. **System Design**:
   - Creating high-level architectural diagrams
   - Designing component interactions
   - Planning data models and relationships
   - Establishing API contracts`;

// Default developer role prompt
const DEVELOPER_PROMPT_TEMPLATE = `# Developer Role Prompt

## Role Definition

You are an expert software developer with deep experience in [TECH_STACK]. Your primary focus is writing clean, efficient, maintainable code that implements features according to the project's architecture and design specifications.

## Responsibilities

As the developer, you are responsible for:

1. **Feature Implementation**:
   - Writing code that fulfills functional requirements
   - Implementing UI components and interactions
   - Developing API endpoints and services
   - Connecting frontend and backend systems`;

// Default designer role prompt
const DESIGNER_PROMPT_TEMPLATE = `# Designer Role Prompt

## Role Definition

You are an expert UI/UX designer with deep knowledge of modern design principles, accessibility standards, and implementation techniques for [TECH_STACK]. Your primary focus is creating beautiful, intuitive, and accessible user interfaces that enhance the user experience.

## Responsibilities

As the designer, you are responsible for:

1. **UI Component Design**:
   - Creating visually appealing UI components
   - Implementing responsive layouts
   - Ensuring consistent visual language
   - Applying typography and color theory`;

// Default enterprise role prompt
const ENTERPRISE_PROMPT_TEMPLATE = `# Enterprise Role Prompt

## Role Definition

You are an expert in business strategy, growth marketing, and digital product scaling with deep knowledge of the [INDUSTRY] market. Your primary focus is on developing and implementing strategies to grow user adoption, increase engagement, and optimize business metrics for [PROJECT_NAME].

## Responsibilities

As the enterprise strategist, you are responsible for:

1. **Growth Strategy**:
   - Designing user acquisition funnels
   - Creating viral and referral mechanisms
   - Optimizing conversion rates
   - Developing retention strategies`;

// Default architecture template
const ARCHITECTURE_TEMPLATE = `# Architecture: [FEATURE_NAME]

## Overview

This document provides a comprehensive architectural design for the [FEATURE_NAME] feature of [PROJECT_NAME]. This feature will [FEATURE_DESCRIPTION] and serves as a critical component for [BUSINESS_PURPOSE].

## Requirements

### Functional Requirements

1. **[REQUIREMENT_1]**
   - Description: [DESCRIPTION]
   - Acceptance Criteria: [CRITERIA]`;

// Deployment guide template with tech stack-specific instructions
const DEPLOYMENT_GUIDE_TEMPLATE = `# Deployment Guide for [PROJECT_NAME]

## Environment Setup

### Prerequisites
- [List of required tools and dependencies]
- [Version requirements]
- [Operating system compatibility notes]

### Development Environment Setup
\`\`\`bash
# Clone the repository
git clone [REPOSITORY_URL]
cd [PROJECT_NAME]

# Install dependencies
[PACKAGE_MANAGER] install

# Set up environment variables
cp .env.example .env
# Edit .env with your configurations
\`\`\`

## Development Workflow

### Running Locally
\`\`\`bash
# Start development server
[PACKAGE_MANAGER] run dev

# Run tests
[PACKAGE_MANAGER] run test
\`\`\`

### Build Process
\`\`\`bash
# Build for production
[PACKAGE_MANAGER] run build

# Preview production build
[PACKAGE_MANAGER] run preview
\`\`\`

## Deployment

### [PRIMARY_HOSTING_PLATFORM] Deployment
\`\`\`bash
# [DEPLOYMENT_STEPS]
\`\`\`

### Alternative Deployment Options
- [OPTION_1]
- [OPTION_2]

## CI/CD Integration

### GitHub Actions Setup
[GITHUB_ACTIONS_STEPS]

### Automated Testing
[TESTING_AUTOMATION_STEPS]

## Monitoring and Maintenance

### Performance Monitoring
[PERFORMANCE_MONITORING_SETUP]

### Error Tracking
[ERROR_TRACKING_SETUP]

## Troubleshooting

### Common Issues
1. [ISSUE_1]
   - Solution: [SOLUTION_1]

2. [ISSUE_2]
   - Solution: [SOLUTION_2]
`;

// Next.js specific deployment guide
const NEXTJS_DEPLOYMENT_GUIDE = `# Deployment Guide for [PROJECT_NAME]

## Environment Setup

### Prerequisites
- Node.js (v18.17.0 or later)
- npm, yarn, or pnpm
- Git
- Vercel CLI (optional, for Vercel deployments)

### Development Environment Setup
\`\`\`bash
# Clone the repository
git clone [REPOSITORY_URL]
cd [PROJECT_NAME]

# Install dependencies
npm install
# or
yarn
# or
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configurations
\`\`\`

## Development Workflow

### Running Locally
\`\`\`bash
# Start development server
npm run dev
# or
yarn dev
# or
pnpm dev

# Run tests
npm run test
# or
yarn test
# or
pnpm test
\`\`\`

### Build Process
\`\`\`bash
# Build for production
npm run build
# or
yarn build
# or
pnpm build

# Start production server locally
npm run start
# or
yarn start
# or
pnpm start
\`\`\`

## Deployment

### Vercel Deployment (Recommended)

#### Using Vercel Dashboard
1. Import your project from GitHub/GitLab/Bitbucket
2. Configure project settings
3. Deploy

#### Using Vercel CLI
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview environment
vercel

# Deploy to production
vercel --prod
\`\`\`

### GitHub Pages Deployment
\`\`\`bash
# Add next.config.js settings for GitHub Pages
# See: https://nextjs.org/docs/app/building-your-application/deploying/static-exports

# Build and export static site
npm run build
npm run export

# Deploy to GitHub Pages using gh-pages package
npm i -g gh-pages
gh-pages -d out
\`\`\`

### Alternative Deployment Options
- AWS Amplify
- Netlify
- DigitalOcean App Platform
- Railway

## CI/CD Integration

### GitHub Actions Setup
Create a file at \`.github/workflows/ci.yml\`:

\`\`\`yaml
name: CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run lint
      - run: npm run test

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}
          github-token: \${{ secrets.GITHUB_TOKEN }}
          vercel-args: '--prod'
\`\`\`

## Monitoring and Maintenance

### Performance Monitoring
- Set up [Next.js Analytics](https://nextjs.org/analytics) in Vercel dashboard
- Configure Vercel Web Vitals
- Consider Lighthouse CI for performance monitoring

### Error Tracking
- Add Sentry for Next.js: [nextjs.org/docs/advanced-features/error-handling](https://nextjs.org/docs/advanced-features/error-handling)
- Set up logging with Vercel Logs

## Troubleshooting

### Common Issues
1. **Build fails due to environment variables**
   - Solution: Ensure all required environment variables are set in Vercel dashboard or .env.local file

2. **Images not displaying in production**
   - Solution: Check image paths and ensure they're using next/image properly

3. **API routes return 404**
   - Solution: Verify API route paths and handler functions

4. **Vercel CLI not connecting to your account**
   - Solution: Run \`vercel logout\` and \`vercel login\` again to reset authentication
`;

// Apple platform specific deployment guide
const APPLE_DEPLOYMENT_GUIDE = `# Deployment Guide for [PROJECT_NAME]

## Environment Setup

### Prerequisites
- macOS (latest stable version recommended)
- Xcode (latest stable version)
- Swift (bundled with Xcode)
- CocoaPods (if using pod dependencies)
- Swift Package Manager
- Apple Developer account

### Development Environment Setup
\`\`\`bash
# Clone the repository
git clone [REPOSITORY_URL]
cd [PROJECT_NAME]

# Install dependencies (if using CocoaPods)
pod install

# Open project
open [PROJECT_NAME].xcodeproj
# or if using CocoaPods
open [PROJECT_NAME].xcworkspace
\`\`\`

## Development Workflow

### Running Locally
1. Open project in Xcode
2. Select target device/simulator
3. Click Run button or press ⌘R

### Testing
\`\`\`bash
# Run tests from command line
xcodebuild test -scheme [PROJECT_NAME] -destination 'platform=iOS Simulator,name=iPhone 15'

# Or use Xcode Test Navigator
# Press ⌘U in Xcode
\`\`\`

### Build Process
\`\`\`bash
# Build for development
xcodebuild build -scheme [PROJECT_NAME] -configuration Debug

# Build for release
xcodebuild build -scheme [PROJECT_NAME] -configuration Release
\`\`\`

## Deployment

### App Store Deployment

#### Prepare for submission
1. Configure app icons and launch screens
2. Update version and build numbers
3. Verify all required app permissions have descriptions
4. Prepare screenshots and metadata

#### Archive and upload
\`\`\`bash
# Create archive
xcodebuild archive -scheme [PROJECT_NAME] -configuration Release -archivePath ./build/[PROJECT_NAME].xcarchive

# Export IPA
xcodebuild -exportArchive -archivePath ./build/[PROJECT_NAME].xcarchive -exportOptionsPlist ExportOptions.plist -exportPath ./build
\`\`\`

#### Using Xcode
1. Select Product > Archive
2. Click "Distribute App" in Organizer
3. Follow the submission wizard

### TestFlight Distribution
1. Upload build to App Store Connect (via Xcode or Transporter)
2. Configure TestFlight settings in App Store Connect
3. Add internal/external testers
4. Release build to testers

### Alternative Distribution Options
- Enterprise distribution (in-house)
- Ad Hoc distribution (limited devices)
- Development distribution (development devices only)

## CI/CD Integration

### GitHub Actions Setup
Create a file at \`.github/workflows/ios.yml\`:

\`\`\`yaml
name: iOS CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: macos-latest
    steps:
    - uses: actions/checkout@v3
    - name: Set up Ruby
      uses: ruby/setup-ruby@v1
      with:
        ruby-version: '3.0'
    - name: Install dependencies
      run: |
        gem install cocoapods
        pod install
    - name: Build and test
      run: xcodebuild test -workspace [PROJECT_NAME].xcworkspace -scheme [PROJECT_NAME] -destination 'platform=iOS Simulator,name=iPhone 15'
\`\`\`

### Fastlane Setup
\`\`\`bash
# Install fastlane
gem install fastlane

# Initialize fastlane
cd [PROJECT_NAME]
fastlane init
\`\`\`

Configure Fastfile for automated builds and deployment.

## Monitoring and Maintenance

### Performance Monitoring
- Set up Firebase Performance Monitoring
- Configure Instruments in Xcode for profiling
- Implement MetricKit for collecting performance metrics

### Error Tracking
- Integrate Crashlytics
- Set up Sentry for iOS
- Configure Apple's built-in crash reporting

## Troubleshooting

### Common Issues
1. **Code signing issues**
   - Solution: Check provisioning profiles and certificates in Xcode settings

2. **App rejected due to privacy concerns**
   - Solution: Ensure all usage descriptions are properly configured in Info.plist

3. **TestFlight build taking too long to process**
   - Solution: Verify build settings and ensure compliance with latest App Store guidelines

4. **Compatibility issues with newer iOS versions**
   - Solution: Test on beta iOS versions and update deprecated APIs
`;

// CLI specific deployment guide
const CLI_DEPLOYMENT_GUIDE = `# Deployment Guide for [PROJECT_NAME]

## Environment Setup

### Prerequisites
- Node.js (v16 or later)
- npm, yarn, or pnpm
- Git
- Operating system compatibility: macOS, Linux, Windows

### Development Environment Setup
\`\`\`bash
# Clone the repository
git clone [REPOSITORY_URL]
cd [PROJECT_NAME]

# Install dependencies
npm install
# or
yarn
# or
pnpm install

# Link binary locally for development
npm link
# or
yarn link
\`\`\`

## Development Workflow

### Running Locally
\`\`\`bash
# Execute CLI directly
./bin/[CLI_NAME].js command

# Run via npm script
npm run start -- command

# Run tests
npm test
\`\`\`

### Build Process
\`\`\`bash
# Transpile from TypeScript (if applicable)
npm run build

# Bundle for distribution (if using webpack/esbuild)
npm run bundle
\`\`\`

## Deployment

### npm Registry Publication
\`\`\`bash
# Create optimized package
npm run build

# Test package before publishing
npm pack
# Inspect the resulting .tgz file

# Publish to npm
npm publish
# or for scoped packages
npm publish --access public
\`\`\`

### Binary Distribution
\`\`\`bash
# Make executable
chmod +x ./bin/[CLI_NAME].js

# Create standalone executable (optional)
npm run bundle
npx pkg .

# Test binary
./dist/[CLI_NAME]-macos
./dist/[CLI_NAME]-linux
./dist/[CLI_NAME]-win.exe
\`\`\`

### Alternative Deployment Options
- GitHub Releases (with prebuilt binaries)
- Homebrew Formula (for macOS users)
- Chocolatey (for Windows users)
- Debian/RPM packages (for Linux users)

## CI/CD Integration

### GitHub Actions Setup
Create a file at \`.github/workflows/publish.yml\`:

\`\`\`yaml
name: Publish Package

on:
  release:
    types: [created]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '16.x'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm test
      - run: npm run build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: \${{ secrets.NPM_TOKEN }}
  
  binaries:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '16.x'
      - run: npm ci
      - run: npm run build
      - name: Build binaries
        run: npx pkg .
      - name: Upload binaries to release
        uses: svenstaro/upload-release-action@v2
        with:
          repo_token: \${{ secrets.GITHUB_TOKEN }}
          file: dist/[CLI_NAME]*
          tag: \${{ github.ref }}
          overwrite: true
          file_glob: true
\`\`\`

## Monitoring and Maintenance

### Telemetry and Usage Analytics
- Configure anonymous usage tracking (with opt-out)
- Set up error reporting system

### Version Management
\`\`\`bash
# Use standard-version for automated versioning
npx standard-version

# Or manually bump version
npm version patch # or minor or major
git push --follow-tags
\`\`\`

## User Documentation

### Generate CLI Help
\`\`\`bash
# Ensure help commands are comprehensive
[CLI_NAME] --help
[CLI_NAME] command --help
\`\`\`

### Publish Documentation Website
- Set up GitHub Pages for documentation
- Use tools like docusaurus or docsify

## Troubleshooting

### Common Issues
1. **Permission denied when executing**
   - Solution: \`chmod +x ./bin/[CLI_NAME].js\`

2. **Command not found after installation**
   - Solution: Check if installation directory is in PATH, or reinstall with \`npm i -g [PACKAGE_NAME]\`

3. **Compatibility issues with different Node.js versions**
   - Solution: Specify engines field in package.json with supported Node.js versions

4. **Dependencies not installing correctly**
   - Solution: Check for platform-specific dependencies and provide alternative installation instructions
`;

// Generic "Other" deployment guide
const OTHER_DEPLOYMENT_GUIDE = `# Deployment Guide for [PROJECT_NAME]

## Environment Setup

### Prerequisites
- Runtime environment: [RUNTIME]
- Package manager: [PACKAGE_MANAGER]
- Database: [DATABASE]
- Other dependencies: [DEPENDENCIES]

### Development Environment Setup
\`\`\`bash
# Clone the repository
git clone [REPOSITORY_URL]
cd [PROJECT_NAME]

# Install dependencies
[INSTALL_COMMAND]

# Set up configuration
[CONFIG_SETUP_COMMANDS]
\`\`\`

## Development Workflow

### Running Locally
\`\`\`bash
# Start development server
[DEV_COMMAND]

# Run tests
[TEST_COMMAND]
\`\`\`

### Build Process
\`\`\`bash
# Build for production
[BUILD_COMMAND]

# Preview production build
[PREVIEW_COMMAND]
\`\`\`

## Deployment

### [PRIMARY_HOSTING_PLATFORM] Deployment
\`\`\`bash
# Login to hosting platform
[LOGIN_COMMAND]

# Deploy application
[DEPLOY_COMMAND]
\`\`\`

### Docker Deployment
\`\`\`bash
# Build Docker image
docker build -t [PROJECT_NAME] .

# Run Docker container
docker run -p [PORT]:[PORT] [PROJECT_NAME]

# Push to Docker registry
docker push [REGISTRY]/[PROJECT_NAME]:[TAG]
\`\`\`

### Alternative Deployment Options
- Cloud hosting (AWS, Google Cloud, Azure)
- Platform-specific services
- Self-hosted options

## CI/CD Integration

### GitHub Actions Setup
Create a file at \`.github/workflows/main.yml\`:

\`\`\`yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up environment
        run: [SETUP_STEPS]
      - name: Run tests
        run: [TEST_COMMAND]

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up environment
        run: [SETUP_STEPS]
      - name: Build
        run: [BUILD_COMMAND]
      - name: Deploy
        run: [DEPLOY_COMMAND]
        env:
          DEPLOY_TOKEN: \${{ secrets.DEPLOY_TOKEN }}
\`\`\`

## Database Management

### Database Migrations
\`\`\`bash
# Create migration
[MIGRATION_CREATE_COMMAND]

# Run migrations
[MIGRATION_RUN_COMMAND]

# Rollback migration
[MIGRATION_ROLLBACK_COMMAND]
\`\`\`

## Monitoring and Maintenance

### Performance Monitoring
- Set up application performance monitoring
- Configure server monitoring
- Implement logging

### Backup and Recovery
\`\`\`bash
# Database backup
[BACKUP_COMMAND]

# Database restore
[RESTORE_COMMAND]
\`\`\`

## Troubleshooting

### Common Issues
1. **[COMMON_ISSUE_1]**
   - Solution: [SOLUTION_1]

2. **[COMMON_ISSUE_2]**
   - Solution: [SOLUTION_2]

3. **Deployment failures**
   - Solution: Check logs, verify credentials, ensure build succeeds locally

4. **Performance degradation**
   - Solution: Check resource usage, optimize database queries, implement caching
`;

// Map tech stack types to specific deployment guides
const TECH_STACK_DEPLOYMENT_GUIDES: Record<TemplateKey, string> = {
  next: NEXTJS_DEPLOYMENT_GUIDE,
  apple: APPLE_DEPLOYMENT_GUIDE,
  cli: CLI_DEPLOYMENT_GUIDE,
  other: OTHER_DEPLOYMENT_GUIDE
};

/**
 * Loads the deployment guide template for a specific tech stack
 * @param techStack The tech stack to load the deployment guide for
 * @returns The deployment guide template for the tech stack
 */
export function loadDeploymentGuideTemplate(techStack: string): string {
  // Convert tech stack name to template key format
  const simplifiedName = techStack.toLowerCase().replace(/\./g, '').replace(/[^a-z0-9]/g, '');
  
  // Map to one of our known template types
  let templateKey: TemplateKey = 'other';
  if (simplifiedName === 'next' || simplifiedName === 'nextjs') {
    templateKey = 'next';
  } else if (simplifiedName === 'apple') {
    templateKey = 'apple';
  } else if (simplifiedName === 'cli') {
    templateKey = 'cli';
  }
  
  console.log(`Loading deployment guide for tech stack: ${techStack}, using key: ${templateKey}`);
  
  return TECH_STACK_DEPLOYMENT_GUIDES[templateKey];
}

/**
 * Loads a template from static data instead of filesystem
 * @param templateType The type of template (e.g., 'next', 'cli', 'other')
 * @param filename The name of the file to load (e.g., 'index.md', 'design.md', 'code.md')
 * @returns The content of the template
 */
export function loadTemplate(templateType: string, filename: string): string {
  try {
    // Normalize the template type to match our static templates
    const normalizedType = templateType.toLowerCase().replace(/\./g, '').replace(/[^a-z0-9]/g, '');
    
    // Map to one of our known template types
    let templateKey: TemplateKey = 'other';
    if (normalizedType === 'next' || normalizedType === 'nextjs') {
      templateKey = 'next';
    } else if (normalizedType === 'apple') {
      templateKey = 'apple';
    } else if (normalizedType === 'cli') {
      templateKey = 'cli';
    }

    // If a file exists in the template directory, load it from there instead of static templates
    const templatePath = path.join(process.cwd(), 'docs', 'template', 'stack', templateKey, filename);
    if (fs.existsSync(templatePath)) {
      try {
        return fs.readFileSync(templatePath, 'utf8');
      } catch (fsError) {
        console.warn(`Error reading template from filesystem: ${fsError}. Falling back to static template.`);
      }
    }
    
    // Get file key with type safety
    const fileKey = filename as TemplateFileKey;
    
    // Return the template if it exists
    if (TEMPLATES[templateKey] && TEMPLATES[templateKey][fileKey]) {
      return TEMPLATES[templateKey][fileKey];
    }
    
    console.warn(`Template not found: ${templateKey}/${filename}`);
    return '';
  } catch (error) {
    console.error(`Error loading template: ${error}`);
    return '';
  }
}

/**
 * Loads the init.md template from static data
 * @returns The content of the init.md template
 */
export function loadInitTemplate(): string {
  return INIT_TEMPLATE;
}

/**
 * Loads the instructions.md template from static data
 * @returns The content of the instructions.md template
 */
export function loadInstructionsTemplate(): string {
  return INSTRUCTIONS_TEMPLATE;
}

/**
 * Loads the memory/index.md template from static data
 * @returns The content of the memory/index.md template
 */
export function loadMemoryIndexTemplate(): string {
  return MEMORY_INDEX_TEMPLATE;
}

/**
 * Loads the memory/bank_1.md template from static data
 * @returns The content of the memory/bank_1.md template
 */
export function loadMemoryBankTemplate(): string {
  return MEMORY_BANK_TEMPLATE;
}

/**
 * Loads the prompts/architect.md template from static data
 * @returns The content of the prompts/architect.md template
 */
export function loadArchitectPromptTemplate(): string {
  return ARCHITECT_PROMPT_TEMPLATE;
}

/**
 * Loads the prompts/developer.md template from static data
 * @returns The content of the prompts/developer.md template
 */
export function loadDeveloperPromptTemplate(): string {
  return DEVELOPER_PROMPT_TEMPLATE;
}

/**
 * Loads the prompts/designer.md template from static data
 * @returns The content of the prompts/designer.md template
 */
export function loadDesignerPromptTemplate(): string {
  return DESIGNER_PROMPT_TEMPLATE;
}

/**
 * Loads the prompts/enterprise.md template from static data
 * @returns The content of the prompts/enterprise.md template
 */
export function loadEnterprisePromptTemplate(): string {
  return ENTERPRISE_PROMPT_TEMPLATE;
}

/**
 * Loads the architecture/sample-feature.md template from static data
 * @returns The content of the architecture/sample-feature.md template
 */
export function loadArchitectureTemplate(): string {
  return ARCHITECTURE_TEMPLATE;
}

/**
 * Loads all documentation templates for a given tech stack from static data
 * @param techStack The tech stack to load templates for (e.g., 'next', 'cli', 'other')
 * @returns An object containing all templates for the tech stack
 */
export function loadTechStackTemplates(techStack: string): { 
  indexTemplate: string; 
  designTemplate: string; 
  codeTemplate: string;
} {
  // Convert tech stack name to template key format
  const simplifiedName = techStack.toLowerCase().replace(/\./g, '').replace(/[^a-z0-9]/g, '');
  
  // Map to one of our known template types
  let templateKey: TemplateKey = 'other';
  if (simplifiedName === 'next' || simplifiedName === 'nextjs') {
    templateKey = 'next';
  } else if (simplifiedName === 'apple') {
    templateKey = 'apple';
  } else if (simplifiedName === 'cli') {
    templateKey = 'cli';
  }
  
  console.log(`Loading templates for tech stack: ${techStack}, using key: ${templateKey}`);
  
  return {
    indexTemplate: TEMPLATES[templateKey]['index.md'],
    designTemplate: TEMPLATES[templateKey]['design.md'],
    codeTemplate: TEMPLATES[templateKey]['code.md'],
  };
}

/**
 * Get the emojis for tech stacks
 */
export const TECH_STACK_EMOJIS: Record<TechStackOption, string> = {
  "Next.js": "▲",
  "Apple": "🍎",
  "CLI": "🧮",
  "Other": "🍀"
};

/**
 * Get display names for tech stacks (lowercase for UI)
 */
export const TECH_STACK_DISPLAY_NAMES: Record<TechStackOption, string> = {
  "Next.js": "next.js",
  "Apple": "apple",
  "CLI": "cli",
  "Other": "other"
}; 