# Memory Bank: Luke CLI and Web Application Integration

## 1. Project Overview

This document serves as a memory bank for tracking the integration between the Luke CLI tool (Go-based) and the web application (Next.js). The goal is to unify functionality across both interfaces, allowing the CLI to leverage the web app's API endpoints for consistent behavior and shared knowledge.

## 2. Current Repository State

### Web Application Components
- **Frontend**: Next.js with React components
- **API Routes**: Various endpoints for LLM interactions, tech documentation, and project generation
- **Storage**: Vercel Blob for document storage
- **Database**: Prisma client for data persistence

### CLI Components
- **Chat Interface**: Interactive terminal UI for LLM interactions
- **Project Generator**: CLI-based project creation tool
- **Config Management**: Configuration for API keys and settings
- **Documentation Viewer**: Terminal UI for viewing documentation
- **Tech Documentation**: Tech stack and documentation management

### API Endpoints

#### LLM-Related Endpoints
- `/api/llm`: Main endpoint for LLM interactions
- `/api/llm/models`: Retrieves available LLM models

#### Tech Documentation Endpoints
- `/api/tech`: Retrieves tech documentation overview
- `/api/tech/docs/[name]`: Retrieves documentation for a specific technology
- `/api/tech/crawl`: Crawls and stores documentation for a technology
- `/api/tech/update`: Updates tech.md and related files
- `/api/tech/enrich`: Enhances tech documentation with additional resources

#### Project Generation Endpoints
- `/api/projects`: List generated projects 
- `/api/projects/[id]`: Retrieves a specific project
- `/api/projects/[id]/documents`: Retrieves project documents
- `/api/projects/generate`: Generates a new project

#### Storage Endpoints
- `/api/blob`: Uploads files to Vercel Blob storage
- `/api/blob/list`: Lists files in Vercel Blob storage

#### Search and Research Endpoints
- `/api/ideas/random`: Generates random app ideas
- `/api/ideas/search`: Searches for app ideas with streaming responses
- `/api/sonar`: Interface to Perplexity Sonar Reasoning for web search

## 3. Integration Plan

Our integration strategy focuses on:

1. **Unified LLM functionality**: Use the same LLM backend for both interfaces
2. **Shared tech documentation system**: Maintain a single knowledge base
3. **Consistent project generation**: Use the same project templates and generation logic
4. **Improved CLI stability**: Fix timeout issues in CLI chat

### Key Components

1. **API Adapter for CLI**: 
   - `cli/api/client.go`: Client library for CLI to communicate with web app APIs

2. **New API Endpoints**:
   - `/api/tech/docs/[name]`: For retrieving tech-specific documentation
   - `/api/tech/crawl`: For crawling and storing tech documentation
   - `/api/tech/update`: For updating the tech.md file

3. **CLI Updates**:
   - Modified `chat.go` to optionally use the web app's LLM endpoint
   - New `techdocs.go` functions for tech documentation management
   - Updated `config.go` with API integration options
   - Restructured `main.go` for improved command handling

4. **Documentation Crawler**:
   - A system that uses Jina's readWebpage to crawl tech documentation
   - Stores documentation in Vercel Blob storage

## 4. Implementation Tracking

### Completed Items
- [x] Defined architecture and integration plan
- [x] Created `api/client.go` for CLI-to-web communication
- [x] Updated `cli/chat.go` with unified API integration option
- [x] Added tech documentation functions to `cli/techdocs.go`
- [x] Enhanced `cli/config.go` with API configuration
- [x] Restructured `cli/main.go` for better command handling
- [x] Implemented API endpoint structure for tech documentation
- [x] Fixed integration architecture diagram in `docs/diagrams/integration_architecture.md`
- [x] Added test cases for `/api/tech/docs/[name]` endpoint
- [x] Enhanced `cli/api/client.go` with project generation functionality
- [x] Created CLI setup guide documentation

### In Progress
- [ ] Testing `/api/tech/crawl` endpoint
- [ ] Testing `/api/tech/update` endpoint
- [ ] Integrating CLI with web app's authentication system
- [ ] Testing timeout handling in chat functionality

### Planned Items
- [ ] Add documentation pruning and optimization
- [ ] Implement recursive crawling of tech documentation
- [ ] Create CLI command for managing tech documentation
- [ ] Add API endpoints for tech stack management
- [ ] Improve error handling and timeout management
- [ ] Add CLI command for tech documentation search
- [ ] Develop unified project template system
- [ ] Implement caching for tech documentation to reduce API calls

## 5. Tech Stack Management

The tech documentation system architecture consists of:

1. **Storage**:
   - Vercel Blob Storage for markdown files
   - `tech.md`: Main index of all technologies
   - `tech-{name}.md`: Tech-specific detailed documentation

2. **Crawling**:
   - Jina API for web page reading and conversion to markdown
   - URL deduplication and filtering
   - Domain-specific crawling with configurable depth

3. **LLM Enhancement**:
   - Claude 3.7 Sonnet for summarization and organization
   - Perplexity Sonar Reasoning for search and research
   - Structured output generation

4. **Integration Points**:
   - `TechPill.tsx`: UI component that displays technology items
   - Project generator tech stack selection
   - CLI tech documentation viewer

## 6. Next Steps

1. **API Endpoint Testing**:
   - Complete testing for `/api/tech/crawl` endpoint
   - Complete testing for `/api/tech/update` endpoint
   - Implement end-to-end tests for API integration

2. **CLI Integration**:
   - Implement CLI project generator using the API client
   - Add unified authentication system
   - Create caching layer for frequently accessed content

3. **Documentation Enhancement**:
   - Add API documentation for developers
   - Create examples of tech crawling and updating
   - Document authentication system and security considerations

4. **Security Improvements**:
   - Implement API key validation middleware
   - Add rate limiting for API endpoints
   - Create audit logging for sensitive operations

## 7. Implementation Notes

### LLM Usage
- Use Claude 3.7 Sonnet as the primary model for generation tasks
- Use Perplexity Sonar Reasoning for web research and fact-checking
- Keep context windows manageable (avoid token limit issues)

### Performance Considerations
- Implement timeouts for all external API calls
- Use caching for tech documentation to reduce API calls
- Batch processing for documentation crawling to avoid rate limits

### Security Considerations
- Store API keys securely using environment variables or config files
- Implement authentication for API endpoints
- Validate user inputs to prevent injection attacks

## 8. Reference Architecture

See `docs/diagrams/integration_architecture.md` for the system architecture diagram.

## Context Summary

This is the initial memory bank for the Luke application. It contains key architectural decisions and implementation details for the project generation system. The major components include the LLM module, ProjectGenerator component, and various API endpoints that enable AI-powered project generation.

## Entries

### 2025-03-05T16:30:00Z - Project Generation System Refactoring

The project generation system has been refactored to improve modularity, maintainability, and code organization. Key changes include:

1. Splitting the monolithic `src/lib/llm/index.ts` file into smaller, focused modules
2. Creating a dedicated directory structure for prompts (`src/lib/llm/prompts/`)
3. Extracting generators and providers into separate modules
4. Standardizing interfaces for LLM providers and project generation
5. Implementing helper functions for common operations

The new structure makes the code more maintainable and allows for easier testing and extension of the system.

### 2025-03-05T16:45:00Z - ProjectGenerator.tsx Interaction Flows

The `ProjectGenerator.tsx` component supports multiple interaction flows with the API and LLM systems:

**Flow 1: Random Idea Generation (No Initial Prompt)**
1. User clicks "Generate Random Idea" without entering a prompt
2. Frontend calls `/api/ideas/random` with selected tech stack
3. API generates random app idea using `anthropic/claude-3-sonnet` model
4. API performs web search for context using `searchWithSonarReasoning`
5. Results are returned and displayed in the UI as a list of tech pills
6. User can click on tech pills to see details or proceed to generate a full project

**Flow 2: Random Idea Generation (With Initial Prompt)**
1. User enters a partial prompt and clicks "Generate Random Idea"
2. Frontend calls `/api/ideas/random` with the prompt and selected tech stack
3. API uses the prompt as context for idea generation
4. API performs targeted web search based on the prompt and tech stack
5. Results are displayed in the UI with the refined idea and tech pills
6. User can click "Generate Project" to create a full project from the idea

**Flow 3: Direct Project Generation**
1. User enters a full prompt and clicks "Generate Project"
2. Frontend calls `/api/projects/generate` with prompt and tech stack
3. API processes the request through multiple stages:
   - Project name generation (if not provided)
   - Tech stack generation (if not provided) 
   - Research context gathering using `gatherProjectContext`
   - Project content generation
   - Project architecture generation
   - Features generation
   - Documentation generation including:
     - Index document
     - Design document
     - Code document
     - Init document
     - Tech document
   - Command prompts generation
4. Documentation is progressively displayed in the UI as it becomes available
5. Documents are sequentially shown with subtle animations to improve UX
6. Project is saved and added to the projects list

**Flow 4: Tech Exploration**
1. User clicks on a tech pill
2. Frontend displays detailed information about the technology
3. If additional context is needed, frontend calls `/api/tech/enrich`
4. Enriched documentation is fetched from tech documentation sources
5. Information is displayed in the floating document panel

### 2025-03-05T17:00:00Z - LLM Provider Architecture

The LLM system uses a provider-based architecture:

1. `LLMProvider` interface defines the contract for all providers:
   ```typescript
   interface LLMProvider {
     generate: (prompt: string, options?: any) => Promise<string>;
     generateStructured: <T>(prompt: string, options?: any) => Promise<T>;
     getAvailableModels: () => Promise<string[]>;
   }
   ```

2. `ServerApiProvider` implements this interface, routing requests to the server API
3. Provider can be created using `createServerApiProvider()`
4. The system supports different models through OpenRouter, with defaults to `anthropic/claude-3.7-sonnet`
5. Structured output is supported via the `generateStructured` method, which converts JSON strings to TypeScript objects

This architecture allows for easy swapping of different LLM providers while maintaining a consistent interface.

### 2025-03-05T17:15:00Z - Tech Documentation Retrieval System

The tech documentation retrieval system works as follows:

1. When a user generates a project, the system creates search queries based on:
   - The user's prompt
   - Selected tech stack type
   - Any additional context

2. These queries are sent to r.jina.ai which:
   - Fetches documentation from official sources
   - Extracts relevant sections
   - Processes the content into markdown
   - Provides structured metadata

3. The retrieved documentation is:
   - Used as context for project generation
   - Displayed to the user as needed
   - Referenced in the generated documentation

Improvements needed:
- Create a directory-based approach (e.g., `docs/tech/mastra/`)
- Better organization of multiple files per technology
- Ability to link between related documents
- Caching mechanism to reduce duplicate fetches

### 2025-03-05T17:30:00Z - Command Prompts Generation

The command prompts generation system creates helpful markdown documents that guide users through common workflows. The process works as follows:

1. The system analyzes the project details (name, description, tech stack)
2. It generates a plan for which command prompts would be useful
3. Standard prompts are generated for all projects:
   - `setup.md`: Project setup and installation
   - `deployment.md`: Deployment instructions
   - `testing.md`: Testing workflows
4. Database-related prompts are conditionally generated based on tech stack:
   - `database-setup.md`
   - `database-migrations.md`
   - `database-queries.md`
5. Project-specific prompts are generated based on the unique aspects of the project
6. All prompts are combined with the other documentation and returned to the frontend

This system ensures users have clear, actionable instructions for the most common workflows in their generated project.

### 2025-03-05T17:45:00Z - Project Generation API Integration

The project generation API endpoint (`/api/projects/generate`) serves as the core integration point for the system:

1. It receives requests with:
   - Project prompt
   - Optional project name
   - Selected tech stack type
   - Optional custom tech stack

2. It coordinates the generation process by:
   - Creating an LLM provider
   - Instantiating a ProjectGenerator
   - Generating or using the provided project name
   - Generating or using the provided tech stack
   - Gathering research context
   - Generating project content, architecture, and features
   - Generating comprehensive documentation
   - Generating command prompts

3. It combines the results and returns:
   - Project metadata
   - Generated documents
   - Research links

4. Error handling is implemented at each stage to provide meaningful feedback

This endpoint serves as the orchestration layer that ties together all the components of the project generation system.

### 2025-03-05T18:00:00Z - Next Steps and Improvements

Prioritized improvements for the project generation system:

1. **Short-term Improvements:**
   - Complete prompt extraction from API routes
   - Improve tech documentation organization with per-technology directories
   - Add caching for document fetching
   - Fix linter errors in the context helper module

2. **Medium-term Improvements:**
   - Implement a robust caching system for LLM responses
   - Add retry mechanisms for failed API calls
   - Improve the accuracy of tech stack detection
   - Enhance the quality of generated documentation

3. **Long-term Vision:**
   - Create a plugin architecture for custom generation steps
   - Add interactive editing of generated documents
   - Implement version control for generated projects
   - Support for more document types and formats

The refactoring has set a solid foundation for these improvements by making the code more modular and maintainable. 