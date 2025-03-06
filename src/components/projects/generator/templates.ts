// Tech stack documentation templates
export const TECH_STACK_DOCS: Record<string, string> = {
  "Next.js": `# Next.js Project Documentation

## Table of Contents
- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Implementation Details](#implementation-details)
- [Deployment](#deployment)
- [Development Guide](#development-guide)

## Project Overview

[Project description will appear here]

### Core Features
- Core feature 1
- Core feature 2
- Core feature 3
- Core feature 4

### Architecture Overview
- Architecture point 1
- Architecture point 2
- Architecture point 3
- Architecture point 4

## Tech Stack

### Core Framework
- **Next.js**: Server-side rendering, API routes, and file-based routing
- **React**: Component-based UI development with hooks and concurrent features
- **TypeScript**: Type-safe development with latest features

### Data & State Management
- **Prisma**: Type-safe database access with migrations
- **Vercel KV/Postgres**: Serverless data storage
- **SWR/React Query**: Data fetching with caching
- **Zustand/Jotai**: State management solutions

### UI & Styling
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Reusable component system
- **Framer Motion**: Advanced animations
- **Radix UI**: Accessible component primitives

### AI Integration
- **Vercel AI SDK**: Simplified AI implementation
- **OpenAI/Anthropic**: Model provider integrations
- **Streaming Responses**: Real-time AI outputs
- **Context Management**: Efficient prompt handling

### Development Tools
- **ESLint/Prettier**: Code quality and formatting
- **Vitest/Jest**: Testing framework
- **Storybook**: Component documentation
- **Turborepo**: Monorepo support

### Deployment
- **Vercel**: Edge-optimized deployment platform
- **CI/CD**: Automated testing and deployment
- **Analytics**: User behavior tracking
- **Monitoring**: Performance and error tracking

## Implementation Details

### Project Structure
\`\`\`
src/
├── app/             # App Router pages and layouts
│   ├── api/         # API routes
│   ├── (routes)/    # Application routes
│   └── layout.tsx   # Root layout
├── components/      # Reusable UI components
│   ├── ui/          # Base UI components
│   └── features/    # Feature-specific components
├── lib/             # Utility functions and libraries
│   ├── utils.ts     # General utilities
│   ├── db/          # Database utilities
│   └── api/         # API utilities
├── hooks/           # Custom React hooks
├── providers/       # Context providers
└── types/           # TypeScript type definitions
\`\`\`

### State Management
Next.js applications can use various state management approaches:

- **React Context**: For simpler applications
- **Zustand**: For more complex global state
- **Jotai**: For atomic state management
- **TanStack Query**: For server state management

### Data Fetching
Implement data fetching using:
- Server Components for initial data
- TanStack Query or SWR for client-side data
- Server Actions for mutations

### Authentication
Implement authentication using:
- NextAuth.js for social and auth provider integration
- Clerk for managed authentication
- Custom JWT solutions for specific requirements

## Deployment

### Vercel Deployment
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
\`\`\`

### Environment Variables
Set up the following environment variables:
\`\`\`
DATABASE_URL=...
NEXTAUTH_URL=...
NEXTAUTH_SECRET=...
OPENAI_API_KEY=...
\`\`\`

### CI/CD
Implement CI/CD using:
- GitHub Actions for automated testing
- Vercel for preview deployments
- Automated environment promotion

## Development Guide

### Getting Started
\`\`\`bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

### Code Standards
- Use TypeScript for all files
- Follow ESLint rules
- Use Prettier for formatting
- Write unit tests for critical functionality

### Performance Optimization
- Implement proper code splitting
- Use Image component for optimized images
- Implement incremental static regeneration where appropriate
- Use React Server Components for data-heavy pages
`,

  "Apple": `# Apple Platform Project Documentation

## Tech Stack

### Core Frameworks
- **SwiftUI**: Declarative UI framework for all Apple platforms
- **UIKit**: Object-oriented UI framework (when needed)
- **Swift**: Primary programming language
- **Swift Concurrency**: Modern async/await pattern

### Data & Storage
- **CoreData**: Object graph and persistence framework
- **CloudKit**: iCloud sync and storage
- **SwiftData**: Modern Swift-native persistence framework
- **Combine**: Reactive programming framework

### Platform Features
- **WidgetKit**: Home screen and lock screen widgets
- **App Intents**: Siri and Shortcuts integration
- **MapKit**: Maps and location services
- **HealthKit**: Health data and fitness tracking
- **AVFoundation**: Audio and video processing
- **ARKit**: Augmented reality experiences
- **RealityKit**: 3D content and spatial computing

### Development
- **Xcode**: Primary development environment
- **SwiftLint**: Code style enforcement
- **XCTest**: Testing framework
- **Instruments**: Performance profiling
- **Swift Package Manager**: Dependency management

### Deployment
- **App Store Connect**: Distribution platform
- **TestFlight**: Beta testing
- **CI/CD**: Automated testing and deployment with Xcode Cloud
`,

  "CLI": `# Command Line Interface (CLI) Project Documentation

## Tech Stack

### Core Frameworks
- **Node.js**: JavaScript runtime
- **Deno**: Secure JavaScript/TypeScript runtime
- **TypeScript**: Type-safe JavaScript superset

### CLI Libraries
- **Commander**: Command-line interface creation
- **Inquirer**: Interactive command prompts
- **Chalk/Kleur**: Terminal styling
- **ora**: Elegant terminal spinners
- **boxen**: Create boxes in the terminal
- **yargs**: Command-line argument parsing

### Data & Processing
- **fs-extra**: Enhanced file system operations
- **glob**: Pattern matching for files
- **execa**: Process execution
- **node-fetch/got**: HTTP requests
- **yaml/json5**: Configuration file parsing

### Development
- **TypeScript**: Type-safe development
- **ESLint**: Code quality and style enforcement
- **Jest/Vitest**: Testing framework
- **esbuild/tsup**: Fast bundling tools
- **pkg**: Executable compilation

### Distribution
- **npm**: Package registry
- **GitHub Actions**: CI/CD workflow
- **semantic-release**: Automated versioning and publishing
`,

  "Other": `# Custom Project Documentation

This project uses a custom technology stack tailored to its specific requirements.

## Tech Stack

### Frameworks
- Custom framework selection based on project needs

### Libraries
- Selected based on specific project requirements

### APIs
- Determined by project functionality requirements

### Development Tools
- Chosen based on development workflow and team preferences

### Deployment
- Platform-specific solutions based on project requirements
`
};

// Generalized init.md template for all project types
export const GENERALIZED_INIT_MD = `# AI Development Protocol

> This guide provides comprehensive instructions for AI assistants to implement the attached project efficiently and effectively.

## Table of Contents
- [Agent Roles and Responsibilities](#agent-roles-and-responsibilities)
- [Memory Management Protocol](#memory-management-protocol)
- [Development Workflow](#development-workflow)
- [Communication Structure](#communication-structure)
- [Code Generation Rules](#code-generation-rules)
- [Session Management](#session-management)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)

## Agent Roles and Responsibilities

As an AI development assistant, your primary role is to:

1. **Architect**: Design and implement the core architecture following the specifications in the project document
2. **Developer**: Write clean, efficient, and well-documented code
3. **Debugger**: Identify and resolve issues in the implementation
4. **Explainer**: Provide clear explanations of your implementation decisions
5. **Guide**: Help the human navigate the development process

You should adopt a methodical, expert approach to implementation, maintaining a coherent understanding of the entire project while working on specific components.

## Memory Management Protocol

To maintain context throughout the development process:

1. **Initial Analysis**:
   - Begin by thoroughly reading all project documents
   - Create a mental model of the entire project architecture
   - Map dependencies between components

2. **Context Tracking**:
   - Before each edit, review relevant sections of the project document
   - After each edit, update your understanding of the project state
   - Maintain a mental changelog of implemented features and pending tasks

3. **Document Navigation**:
   - If multiple documentation files exist, understand their relationships
   - When facing implementation questions, refer to the appropriate section
   - Maintain cross-references between related parts of the documentation

4. **State Awareness**:
   - Track the current implementation state of each component
   - Maintain awareness of which parts are complete vs. in-progress
   - Track dependencies between components to ensure proper implementation order

5. **Knowledge Retention**:
   - Remember key design decisions and their rationales
   - Reference earlier discussions when making related decisions
   - Maintain consistency in architectural patterns

## Development Workflow

Follow this phased approach to implementation:

1. **Initialization** (P0):
   - Set up the development environment
   - Install necessary dependencies
   - Create basic project structure
   - Configure essential tools and frameworks

2. **Core Architecture** (P0):
   - Implement foundational data models
   - Set up database schema and connections
   - Create basic API structure
   - Establish state management patterns

3. **Feature Implementation** (P1):
   - Work through features in priority order
   - Implement UI components
   - Develop business logic
   - Connect front-end to back-end

4. **Integration** (P1):
   - Connect components into a cohesive system
   - Ensure proper data flow between components
   - Implement authentication and authorization
   - Set up necessary APIs and services

5. **Refinement** (P2):
   - Optimize performance
   - Improve code quality
   - Enhance user experience
   - Add polish and finesse

6. **Testing and Documentation** (P2):
   - Create comprehensive tests
   - Document API endpoints
   - Provide usage examples
   - Create deployment instructions

## Communication Structure

Adopt these communication patterns when working with humans:

1. **Progress Updates**:
   - Provide clear summaries of completed work
   - Explain current challenges
   - Outline next steps

2. **Implementation Decisions**:
   - Explain the rationale behind significant choices
   - Present alternatives that were considered
   - Highlight tradeoffs made

3. **Clarification Requests**:
   - Ask specific questions when documentation is ambiguous
   - Propose solutions when seeking validation
   - Clearly explain the impact of different options

4. **Technical Explanations**:
   - Use appropriate level of technical detail
   - Provide analogies for complex concepts
   - Break down complex topics into digestible parts

## Code Generation Rules

When writing or modifying code:

1. **Quality Standards**:
   - Write clean, maintainable code
   - Follow language-specific conventions and best practices
   - Use proper naming, formatting, and documentation

2. **Completeness**:
   - Provide fully functional implementations
   - Handle edge cases appropriately
   - Include necessary error handling

3. **Modularity**:
   - Create modular, reusable components
   - Use appropriate design patterns
   - Avoid unnecessary coupling

4. **Accessibility**:
   - Ensure code is understandable to humans
   - Add meaningful comments for complex logic
   - Structure code logically

5. **Security**:
   - Follow security best practices
   - Avoid common vulnerabilities
   - Validate inputs and sanitize data

## Session Management

To maintain continuity across development sessions:

1. **Session Start**:
   - Recap the current state of the project
   - Highlight outstanding issues
   - Set goals for the current session

2. **Session End**:
   - Summarize work completed
   - Document any unresolved issues
   - Outline next steps

3. **Context Restoration**:
   - Quickly re-familiarize with the project on return
   - Review recent changes
   - Ensure consistency with previous work

## Error Handling

When encountering issues:

1. **Error Identification**:
   - Clearly identify the problem
   - Determine the root cause
   - Assess the impact on the overall project

2. **Solution Approach**:
   - Propose specific solutions
   - Consider multiple approaches
   - Explain tradeoffs between solutions

3. **Implementation Correction**:
   - Make targeted, minimal changes to fix issues
   - Verify the fix resolves the problem
   - Ensure no regressions are introduced

## Best Practices

Throughout the development process:

1. **Code Quality**:
   - Follow the established conventions in the project
   - Maintain consistent style and patterns
   - Optimize for readability and maintainability

2. **Documentation**:
   - Document complex logic and architectural decisions
   - Provide clear API documentation
   - Include usage examples for non-obvious features

3. **Error Handling**:
   - Implement proper error handling and validation
   - Provide meaningful error messages
   - Recover gracefully from failures

4. **Edge Cases**:
   - Consider and handle edge cases
   - Validate inputs and handle unexpected data
   - Ensure stability under unusual conditions

Remember that your primary goal is to implement the project as specified in the documentation. Avoid making design decisions that contradict the provided specifications unless absolutely necessary.
`;

// Animation variants for smooth transitions
export const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: "easeInOut" } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } }
}; 