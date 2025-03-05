# [PROJECT_NAME] Implementation Guide

## Project Overview

[PROJECT_NAME] is [SHORT_DESCRIPTION]. This document provides specific instructions for implementing the project using the documentation and codebase effectively.

## Documentation Structure

The project documentation is organized into the following directories:

```
project-docs/
│
├── README.md            # Human-readable GitHub README
├── index.md             # Summary of all folders and files
│
├── docs/                # Core documentation
├── tech/                # Technology documentation
├── system/              # LLM system files
├── memory/              # Memory system for agentic LLMs
├── prompts/             # Role and workflow prompts
└── architecture/        # Architecture documentation
```

For a complete overview of the documentation structure, refer to `index.md`.

## Implementation Workflow

Follow this sequence to implement the project efficiently:

1. **Environment Setup**
   - Set up development environment based on tech stack in `tech/index.md`
   - Follow the setup commands in `prompts/commands/setup.md`
   - Configure development tools

2. **Core Architecture Implementation**
   - Set up the base project structure as outlined in `docs/design.md`
   - Implement foundational components
   - Establish data models and services

3. **Feature Development**
   - Implement features in priority order
   - Follow patterns described in `docs/code.md`
   - Use testing workflows in `prompts/commands/testing.md`

4. **Integration and Refinement**
   - Connect components and services
   - Optimize performance
   - Enhance error handling

5. **Deployment and Documentation**
   - Follow deployment procedures in `prompts/commands/deployment.md`
   - Document API and usage
   - Create user documentation

## Tech Stack Implementation

This project uses the following tech stack:

[TECH_STACK_SUMMARY]

When implementing components:

1. Follow the architectural patterns in `docs/design.md`
2. Reference the component examples in `docs/code.md`
3. Adhere to best practices described in `tech/index.md`
4. Explore individual technology documentation in `tech/[technology].md`

## Code Organization

The codebase is organized as follows:

```
[PROJECT_STRUCTURE]
```

## Key Implementation Guidelines

1. **Data Flow**
   - Follow the data flow patterns outlined in the architecture section of `docs/design.md`
   - Use appropriate state management as described in `tech/index.md`

2. **Component Design**
   - Implement UI components following the patterns in `docs/code.md`
   - Ensure components are reusable and well-documented

3. **API Integration**
   - Follow the API design in the architecture section
   - Implement error handling and loading states

4. **Testing Strategy**
   - Write unit tests for each component
   - Implement integration tests for key workflows
   - Set up end-to-end tests for critical paths
   - Follow testing commands in `prompts/commands/testing.md`

## Memory Usage Guidelines

Use the memory system to track important implementation details:

1. **Project State Tracking**
   - Store current implementation status in `memory/bank_1.md`
   - Track completed features
   - Document pending tasks

2. **Decision Journal**
   - Record architectural decisions
   - Document tech stack choices
   - Note implementation tradeoffs

3. **Reference Information**
   - Store complex implementation details
   - Track API endpoints and data structures
   - Record useful code snippets

## Repository Navigation

For this specific project, the following navigation commands are most useful:

1. **Core Components**: `explore core components`
2. **API Implementation**: `explore api implementation`
3. **Data Models**: `explore data models`
4. **State Management**: `explore state management`
5. **UI Components**: `explore ui components`

## Implementation Approach for Key Features

### [FEATURE_1]

This feature should be implemented using:
- [Component patterns]
- [Data structures]
- [API endpoints]

Begin with [starting point] and follow the workflow in `docs/code.md` section [X].

### [FEATURE_2]

This feature should be implemented using:
- [Component patterns]
- [Data structures]
- [API endpoints]

Begin with [starting point] and follow the workflow in `docs/code.md` section [Y].

## Role Usage Guidelines

For optimal implementation of this project:

1. **Use Architect role for**:
   - Initial project structure setup
   - Database schema design
   - API contract definition
   - Performance optimization planning
   - Activate with: `@prompts/roles/architect.md [task]`

2. **Use Developer role for**:
   - Feature implementation
   - Unit and integration testing
   - Bug fixing
   - Code refactoring
   - Activate with: `@prompts/roles/developer.md [task]`

3. **Use Designer role for**:
   - UI component implementation
   - Animation and interaction design
   - Accessibility improvements
   - Responsive design implementation
   - Activate with: `@prompts/roles/designer.md [task]`

4. **Use Enterprise role for**:
   - Analytics implementation
   - Growth feature development
   - SEO optimization
   - Marketing integration
   - Activate with: `@prompts/roles/enterprise.md [task]`

## Command Prompt Usage

The project includes several command prompts for common workflows:

1. **Setup Commands**:
   - Project initialization
   - Dependency installation
   - Environment configuration
   - Access with: `@prompts/commands/setup.md`

2. **Testing Commands**:
   - Running different test types
   - Test coverage analysis
   - Test debugging
   - Access with: `@prompts/commands/testing.md`

3. **Deployment Commands**:
   - Building for production
   - Deployment to various platforms
   - Environment variable management
   - Access with: `@prompts/commands/deployment.md`

## Common Challenges and Solutions

1. **[CHALLENGE_1]**
   - Problem: [Description]
   - Solution: [Approach]
   - Reference: See `docs/code.md` section [Z]

2. **[CHALLENGE_2]**
   - Problem: [Description]
   - Solution: [Approach]
   - Reference: See `tech/index.md` section [W]

## Project-Specific Tool Commands

For this project, the following commands are particularly useful:

```
# Set up development environment
npm install
npm run dev

# Run tests
npm test
npm run test:e2e

# Build for production
npm run build
npm run start
```

## Deployment Workflow

The complete deployment process is documented in `docs/deployment.md`. Follow these steps for deployment:

1. **Environment Setup**
   - Set up required tools and dependencies as specified in `docs/deployment.md`
   - Configure necessary environment variables

2. **Build Process**
   - Build the production-ready application
   - Run pre-deployment tests

3. **Deployment Process**
   - Deploy to [PRIMARY_DEPLOYMENT_PLATFORM]
   - Verify deployment with smoke tests
   - Monitor performance metrics

4. **CI/CD Integration**
   - Use the CI/CD pipeline configurations in `docs/deployment.md`
   - Automate testing and deployment processes

5. **Post-Deployment**
   - Monitor application performance
   - Track error logs
   - Apply necessary updates

For detailed deployment commands, refer to `prompts/commands/deployment.md`.

## Next Steps

After initial implementation:

1. Review against requirements in `docs/overview.md`
2. Optimize performance based on guidelines in `tech/index.md`
3. Ensure all tests are passing
4. Prepare deployment documentation
5. Create user guides if applicable

---

Follow this guide alongside the core documentation to implement [PROJECT_NAME] effectively. 