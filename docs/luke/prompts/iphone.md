# Project Generation System: Refactoring Progress and Next Steps

This document describes the current state of the project generation system after recent refactoring efforts, focusing on architectural improvements, component interactions, and technical details.

## 1. Current Status

The project generation system has undergone significant refactoring to improve modularity, maintainability, and code organization. Major changes include:

- Modularization of the monolithic `src/lib/llm/index.ts` file
- Reorganization of prompts into a dedicated directory structure
- Extraction of generators and providers into separate modules
- Standardization of interfaces for LLM providers and project generation

### 1.1 New Module Structure

```
src/lib/llm/
├── prompts/                  # Extracted prompts from API routes
│   ├── project-generation/   # Project generation prompts
│   │   ├── search-plan.ts    # Search planning prompts
│   │   ├── content.ts        # Content generation prompts
│   │   ├── name.ts           # Project naming prompts
│   │   └── ...               # Other specialized prompts
│   ├── tech-stack/           # Tech stack generation prompts
│   ├── command-prompts/      # Command workflow prompts
│   └── index.ts              # Unified exports
├── types/                    # Type definitions
│   ├── models.ts             # LLM model types
│   ├── project.ts            # Project structure types
│   ├── responses.ts          # API response types
│   └── index.ts              # Type exports
├── generators/               # Generation logic
│   ├── project-generator.ts  # Main generator class
│   ├── tech-stack.ts         # Tech stack generation
│   ├── content.ts            # Content generation
│   └── index.ts              # Generator exports
├── providers/                # LLM provider implementations
│   ├── server-api-provider.ts # Server API provider
│   └── index.ts              # Provider exports
├── helpers/                  # Utility functions
│   ├── api.ts                # API helper functions
│   └── index.ts              # Helper exports
└── index.ts                  # Main module exports
```

## 2. LLM Module Breakdown

### 2.1 Type Definitions

The `types` directory contains essential interfaces for the LLM system:

```typescript
// models.ts
export interface OpenRouterModel {
  id: string;
  name: string;
  description?: string;
  context_length?: number;
  pricing?: {
    prompt?: number;
    completion?: number;
  };
}

export interface LLMProvider {
  generate: (prompt: string, options?: any) => Promise<string>;
  generateStructured: <T>(prompt: string, options?: any) => Promise<T>;
  getAvailableModels: () => Promise<string[]>;
}

// project.ts
export interface TechStack {
  frameworks: string[];
  libraries: string[];
  apis: string[];
  tools: string[];
  documentationLinks: Record<string, string>;
}

export interface ProjectContent {
  overview: string[];
  core: string[];
  architecture: string[];
  tech: Array<{ name: string; documentationUrl: string }>;
}

export interface ProjectDocuments {
  index: string;
  design: string;
  code: string;
  init: string;
  tech: string;
  instructions: string;
  memoryIndex: string;
  memoryBank: string;
  promptArchitect: string;
  promptDeveloper: string;
  promptDesigner: string;
  promptEnterprise: string;
  architectureSample: string;
  deployment: string;
  techFiles?: Record<string, string>;
}
```

### 2.2 Provider Implementation

The `providers` directory contains LLM provider implementations:

```typescript
// server-api-provider.ts
export class ServerApiProvider implements LLMProvider {
  private defaultModel: string = 'anthropic/claude-3.7-sonnet';
  
  constructor() {
    // Initialization logic
  }
  
  async generate(prompt: string, options: any = {}): Promise<string> {
    // Generate text using server-side API
    // ...
  }
  
  async generateStructured<T>(prompt: string, options: any = {}): Promise<T> {
    // Generate structured data using server-side API
    // ...
  }
  
  async getAvailableModels(): Promise<string[]> {
    // Get available models from server-side API
    // ...
  }
}
```

### 2.3 Project Generator

The `generators` directory contains the core generation logic:

```typescript
// project-generator.ts
export class ProjectGenerator {
  public provider: LLMProvider;
  private projectName: string = '';
  private techStackInfo: any = null;
  private initialPrompt: string = '';
  
  constructor() {
    this.provider = createServerApiProvider();
  }
  
  async generateTechStack(prompt: string): Promise<TechStack> {
    // Generate technology stack based on user prompt
    // ...
  }
  
  async generateProjectContent(prompt: string, techStack: TechStack): Promise<ProjectContent> {
    // Generate project content based on prompt and tech stack
    // ...
  }
  
  async generateProjectDocumentation(
    techStack: string,
    projectContent: any
  ): Promise<ProjectDocuments> {
    // Generate comprehensive project documentation
    // ...
  }
  
  // Other generation methods...
}
```

### 2.4 Prompt Organization

The `prompts` directory contains all the prompts used by the system, extracted from API routes:

```typescript
// prompts/project-generation/search-plan.ts
export function generateProjectSearchPlanPrompt(
  prompt: string, 
  techStackType: string, 
  techContext: string = ''
): string {
  // Return formatted prompt for project search plan
  // ...
}

// prompts/tech-stack/tech-stack-generator.ts
export function generateTechStackPrompt(
  prompt: string,
  techContext: string = ''
): string {
  // Return formatted prompt for tech stack generation
  // ...
}

// prompts/command-prompts/command-plan.ts
export function generateCommandPromptPlanPrompt(
  projectName: string,
  projectDescription: string,
  techStack: any,
  researchContext: string
): string {
  // Return formatted prompt for command plan generation
  // ...
}
```

## 3. API Endpoints

The system exposes several API endpoints that interface with the LLM module:

### 3.1 Core LLM Endpoint

```typescript
// src/app/api/llm/route.ts
export async function POST(request: NextRequest) {
  try {
    const { prompt, model, options } = await request.json();
    const provider = createServerApiProvider();
    const result = await provider.generate(prompt, { model, ...options });
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
```

### 3.2 Project Generation Endpoint

```typescript
// src/app/api/projects/generate/route.ts
export async function POST(request: NextRequest) {
  try {
    // Extract request data
    const requestData = await request.json();
    const { prompt, projectName: providedProjectName, selectedTechStackType } = requestData;
    
    // Generate project (simplified for brevity)
    const projectName = providedProjectName || await projectGenerator.generateProjectName(prompt);
    
    // Process tech stack
    let resolvedTechStack = requestData.techStack || await projectGenerator.generateTechStack(prompt);
    
    // Gather project context
    const { context: projectResearchContext, links: researchLinks } = 
      await gatherProjectContext(prompt, selectedTechStackType, resolvedTechStack);
    
    // Generate project content and structure
    const projectContent = await projectGenerator.generateProjectContent(prompt, resolvedTechStack);
    
    // Generate comprehensive documentation
    const documents = await projectGenerator.generateProjectDocumentation(
      selectedTechStackType,
      { ...projectContent, research: projectResearchContext }
    );
    
    // Generate command prompts
    const commandPrompts = await generateCommandPrompts(
      projectName,
      prompt,
      resolvedTechStack,
      projectResearchContext
    );
    
    // Combine results and return
    const generationResponse = {
      project: { /* project details */ },
      documents: { ...documents, ...commandPrompts }
    };
    
    return NextResponse.json(generationResponse);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate project' },
      { status: 500 }
    );
  }
}
```

### 3.3 Model Information Endpoint

```typescript
// src/app/api/llm/models/route.ts
export async function GET(request: NextRequest) {
  try {
    const provider = createServerApiProvider();
    const models = await provider.getAvailableModels();
    return NextResponse.json({ models });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    );
  }
}
```

## 4. ProjectGenerator.tsx Integration

The frontend ProjectGenerator component (`src/components/projects/ProjectGenerator.tsx`) integrates with the LLM system:

### 4.1 Component Structure

The ProjectGenerator component is a complex React component with several key features:

- User input handling for project ideas
- Tech stack selection and customization
- Integration with the LLM API endpoints
- Progressive display of generation results
- Document visualization and management

### 4.2 Key Integration Points

```typescript
// src/components/projects/ProjectGenerator.tsx
export const ProjectGenerator = ({ onProjectGenerated, onCancel, techData }: ProjectGeneratorProps) => {
  // State management
  const [projectName, setProjectName] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [techStack, setTechStack] = useState<TechStackOption>("Next.js");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedProject, setGeneratedProject] = useState<Project | null>(null);
  const [documents, setDocuments] = useState<Record<string, string | null>>({});
  const [documentSources, setDocumentSources] = useState<Record<string, 'perplexity' | 'claude'>>({});
  
  // API integration for project generation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/projects/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          projectName: projectName || undefined,
          selectedTechStackType: techStack,
          techStack: customTechStack,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data: ProjectGenerationResponse = await response.json();
      setGeneratedProject(data.project);
      
      // Process and display documents
      simulateSequentialDocumentGeneration(data.documents);
      
      // Notify parent component
      onProjectGenerated(data.project);
    } catch (error) {
      console.error('Error generating project:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Random idea generation integration
  const generateRandomAppIdea = async () => {
    setSearching(true);
    try {
      const response = await fetch('/api/ideas/random', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ techStack }),
      });
      
      // Process response...
    } catch (error) {
      console.error('Error generating random idea:', error);
    } finally {
      setSearching(false);
    }
  };
  
  // Document handling
  const updateDocument = (docType: string, content: string, source: 'perplexity' | 'claude') => {
    setDocuments(prev => ({ ...prev, [docType]: content }));
    setDocumentSources(prev => ({ ...prev, [docType]: source }));
  };
  
  const simulateSequentialDocumentGeneration = (documents: Record<string, string>) => {
    // Simulate progressive document generation for UX purposes
    const documentTypes = ['tech', 'index', 'design', 'code', 'init'];
    let delay = 0;
    
    documentTypes.forEach(docType => {
      if (documents[docType]) {
        setTimeout(() => {
          updateDocument(docType, documents[docType], docType === 'tech' ? 'perplexity' : 'claude');
        }, delay);
        delay += 1500;
      }
    });
  };
  
  // UI rendering...
};
```

### 4.3 User Experience Flow

1. User enters a project idea in the text area
2. Optionally selects a tech stack (Next.js, Apple, CLI, Other)
3. Clicks "Generate Project" to start the process
4. System shows real-time updates as documents are generated
5. Documents appear sequentially (tech → index → design → code → init)
6. User can view, download, or copy documents
7. Generated project is added to the projects list

## 5. Next Steps

The refactoring is well underway, but several improvements are planned:

### 5.1 Short-term Tasks

1. **Complete Prompt Extraction**
   - Move remaining prompts from API routes to the prompts directory
   - Standardize all prompt interfaces
   - Ensure consistent formatting and error handling

2. **Simplify API Routes**
   - Refactor API routes to delegate all logic to the LLM module
   - Implement consistent error handling and logging
   - Add request validation

3. **Add Missing Unit Tests**
   - Write unit tests for the refactored modules
   - Implement test mocks for the LLM providers
   - Add integration tests for the API endpoints

### 5.2 Medium-term Improvements

1. **Enhanced Caching System**
   - Implement a robust caching system for LLM responses
   - Add cache invalidation strategies
   - Support partial caching of generation steps

2. **Improved Error Recovery**
   - Add retry mechanisms for failed LLM requests
   - Implement fallback strategies for different models
   - Add detailed error reporting

3. **Performance Optimization**
   - Profile and optimize the generation pipeline
   - Implement parallel processing where possible
   - Optimize prompt token usage

### 5.3 Long-term Vision

1. **Plugin System**
   - Create a plugin architecture for custom generation steps
   - Support third-party integrations
   - Allow custom prompts and templates

2. **Enhanced Document Generation**
   - Support more document types and formats
   - Add interactive document editing
   - Implement version control for generated documents

3. **Advanced Project Visualization**
   - Add diagrams and visualizations for project architecture
   - Implement interactive component relationships
   - Support code previews and prototypes

## 6. Challenges and Considerations

### 6.1 Current Challenges

1. **Token Limits**
   - Large projects can exceed model context windows
   - Need strategies for chunking and summarizing

2. **Model Consistency**
   - Different models produce varying results
   - Need standardization of outputs

3. **Performance**
   - Generation can be slow for complex projects
   - UI responsiveness during generation

### 6.2 Technical Debt

1. **Type Safety**
   - Some areas still use `any` types
   - Need to strengthen type definitions

2. **Error Handling**
   - Inconsistent error handling across modules
   - Missing logging in some areas

3. **Test Coverage**
   - Limited test coverage for new modules
   - Need more thorough testing

## 7. Conclusion

The project generation system refactoring has made significant progress in improving code organization, maintainability, and modularity. The extraction of prompts into a dedicated directory structure provides better visibility and management of the system's "intelligence," while the modularization of the LLM module improves code reuse and testing.

The next phase will focus on completing the prompt extraction, simplifying API routes, and adding comprehensive tests. These improvements will create a more robust foundation for future enhancements to the project generation system. 


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
