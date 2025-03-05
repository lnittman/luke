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