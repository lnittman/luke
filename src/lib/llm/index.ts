import { Project } from '@/utils/constants/projects';
import { 
  loadInitTemplate, 
  loadTechStackTemplates,
  loadInstructionsTemplate,
  loadMemoryIndexTemplate,
  loadMemoryBankTemplate,
  loadArchitectPromptTemplate,
  loadDeveloperPromptTemplate,
  loadDesignerPromptTemplate,
  loadEnterprisePromptTemplate,
  loadArchitectureTemplate,
  loadDeploymentGuideTemplate
} from '../templates';
import { fetchMultipleTechDocs } from '../jina';
import { logInfo, logWarn, logError } from '../logger';
import { fetchTechDocumentation } from '../jina';

/**
 * OpenRouter model interface
 */
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

/**
 * LLM Provider interface
 */
export interface LLMProvider {
  generate: (prompt: string, options?: any) => Promise<string>;
  generateStructured: <T>(prompt: string, options?: any) => Promise<T>;
  getAvailableModels: () => Promise<string[]>;
}

/**
 * Project Documents interface
 */
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

/**
 * Project generation response
 */
export interface ProjectGenerationResponse {
  project: Project;
  documents: ProjectDocuments;
}

/**
 * Tech Stack interface
 */
export interface TechStack {
  frameworks: string[];
  libraries: string[];
  apis: string[];
  tools: string[];
  documentationLinks: Record<string, string>;
}

/**
 * Project Content interface
 */
export interface ProjectContent {
  overview: string[];
  core: string[];
  architecture: string[];
  tech: Array<{ name: string; documentationUrl: string }>;
}

/**
 * Tech Documentation interface
 */
export interface TechDocumentation {
  index: string; // The main tech/index.md file (former tech.md)
  files: Record<string, string>; // Individual tech markdown files
}

/**
 * Helper function to get absolute URL for API endpoints
 * This handles both client-side and server-side environments
 */
function getApiUrl(path: string): string {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined';
  
  if (isBrowser) {
    // Client-side: Use relative URL which will be resolved against the current origin
    return path;
  } else {
    // Server-side: Need absolute URL
    // First try to get the URL from environment variables
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL;
    
    if (baseUrl) {
      // Make sure we have the protocol
      const protocol = baseUrl.startsWith('http') ? '' : 'https://';
      return `${protocol}${baseUrl}${path}`;
    }
    
    // Fallback to localhost for development
    return `http://localhost:${process.env.PORT || 3000}${path}`;
  }
}

/**
 * Create an LLM provider that uses the server-side API
 */
export function createServerApiProvider(): LLMProvider {
  return new ServerApiProvider();
}

/**
 * Server API provider implementation
 */
class ServerApiProvider implements LLMProvider {
  private defaultModel: string = 'anthropic/claude-3.7-sonnet';
  
  constructor() {
    // Constructor logic if needed
  }
  
  /**
   * Generate text using the server-side API
   */
  async generate(prompt: string, options: any = {}): Promise<string> {
    // Generate a unique ID for logging
    const logId = Math.random().toString(36).substring(2, 15);
    
    try {
      const selectedModel = options.model || this.defaultModel;
      
      console.log(`[LLM:${logId}] Request to ${selectedModel}`);
      console.log(`[LLM:${logId}] Prompt: ${prompt.substring(0, 300)}...`);
      
      // Check if we're running in a browser or server environment
      const baseUrl = typeof window !== 'undefined' 
        ? window.location.origin 
        : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9000';
      
      console.log(`[LLM:${logId}] Using base URL: ${baseUrl}`);
      
      const response = await fetch(`${baseUrl}/api/llm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          model: selectedModel,
          temperature: options.temperature || 0.7,
          maxTokens: options.maxTokens || 4000,
          responseFormat: options.responseFormat,
        }),
      });
      
      if (!response.ok) {
        console.error(`API error: ${response.status}`);
        try {
          // Try to get more detailed error information
          const errorData = await response.text();
          console.error(`Error details: ${errorData}`);
          throw new Error(`API error: ${response.status} - ${errorData.substring(0, 200)}`);
        } catch (parseError) {
          throw new Error(`API error: ${response.status} - Could not parse error details`);
        }
      }
      
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';
      
      // Log response details
      console.log(`[LLM:${logId}] Response status: ${response.status}`);
      console.log(`[LLM:${logId}] Response length: ${content.length}`);
      console.log(`[LLM:${logId}] Response preview: ${content.substring(0, 300)}...`);
      
      return content;
    } catch (error) {
      console.error(`[LLM:${logId}] Error:`, error);
      throw error;
    }
  }
  
  /**
   * Generate structured data using the server-side API
   */
  async generateStructured<T>(prompt: string, options: any = {}): Promise<T> {
    // Generate a unique ID for logging
    const logId = Math.random().toString(36).substring(2, 15);
    
    console.log(`[LLM:${logId}] Structured Request to ${options.model || this.defaultModel}`);
    console.log(`[LLM:${logId}] Structured Prompt: ${prompt.substring(0, 300)}...`);
    
    try {
      // Request JSON format
      const jsonOptions = {
        ...options,
        responseFormat: { type: "json_object" }
      };
      
      const content = await this.generate(prompt, jsonOptions);
      console.log(`[LLM:${logId}] Structured Response: ${content.substring(0, 300)}...`);
      
      // First try direct JSON parsing
      try {
        return JSON.parse(content);
      } catch (e) {
        console.error(`[LLM:${logId}] Error parsing direct JSON response:`, e);
      }
      
      // Try to extract JSON from markdown code blocks (multiple patterns)
      const jsonMatch = content.match(/```(?:json)?\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          console.log(`[LLM:${logId}] Attempting to parse JSON from markdown code block`);
          return JSON.parse(jsonMatch[1]);
        } catch (innerError) {
          console.error(`[LLM:${logId}] Error parsing extracted JSON from code block:`, innerError);
        }
      }
      
      // Try to extract JSON if it's potentially wrapped in text before/after
      try {
        console.log(`[LLM:${logId}] Attempting to find and extract JSON from surrounding text`);
        // Look for the first { and last }
        const startIdx = content.indexOf('{');
        const endIdx = content.lastIndexOf('}');
        
        if (startIdx !== -1 && endIdx !== -1 && startIdx < endIdx) {
          const potentialJson = content.substring(startIdx, endIdx + 1);
          console.log(`[LLM:${logId}] Found potential JSON: ${potentialJson.substring(0, 50)}...`);
          return JSON.parse(potentialJson);
        }
      } catch (bracketError) {
        console.error(`[LLM:${logId}] Error parsing JSON using bracket extraction:`, bracketError);
      }
      
      // If all extraction attempts fail, throw a descriptive error
      throw new Error(`Invalid JSON response from LLM API. Response starts with: "${content.substring(0, 100)}..."`);
    } catch (error) {
      console.error(`[LLM:${logId}] Error generating structured content:`, error);
      throw error;
    }
  }
  
  /**
   * Get available models from the server-side API
   */
  async getAvailableModels(): Promise<string[]> {
    try {
      const apiUrl = getApiUrl('/api/llm/models');
      const response = await fetch(apiUrl, {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data || !data.models || !Array.isArray(data.models)) {
        throw new Error('Invalid response format from models API');
      }

      return data.models;
    } catch (error) {
      console.error('Error fetching models:', error);
      
      // Return default models if API call fails
      return [
        'anthropic/claude-3.7-sonnet',
        'anthropic/claude-3.7-haiku',
        'anthropic/claude-3.5-sonnet',
        'anthropic/claude-3-opus',
        'anthropic/claude-3-sonnet',
        'anthropic/claude-3-haiku',
        'google/gemini-2-flash',
        'google/gemini-2-pro',
        'google/gemini-1.5-flash',
        'google/gemini-1.5-pro',
        'openai/gpt-4o',
        'openai/gpt-4-turbo',
        'openai/gpt-3.5-turbo',
      ];
    }
  }
}

/**
 * Project generation service
 */
export class ProjectGenerator {
  public provider: LLMProvider;
  private projectName: string = '';
  private techStackInfo: any = null;
  private initialPrompt: string = '';
  
  constructor() {
    this.provider = createServerApiProvider();
  }
  
  /**
   * Generate a technology stack based on a project prompt
   */
  async generateTechStack(prompt: string): Promise<TechStack> {
    try {
      console.log('Generating tech stack using Claude-3.7-sonnet...');
      
      // Use Jina Search API to find up-to-date tech stack recommendations
      const { searchDocumentation } = await import('../jina');
      
      // Search for tech stack recommendations related to the project
      console.log('Searching for tech stack recommendations...');
      const searchResults = await searchDocumentation(
        `modern tech stack for ${prompt} software development 2023 latest frameworks libraries`
      );
      
      // Extract relevant information from search results
      let techContext = '';
      if (searchResults && searchResults.length > 0) {
        // Take the first 2 results at most
        techContext = searchResults.slice(0, 2).map((result: any) => {
          // Extract a limited amount of content to stay within token limits
          return result.content.substring(0, 2000);
        }).join('\n\n');
        
        console.log('Found tech stack context from search results');
      } else {
        console.log('No search results found for tech stack, using LLM knowledge only');
      }
      
      // Create an enhanced system prompt with the search results
      const systemPrompt = `
You are a technology stack advisor with deep expertise in modern software development.
Your task is to analyze a project idea and recommend the most appropriate technology stack.

Based on the user's project description, create a comprehensive and opinionated technology stack recommendation.
Provide a detailed breakdown of recommended frameworks, libraries, APIs, and tools.
Include documentation links for each technology recommended.

${techContext ? `Here's some up-to-date information about current tech stacks that might be relevant to this project:

${techContext}

Use this information to inform your recommendations, but feel free to include other technologies that would be appropriate for the project.` : ''}

Return your response as a JSON object with the following structure:
{
  "frameworks": ["framework1", "framework2"],
  "libraries": ["library1", "library2"],
  "apis": ["api1", "api2"],
  "tools": ["tool1", "tool2"],
  "documentationLinks": {
    "framework1": "https://framework1.docs.com",
    "library1": "https://library1.docs.com"
  }
}

Make sure your recommendations are:
1. Current and modern (using the latest stable versions)
2. Well-matched to the project requirements
3. Compatible with each other
4. Complete enough to cover all aspects of the project
5. Pragmatic and production-ready

Focus only on delivering the JSON structure above, without additional explanations.
`;

      const fullPrompt = `${systemPrompt}\n\nProject description: ${prompt}\n\nProvide a detailed technology stack recommendation:`;
      
      // Call LLM to generate tech stack
      const techStackResponse = await this.provider.generateStructured<TechStack>(
        systemPrompt + '\n\n' + prompt,
        {
          model: 'anthropic/claude-3.7-sonnet', // Explicitly specify the model
          responseFormat: { type: "json_object" },
          temperature: 0.7
        }
      );
      
      return techStackResponse;
    } catch (error) {
      console.error('Error generating tech stack:', error);
      // Return a minimal default tech stack if generation fails
      return {
        frameworks: ["react", "next.js"],
        libraries: ["tailwindcss", "framer-motion"],
        apis: [],
        tools: ["typescript", "eslint"],
        documentationLinks: {
          "react": "https://reactjs.org/",
          "next.js": "https://nextjs.org/",
          "tailwindcss": "https://tailwindcss.com/",
          "framer-motion": "https://www.framer.com/motion/",
          "typescript": "https://www.typescriptlang.org/",
          "eslint": "https://eslint.org/"
        }
      };
    }
  }
  
  /**
   * Generate project content based on a prompt and tech stack
   */
  async generateProjectContent(prompt: string, techStack: TechStack): Promise<ProjectContent> {
    const systemPrompt = `
You are a project content generator that takes a user's project idea and technology stack to create structured project content.
The content should be concise, specific, and focused on the project's overview, core features, architecture, and technologies.

The output should be a JSON object with the following structure:
{
  "overview": [
    "Feature 1 overview",
    "Feature 2 overview",
    "Feature 3 overview",
    "Feature 4 overview"
  ],
  "core": [
    "Core feature 1",
    "Core feature 2",
    "Core feature 3",
    "Core feature 4"
  ],
  "architecture": [
    "Architecture point 1",
    "Architecture point 2",
    "Architecture point 3",
    "Architecture point 4"
  ],
  "tech": [
    {"name": "tech1", "documentationUrl": "https://tech1.docs.com"},
    {"name": "tech2", "documentationUrl": "https://tech2.docs.com"}
  ]
}

Make sure each section has exactly 4 items, and the tech section should use the provided technology stack.
Each item should be a concise, specific statement (not more than 10 words each).
`;

    const techStackJson = JSON.stringify(techStack);
    const fullPrompt = `${systemPrompt}\n\nProject idea: ${prompt}\n\nTechnology stack: ${techStackJson}\n\nGenerate project content:`;
    
    try {
      const response = await this.provider.generateStructured<ProjectContent>(fullPrompt, {
        temperature: 0.7,
        maxTokens: 2000
      });
      
      // Ensure tech items include documentation URLs by merging with tech stack
      const techItems = response.tech.map(item => {
        const docUrl = typeof item === 'string' 
          ? techStack.documentationLinks[item] || `https://www.google.com/search?q=${encodeURIComponent(item)}` 
          : item.documentationUrl;
        
        const name = typeof item === 'string' ? item : item.name;
        
        return {
          name,
          documentationUrl: docUrl
        };
      });
      
      return {
        ...response,
        tech: techItems
      };
    } catch (error) {
      console.error('Error generating project content:', error);
      // Return minimal default content
      return {
        overview: [
          "Innovative user experience",
          "Seamless integration with existing systems",
          "Robust data handling capabilities",
          "Scalable and maintainable architecture"
        ],
        core: [
          "User authentication and management",
          "Data processing pipeline",
          "Real-time updates and notifications",
          "API integration with third-party services"
        ],
        architecture: [
          "Client-server architecture",
          "RESTful API design",
          "Database normalization",
          "Modular component structure"
        ],
        tech: techStack.frameworks.concat(techStack.libraries).slice(0, 10).map(tech => ({
          name: tech,
          documentationUrl: techStack.documentationLinks[tech] || `https://www.google.com/search?q=${encodeURIComponent(tech)}`
        }))
      };
    }
  }
  
  /**
   * Generate init.md content with development instructions
   */
  async generateInitMd(): Promise<string> {
    // Use the shared init.md template
    const initTemplate = loadInitTemplate();
    
    // If we have a template, use it
    if (initTemplate) {
      return initTemplate;
    }
    
    // Otherwise, generate a new one
    const systemPrompt = `
You are tasked with creating a comprehensive instruction document called 'init.md' that will guide an AI development assistant in implementing a software project.
This document will be used alongside a project specification document to provide clear guidance on the development process.

The init.md document should include the following sections:
1. Role and Objective - The overall purpose of the AI assistant
2. Memory Management Protocol - How to maintain project context
3. Development Workflow - A phased approach to implementation
4. Communication Structure - How to format updates and questions
5. Session Management - Guidelines for development sessions

The document should be written in markdown format and should be generic enough to apply to any software project.
The focus should be on providing clear, actionable instructions that will help an AI assistant work effectively on project implementation.
`;

    const fullPrompt = `${systemPrompt}\n\nGenerate a comprehensive init.md document for AI development assistants:`;
    
    try {
      return await this.provider.generate(fullPrompt, {
        temperature: 0.5,
        maxTokens: 3000
      });
    } catch (error) {
      console.error('Error generating init.md:', error);
      // Return default init.md content
      return `# AI Development Protocol

## Role and Objective
You are an expert development assistant tasked with implementing the project described in the attached document. Your objective is to work methodically through the entire implementation until completion, maintaining consistent context and memory throughout the process.

## Memory Management Protocol
- Begin by thoroughly reading the entire project document
- Create a mental model of the project architecture
- Before each edit, review relevant sections of the project document
- After each edit, update your understanding of project state
- Track implementation status of each component

## Development Workflow
- Start with project setup and configuration
- Implement core architecture and data models
- Build features in priority order
- Add tests and documentation
- Optimize and refine the implementation

## Communication Structure
- Provide regular progress updates
- Explain your implementation decisions
- Ask clarifying questions when needed
- Highlight potential issues or challenges

## Session Management
- At the start of each session, summarize current project state
- At the end of each session, note next steps and open issues
`;
    }
  }
  
  /**
   * Process tech items from project content into a structured tech stack
   * @param techItems Array of tech items from project content
   * @returns Structured tech stack object
   */
  private processTechItems(techItems: Array<string | { name: string; documentationUrl?: string }>): TechStack {
    const result: TechStack = {
      frameworks: [],
      libraries: [],
      apis: [],
      tools: [],
      documentationLinks: {}
    };
    
    // Process each tech item
    for (let i = 0; i < techItems.length; i++) {
      const item = techItems[i];
      
      // Process string tech items
      if (typeof item === 'string') {
        const techName = item.toLowerCase();
        this.categorizeTech(techName, result);
        
        // Add a generic documentation URL if none exists
        result.documentationLinks[techName] = 
          result.documentationLinks[techName] || 
          `https://www.google.com/search?q=${encodeURIComponent(techName)}+documentation`;
      } 
      // Process object tech items with name/documentationUrl
      else if (item && typeof item === 'object') {
        // Safe way to access 'name' property
        const name = 'name' in item && typeof item.name === 'string' 
          ? item.name 
          : null;
          
        if (name) {
          const techName = name.toLowerCase();
          this.categorizeTech(techName, result);
          
          // Add documentation URL if it exists
          if ('documentationUrl' in item && typeof item.documentationUrl === 'string') {
            result.documentationLinks[techName] = item.documentationUrl;
          } else {
            // Add a generic documentation URL if none exists
            result.documentationLinks[techName] = 
              `https://www.google.com/search?q=${encodeURIComponent(techName)}+documentation`;
          }
        } else {
          console.warn(`Tech item at index ${i} has invalid format:`, item);
        }
      } else {
        console.warn(`Tech item at index ${i} has unexpected type:`, typeof item);
      }
    }
    
    return result;
  }

  /**
   * Categorize a technology name into the appropriate category
   * @param techName The technology name (lowercase)
   * @param techStack The tech stack to update
   */
  private categorizeTech(techName: string, techStack: TechStack): void {
    if (techName.includes('js') || 
        techName.includes('framework') || 
        techName.includes('react') || 
        techName.includes('vue') ||
        techName.includes('angular')) {
      techStack.frameworks.push(techName);
    } else if (techName.includes('api') || 
               techName.includes('service') || 
               techName.includes('rest') ||
               techName.includes('graphql')) {
      techStack.apis.push(techName);
    } else if (techName.includes('library') || 
               techName.includes('ui') ||
               techName.includes('component')) {
      techStack.libraries.push(techName);
    } else {
      techStack.tools.push(techName);
    }
  }

  /**
   * Generate all project documentation
   * @param techStack The tech stack to use for templates
   * @param projectContent The project content
   * @returns The project documentation
   */
  async generateProjectDocumentation(
    techStack: string,
    projectContent: any
  ): Promise<ProjectDocuments> {
    try {
      logInfo('Generating project documentation for tech stack: ' + techStack, { tag: 'DOC_GEN' });
      
      // Ensure we have the project name
      const projectName = projectContent?.project?.name || 'Project';
      logInfo(`Using project name: "${projectName}" for all documentation`, { tag: 'DOC_GEN' });
      
      // Load templates for this tech stack
      console.log('Loading templates for tech stack:', techStack, 'using key:', getTemplateKey(techStack));
      const templates = loadTechStackTemplates(techStack);
      console.log('Loaded templates for tech stack:', techStack);
      
      // Research context from enrichment
    const researchContext = projectContent.researchContext || '';
    const researchLinks = projectContent.researchLinks || [];
    console.log(`Using research context with ${researchLinks.length} research links for enhanced documentation`);
    
      // Generate tech.md and tech files with Perplexity Sonar Reasoning
      const techDocs = await this.enrichTechDocumentation(
        projectContent.project.content.tech.items, 
        researchContext,
        researchLinks
      );
      
      // Generate index.md (project overview)
      console.log('Generating index document...');
    const indexPrompt = `
      Create a concise index.md document for this project based on the provided template.
      
      IMPORTANT: The project name is "${projectName}". Use this name consistently throughout all documents.
      
        Project content: ${JSON.stringify(projectContent.project.content)}
        
        Start with this template:
        ${templates.indexTemplate}
      `;
      
      const index = await this.provider.generate(indexPrompt);
      console.log('Index document generated');
      
      // Generate design.md (architecture and design decisions)
      console.log('Generating design document...');
    const designPrompt = `
      Create a comprehensive design.md document for this project based on the provided template.
      
      IMPORTANT: The project name is "${projectName}". Use this name consistently throughout all documents.
      
        Project content: ${JSON.stringify(projectContent.project.content)}
        
        Start with this template:
        ${templates.designTemplate}
      `;
      
      const design = await this.provider.generate(designPrompt);
      console.log('Design document generated');
      
      // Generate code.md (implementation guide)
      console.log('Generating code document...');
    const codePrompt = `
      Create a detailed code.md implementation guide for this project based on the provided template.
      
      IMPORTANT: The project name is "${projectName}". Use this name consistently throughout all documents.
      
        Project content: ${JSON.stringify(projectContent.project.content)}
        
        Start with this template:
        ${templates.codeTemplate}
      `;
      
      const code = await this.provider.generate(codePrompt);
      console.log('Code document generated');
      
      // Generate init.md (LLM assistant initialization)
      console.log('Generating init document...');
      const initPrompt = `
        Create a comprehensive init.md document that provides clear instructions for AI assistants on implementing this project.
        
        IMPORTANT: The project name is "${projectName}". Use this name consistently throughout all documents.
        This document should act as a system/utility prompt for LLMs when working on the project.
        
        Project content: ${JSON.stringify(projectContent.project.content)}
        
        Start with this template:
        ${loadInitTemplate()}
      `;
      
      const init = await this.provider.generate(initPrompt);
      console.log('Init document generated');
      
      // Generate instructions.md (workflow instructions)
      console.log('Generating instructions document...');
      const instructionsPrompt = `
        Create a comprehensive instructions.md document that provides project-specific workflows and detailed guidance for implementing the project.
      
      IMPORTANT: The project name is "${projectName}". Use this name consistently throughout all documents.
      
        Start with this template:
        ${loadInstructionsTemplate()}
        
        Project content: ${JSON.stringify(projectContent.project.content)}
      `;
      
      const instructions = await this.provider.generate(instructionsPrompt);
      console.log('Instructions document generated');
      
      // Generate memory/index.md (memory system guide)
      console.log('Generating memory index document...');
      const memoryIndexPrompt = `
        Create a comprehensive memory/index.md document that explains the memory system for maintaining context in agentic LLM workflows.
        
        IMPORTANT: The project name is "${projectName}". Use this name consistently throughout all documents.
        
        Start with this template:
        ${loadMemoryIndexTemplate()}
        
        Project content: ${JSON.stringify(projectContent.project.content)}
      `;
      
      const memoryIndex = await this.provider.generate(memoryIndexPrompt);
      console.log('Memory index document generated');
      
      // ... similarly update the remaining document prompts to use projectName ...
      
      // ... existing code ...
    } catch (error) {
      console.error('Error generating project documentation:', error);
      
      // Return empty documents
    return {
        index: '',
        design: '',
        code: '',
        init: '',
        tech: '',
        instructions: '',
        memoryIndex: '',
        memoryBank: '',
        promptArchitect: '',
        promptDeveloper: '',
        promptDesigner: '',
        promptEnterprise: '',
        architectureSample: '',
        deployment: '',
        techFiles: {}
      };
    }
  }
  
  /**
   * Enhances a complete document with section-by-section improvements
   * @param document The full document content
   * @param techStack The technology stack for the project
   * @returns Enhanced document content
   */
  private async enhanceDocument(document: string, techStack: TechStack): Promise<string> {
    try {
      // Split the document into sections based on markdown headers
      const sections = document.split(/^#{2,3}\s+/m);
      
      // The first section is everything before the first ## or ### header
      const preamble = sections[0];
      
      // Process each section after the preamble
      const enhancedSections = [preamble];
      
      for (let i = 1; i < sections.length; i++) {
        const section = sections[i];
        
        // Extract the section title (first line)
        const lines = section.split('\n');
        const sectionTitle = lines[0].trim();
        
        // Skip empty sections
        if (!sectionTitle) {
          continue;
        }
        
        console.log(`Processing section: ${sectionTitle}`);
        
        // Enhance this section
        const enhancedSection = await this.enhanceDocumentSection(
          section,
          sectionTitle,
          techStack
        );
        
        // Add the enhanced section with its header
        enhancedSections.push(`## ${enhancedSection}`);
      }
      
      // Combine the enhanced sections
      return enhancedSections.join('\n\n');
    } catch (error) {
      console.error('Error enhancing document:', error);
      return document;
    }
  }
  
  /**
   * Enhances a specific section of documentation with relevant technology information
   * @param section The section content to enhance
   * @param sectionTitle The title of the section
   * @param techStack The technology stack for the project
   * @returns Enhanced section content
   */
  private async enhanceDocumentSection(
    section: string, 
    sectionTitle: string, 
    techStack: TechStack
  ): Promise<string> {
    try {
      // Identify technologies relevant to this section
      const relevantTechs = this.identifyRelevantTechnologies(sectionTitle, techStack);
      
      if (relevantTechs.length === 0) {
        return section;
      }
      
      console.log(`Enhancing section "${sectionTitle}" with relevant techs:`, 
        relevantTechs.map(t => t.name).join(', '));
      
      // Fetch documentation for these technologies
      const techDocs = await fetchMultipleTechDocs(relevantTechs, 2);
      
      if (!techDocs) {
        return section;
      }
      
      // Use the LLM to enhance the section with the fetched documentation
      const prompt = `You are a technical documentation expert. Enhance this documentation section:

Section Title: ${sectionTitle}

Current Content:
${section}

Using this relevant technology documentation:
${techDocs}

Produce an improved version of the section that:
1. Incorporates best practices and specific details from the technology documentation
2. Adds concrete examples where appropriate
3. Includes more specific implementation guidance
4. Maintains the original structure and purpose
5. Keeps a clear, concise writing style
6. Adds links to official documentation where helpful

Return only the enhanced section content, without any explanation or commentary.`;
      
      const enhancedSection = await this.provider.generate(prompt, {
        temperature: 0.7,
        maxTokens: 4000
      });
      
      return enhancedSection;
    } catch (error) {
      console.error(`Error enhancing document section "${sectionTitle}":`, error);
      return section;
    }
  }
  
  /**
   * Identifies technologies relevant to a specific document section
   * @param sectionTitle The title of the section (e.g., "API Integration", "State Management")
   * @param techStack The technology stack for the project
   * @returns Array of relevant technologies with their documentation URLs
   */
  private identifyRelevantTechnologies(
    sectionTitle: string, 
    techStack: TechStack
  ): Array<{name: string, docUrl?: string}> {
    // Convert section title to lowercase for easier matching
    const section = sectionTitle.toLowerCase();
    
    // Map of section keywords to relevant technology types
    const sectionToTechMap: Record<string, string[]> = {
      // UI/Design related sections
      'ui': ['ui', 'component', 'design', 'style', 'css', 'tailwind', 'framer'],
      'design': ['ui', 'component', 'design', 'style', 'css', 'tailwind', 'framer'],
      'component': ['ui', 'component', 'react', 'vue', 'angular', 'svelte'],
      'style': ['css', 'tailwind', 'style', 'design'],
      
      // Architecture related sections
      'architecture': ['framework', 'structure', 'pattern', 'design pattern'],
      'structure': ['framework', 'structure', 'pattern', 'design pattern'],
      'pattern': ['pattern', 'design pattern', 'architecture'],
      
      // API related sections
      'api': ['api', 'rest', 'graphql', 'http', 'fetch', 'axios'],
      'integration': ['api', 'rest', 'graphql', 'http', 'fetch', 'axios'],
      'service': ['api', 'rest', 'graphql', 'http', 'fetch', 'axios'],
      
      // State management related sections
      'state': ['state', 'redux', 'mobx', 'zustand', 'context', 'store'],
      'store': ['state', 'redux', 'mobx', 'zustand', 'context', 'store'],
      'management': ['state', 'redux', 'mobx', 'zustand', 'context', 'store'],
      
      // Data related sections
      'data': ['database', 'orm', 'sql', 'nosql', 'prisma', 'mongoose'],
      'database': ['database', 'orm', 'sql', 'nosql', 'prisma', 'mongoose'],
      'model': ['database', 'orm', 'sql', 'nosql', 'prisma', 'mongoose'],
      
      // Testing related sections
      'test': ['test', 'jest', 'cypress', 'testing', 'vitest'],
      'testing': ['test', 'jest', 'cypress', 'testing', 'vitest'],
      
      // Deployment related sections
      'deploy': ['deploy', 'ci', 'cd', 'docker', 'kubernetes', 'vercel'],
      'deployment': ['deploy', 'ci', 'cd', 'docker', 'kubernetes', 'vercel'],
      'ci': ['deploy', 'ci', 'cd', 'github', 'gitlab', 'jenkins'],
      'cd': ['deploy', 'ci', 'cd', 'github', 'gitlab', 'jenkins'],
    };
    
    // Find matching section keywords
    const matchingKeywords: string[] = [];
    for (const [keyword, _] of Object.entries(sectionToTechMap)) {
      if (section.includes(keyword)) {
        matchingKeywords.push(keyword);
      }
    }
    
    // If no matching keywords, return a subset of all technologies
    if (matchingKeywords.length === 0) {
      // Combine all tech categories and take the first 3
      const allTechs = [
        ...techStack.frameworks,
        ...techStack.libraries,
        ...techStack.apis,
        ...techStack.tools
      ].slice(0, 3);
      
      return allTechs.map(tech => ({
        name: tech,
        docUrl: techStack.documentationLinks[tech]
      }));
    }
    
    // Collect relevant technology keywords
    const relevantKeywords = new Set<string>();
    for (const keyword of matchingKeywords) {
      const techKeywords = sectionToTechMap[keyword] || [];
      techKeywords.forEach(k => relevantKeywords.add(k));
    }
    
    // Find technologies that match the relevant keywords
    const relevantTechs: Array<{name: string, docUrl?: string}> = [];
    
    // Helper function to check if a tech matches any relevant keyword
    const isTechRelevant = (tech: string): boolean => {
      const techLower = tech.toLowerCase();
      for (const keyword of Array.from(relevantKeywords)) {
        if (techLower.includes(keyword)) {
          return true;
        }
      }
      return false;
    };
    
    // Check frameworks
    for (const tech of techStack.frameworks) {
      if (isTechRelevant(tech)) {
        relevantTechs.push({
          name: tech,
          docUrl: techStack.documentationLinks[tech]
        });
      }
    }
    
    // Check libraries
    for (const tech of techStack.libraries) {
      if (isTechRelevant(tech)) {
        relevantTechs.push({
          name: tech,
          docUrl: techStack.documentationLinks[tech]
        });
      }
    }
    
    // Check APIs
    for (const tech of techStack.apis) {
      if (isTechRelevant(tech)) {
        relevantTechs.push({
          name: tech,
          docUrl: techStack.documentationLinks[tech]
        });
      }
    }
    
    // Check tools
    for (const tech of techStack.tools) {
      if (isTechRelevant(tech)) {
        relevantTechs.push({
          name: tech,
          docUrl: techStack.documentationLinks[tech]
        });
      }
    }
    
    // If we found relevant techs, return them (up to 3)
    if (relevantTechs.length > 0) {
      return relevantTechs.slice(0, 3);
    }
    
    // Fallback: return a subset of all technologies
    const allTechs = [
      ...techStack.frameworks,
      ...techStack.libraries,
      ...techStack.apis,
      ...techStack.tools
    ].slice(0, 3);
    
    return allTechs.map(tech => ({
      name: tech,
      docUrl: techStack.documentationLinks[tech]
    }));
  }

  /**
   * Enhanced tech documentation with Perplexity/Sonar and Jina
   */
  async enrichTechDocumentation(
    techStack: any, 
    researchContext: string, 
    researchLinks: string[]
  ): Promise<TechDocumentation> {
    logInfo('Generating tech documentation with comprehensive tech files', { tag: 'TECH_DOCS' });
    
    // Generate the main tech/index.md (former tech.md)
      const techMdPrompt = `
        Create a comprehensive technology glossary markdown file (tech.md) that explains all technologies used in this project.
        
        Format the document with a clear structure:
        1. Start with a title "# Technology Glossary"
        2. Include a brief introduction
        3. Group technologies by category (Frameworks, Libraries, APIs, Tools)
        4. For each technology, include:
         - Name with link to documentation
         - Brief explanation (1-2 sentences)
         - Key features or benefits (bullet points)
         - Basic usage example where appropriate (in code blocks)
      
      Technologies to include:
      Frameworks: ${techStack.frameworks.join(", ")}
      Libraries: ${techStack.libraries.join(", ")}
      APIs: ${techStack.apis.join(", ")}
      Tools: ${techStack.tools.join(", ")}
      
      Use the following research context to enhance your explanations:
      ${researchContext.substring(0, 2000)}
      
      Research sources:
      ${researchLinks.slice(0, 5).join("\n")}
    `;
    
    const techIndexMd = await this.provider.generate(techMdPrompt);
    logInfo("Tech.md document generated", { tag: 'TECH_DOCS' });

    // Process tech items for individual documentation
    const techItems: string[] = [];
    
    // Extract tech items from techStack or research context
    if (techStack && techStack.frameworks) {
      techItems.push(...techStack.frameworks);
    }
    if (techStack && techStack.libraries) {
      techItems.push(...techStack.libraries);
    }
    if (techStack && techStack.apis) {
      techItems.push(...techStack.apis);
    }
    if (techStack && techStack.tools) {
      techItems.push(...techStack.tools);
    }
    
    logInfo(`Generating detailed documentation for ${techItems.length} technologies`, { tag: 'TECH_DOCS' });
    
    // Generate individual tech markdown files
    const techFiles: Record<string, string> = {};
    for (const techName of techItems) {
      try {
        // Sanitize tech name for file system
        const sanitizedName = techName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        
        // Try to fetch documentation from web
        let techDoc: string;
        const docUrl = techStack?.documentationLinks?.[techName] || 
                      `https://www.google.com/search?q=${encodeURIComponent(techName)}`;
        
        try {
          techDoc = await fetchTechDocumentation(techName, docUrl);
    } catch (error) {
          // If fetch fails, generate with LLM
          logWarn(`Failed to fetch docs for ${techName}, generating with LLM`, { tag: 'TECH_DOCS' });
          techDoc = await this.generateTechMdFile(techName, docUrl, researchContext);
        }
        
        techFiles[`${sanitizedName}.md`] = techDoc;
        
        // Save to filesystem
        const fs = require('fs');
        const path = require('path');
        const techDir = path.join(process.cwd(), 'docs', 'tech');
        
        if (!fs.existsSync(techDir)) {
          fs.mkdirSync(techDir, { recursive: true });
        }
        
        fs.writeFileSync(path.join(techDir, `${sanitizedName}.md`), techDoc);
        logInfo(`Saved tech documentation for ${techName} to filesystem`, { tag: 'TECH_DOCS' });
      } catch (error) {
        logError(`Error generating documentation for ${techName}`, { tag: 'TECH_DOCS', data: error });
      }
    }
    
    return {
      index: techIndexMd,
      files: techFiles
    };
  }

  /**
   * Generate a documentation file for a specific technology
   */
  async generateTechMdFile(
    techName: string, 
    docUrl: string, 
    researchContext: string
  ): Promise<string> {
    const prompt = `
      Create a comprehensive documentation file for ${techName}.
      
      Format the document with this structure:
      1. Start with a title "# ${techName}"
      2. Brief overview and purpose
      3. Key features
      4. Installation and setup
      5. Basic usage examples
      6. Common patterns
      7. Best practices
      8. Resources and links
      
      Include code examples where appropriate.
      Documentation URL: ${docUrl}
      
      Use the following research context to enhance your documentation:
      ${researchContext.substring(0, 1000)}
    `;
    
    try {
      return await this.provider.generate(prompt);
    } catch (error) {
      console.error(`Error generating tech documentation for ${techName}:`, error);
      return `# ${techName}\n\nThis technology is used in the project. Refer to [the documentation](${docUrl}) for more information.`;
    }
  }

  async generateProjectName(concept: string): Promise<string> {
    console.log("Generating project name...");
    
    const namePrompt = `
      Generate a single-word, short and cute project name (maximum 2-3 syllables) for this concept:
      "${concept}"
      
      The name should be memorable, easy to pronounce, and reflect the essence of the project.
      It should follow the pattern of existing project names like: squish, top, voet, sine, helios, ther, loops, jobs.
      
      Return ONLY the name, nothing else - no quotes, no explanation, just the single word.
    `;
    
    try {
      const nameResponse = await this.provider.generate(namePrompt, {
        temperature: 0.9, // Higher temperature for creativity
        maxTokens: 50 // Short response needed
      });
      
      // Clean up the response to ensure it's a single word
      const cleanedName = nameResponse.trim().toLowerCase().split(/\s+/)[0];
      console.log(`Generated project name: ${cleanedName}`);
      
      // Store the name for later use
      this.projectName = cleanedName;
      
      return cleanedName;
    } catch (error) {
      console.error("Error generating project name:", error);
      // Fallback to a simple name based on concept
      const fallbackName = concept.toLowerCase().split(/\s+/)[0].replace(/[^a-z0-9]/g, '');
      this.projectName = fallbackName.substring(0, 10); // Limit length
      return this.projectName;
    }
  }

  private async addResourceSections(
    documents: {
      index: string;
      design: string;
      code: string;
      init: string;
      tech: string;
    },
    projectContent: ProjectContent,
    researchLinks: string[] = []
  ): Promise<{
    index: string;
    design: string;
    code: string;
    init: string;
    tech: string;
  }> {
    // Skip adding resources to tech.md as it already has them
    const enhancedDocuments = { ...documents };
    console.log(`[RESOURCES] Starting resource section enhancement for documents`);
    console.log(`[RESOURCES] Available research links: ${researchLinks.length}`);
    
    // Enhance index.md with resources
    const indexQuery = `Find the most relevant, high-quality resources (documentation, tutorials, articles) for this project:
      ${documents.index.substring(0, 2000)}...
      
      Project technologies: ${projectContent.tech.map(t => typeof t === 'string' ? t : t.name).join(", ")}
      
      Consider including these highly relevant links from research:
      ${researchLinks.slice(0, 5).join('\n')}
      
      Return ONLY a markdown-formatted "## Resources" section with 5-8 specific, highly relevant links.
      
      Format MUST be:
      
      ## Resources
      
      - [Resource Name](URL) - Brief description of what this resource provides
      - [Resource Name](URL) - Brief description of what this resource provides
      
      Do not include any text outside of the "## Resources" section.`;
    
    try {
      console.log("[RESOURCES] Enhancing index.md with resources...");
      const indexResources = await this.getPerplexityResources(indexQuery);
      console.log(`[RESOURCES] Received index resources (${indexResources.length} chars): "${indexResources.substring(0, 100)}..."`);
      
      // Check if the document already has a Resources section
      if (!documents.index.includes("## Resources")) {
        enhancedDocuments.index = `${documents.index}\n\n${indexResources}`;
        console.log(`[RESOURCES] Added resources section to index.md (${enhancedDocuments.index.length} chars)`);
      } else {
        console.log(`[RESOURCES] index.md already has a resources section`);
      }
    } catch (error) {
      console.error(`[ERROR] Error enhancing index.md with resources: ${error instanceof Error ? error.message : String(error)}`);
      // Add a basic resources section if the API call fails
      if (!documents.index.includes("## Resources") && researchLinks.length > 0) {
        const fallbackResources = `
## Resources

${researchLinks.slice(0, 5).map(link => `- [Resource](${link}) - Related resource for this project`).join('\n')}
`;
        enhancedDocuments.index = `${documents.index}\n\n${fallbackResources}`;
        console.log(`[RESOURCES] Added fallback resources section to index.md`);
      }
    }
    
    // Similar process for design.md
    const designQuery = `Find the most relevant, high-quality design resources for this project:
      ${documents.design.substring(0, 1500)}...
      
      Project technologies: ${projectContent.tech.map(t => typeof t === 'string' ? t : t.name).join(", ")}
      
      Consider including these highly relevant links from research:
      ${researchLinks.slice(0, 5).join('\n')}
      
      Return ONLY a markdown-formatted "## Resources" section with 5-8 specific design-related links (UI libraries, design systems, component documentation).
      
      Format MUST be:
      
      ## Resources
      
      - [Resource Name](URL) - Brief description of what this resource provides
      - [Resource Name](URL) - Brief description of what this resource provides
      
      Do not include any text outside of the "## Resources" section.`;
    
    try {
      console.log("[RESOURCES] Enhancing design.md with resources...");
      const designResources = await this.getPerplexityResources(designQuery);
      console.log(`[RESOURCES] Received design resources (${designResources.length} chars): "${designResources.substring(0, 100)}..."`);
      
      // Check if the document already has a Resources section
      if (!documents.design.includes("## Resources")) {
        enhancedDocuments.design = `${documents.design}\n\n${designResources}`;
        console.log(`[RESOURCES] Added resources section to design.md (${enhancedDocuments.design.length} chars)`);
      } else {
        console.log(`[RESOURCES] design.md already has a resources section`);
      }
    } catch (error) {
      console.error(`[ERROR] Error enhancing design.md with resources: ${error instanceof Error ? error.message : String(error)}`);
      // Add a basic resources section if the API call fails
      if (!documents.design.includes("## Resources") && researchLinks.length > 0) {
        const fallbackResources = `
## Resources

${researchLinks.slice(0, 5).map(link => `- [Resource](${link}) - Related design resource for this project`).join('\n')}
`;
        enhancedDocuments.design = `${documents.design}\n\n${fallbackResources}`;
        console.log(`[RESOURCES] Added fallback resources section to design.md`);
      }
    }
    
    // Similar process for code.md
    const codeQuery = `Find the most relevant, high-quality coding resources for this project:
      ${documents.code.substring(0, 1500)}...
      
      Project technologies: ${projectContent.tech.map(t => typeof t === 'string' ? t : t.name).join(", ")}
      
      Consider including these highly relevant links from research:
      ${researchLinks.slice(0, 5).join('\n')}
      
      Return ONLY a markdown-formatted "## Resources" section with 5-8 specific implementation-related links (code examples, tutorials, libraries, packages).
      
      Format MUST be:
      
      ## Resources
      
      - [Resource Name](URL) - Brief description of what this resource provides
      - [Resource Name](URL) - Brief description of what this resource provides
      
      Do not include any text outside of the "## Resources" section.`;
    
    try {
      console.log("[RESOURCES] Enhancing code.md with resources...");
      const codeResources = await this.getPerplexityResources(codeQuery);
      console.log(`[RESOURCES] Received code resources (${codeResources.length} chars): "${codeResources.substring(0, 100)}..."`);
      
      // Check if the document already has a Resources section
      if (!documents.code.includes("## Resources")) {
        enhancedDocuments.code = `${documents.code}\n\n${codeResources}`;
        console.log(`[RESOURCES] Added resources section to code.md (${enhancedDocuments.code.length} chars)`);
      } else {
        console.log(`[RESOURCES] code.md already has a resources section`);
      }
    } catch (error) {
      console.error(`[ERROR] Error enhancing code.md with resources: ${error instanceof Error ? error.message : String(error)}`);
      // Add a basic resources section if the API call fails
      if (!documents.code.includes("## Resources") && researchLinks.length > 0) {
        const fallbackResources = `
## Resources

${researchLinks.slice(0, 5).map(link => `- [Resource](${link}) - Related code resource for this project`).join('\n')}
`;
        enhancedDocuments.code = `${documents.code}\n\n${fallbackResources}`;
        console.log(`[RESOURCES] Added fallback resources section to code.md`);
      }
    }
    
    // And finally init.md
    const initQuery = `Find the most relevant, high-quality resources for AI/LLM implementation guides:
      ${documents.init.substring(0, 1500)}...
      
      Project technologies: ${projectContent.tech.map(t => typeof t === 'string' ? t : t.name).join(", ")}
      
      Consider including these highly relevant links from research:
      ${researchLinks.slice(0, 5).join('\n')}
      
      Return ONLY a markdown-formatted "## Resources" section with 5-8 specific AI implementation-related links.
      
      Format MUST be:
      
      ## Resources
      
      - [Resource Name](URL) - Brief description of what this resource provides
      - [Resource Name](URL) - Brief description of what this resource provides
      
      Do not include any text outside of the "## Resources" section.`;
    
    try {
      console.log("[RESOURCES] Enhancing init.md with resources...");
      const initResources = await this.getPerplexityResources(initQuery);
      console.log(`[RESOURCES] Received init resources (${initResources.length} chars): "${initResources.substring(0, 100)}..."`);
      
      // Check if the document already has a Resources section
      if (!documents.init.includes("## Resources")) {
        enhancedDocuments.init = `${documents.init}\n\n${initResources}`;
        console.log(`[RESOURCES] Added resources section to init.md (${enhancedDocuments.init.length} chars)`);
      } else {
        console.log(`[RESOURCES] init.md already has a resources section`);
      }
    } catch (error) {
      console.error(`[ERROR] Error enhancing init.md with resources: ${error instanceof Error ? error.message : String(error)}`);
      // Add a basic resources section if the API call fails
      if (!documents.init.includes("## Resources") && researchLinks.length > 0) {
        const fallbackResources = `
## Resources

${researchLinks.slice(0, 5).map(link => `- [Resource](${link}) - Related AI implementation resource`).join('\n')}
`;
        enhancedDocuments.init = `${documents.init}\n\n${fallbackResources}`;
        console.log(`[RESOURCES] Added fallback resources section to init.md`);
      }
    }
    
    console.log(`[RESOURCES] Resource section enhancement completed for all documents`);
    return enhancedDocuments;
  }

  private async getPerplexityResources(query: string): Promise<string> {
    console.log(`[PERPLEXITY] Sending resource query to Perplexity (${query.length} chars)`);
    try {
      // Use absolute URL instead of relative URL
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:9000';
      console.log(`[PERPLEXITY] Using API endpoint: ${baseUrl}/api/sonar`);
      
      const response = await fetch(`${baseUrl}/api/sonar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        console.error(`[ERROR] Perplexity API error: Status ${response.status}, Response: ${errorText}`);
        throw new Error(`Perplexity API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`[PERPLEXITY] Received response from Perplexity: ${JSON.stringify(data).substring(0, 150)}...`);
      
      if (!data.content) {
        console.warn(`[WARN] Perplexity returned empty content`);
        return "## Resources\n\n*No resources available at this time*";
      }
      
      // Ensure the response has the correct format (starts with ## Resources)
      let content = data.content;
      if (!content.trim().startsWith('## Resources')) {
        console.warn(`[WARN] Perplexity response does not start with '## Resources', fixing format: ${content.substring(0, 100)}...`);
        content = `## Resources\n\n${content}`;
      }
      
      // Add a minimum of resources if the section appears empty
      if (content.includes('*No resources available*') || 
          !content.includes('- [') || 
          content.split('\n').length < 4) {
        console.warn(`[WARN] Perplexity returned empty or minimal resources section`);
        return "## Resources\n\n- [Official Documentation](https://example.com) - Official documentation for this technology\n- [GitHub Repository](https://github.com) - Source code and examples";
      }
      
      return content;
    } catch (error) {
      console.error(`[ERROR] Error getting Perplexity resources: ${error instanceof Error ? error.message : String(error)}`);
      return "## Resources\n\n*Error fetching resources*";
    }
  }
}

// Export a singleton instance of the project generator
export const projectGenerator = new ProjectGenerator(); 