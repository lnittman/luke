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