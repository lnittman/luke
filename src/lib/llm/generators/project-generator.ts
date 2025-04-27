import { LLMProvider } from '../types';
import { createServerApiProvider } from '../providers';
import { logInfo, logError, logWarn } from '../logger';
import { 
  TechStack, 
  ProjectContent, 
  ProjectDocuments,
  TechDocumentation,
  ProjectGenerationResponse
} from '../types';
import { Project } from '@/utils/constants/projects';
import { generateDocumentation } from './documentation';
import { generateTechDocs } from './tech-docs';
import { safeJoin, formatProjectContent, formatTechStack } from '../helpers/safe-operations';

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
      this.initialPrompt = prompt;
      logInfo('Generating tech stack using Claude-3.7-sonnet...', { tag: 'PROJECT_GEN' });
      
      // Import relevant functions from other modules
      const { generateTechStack } = await import('./tech-stack');
      const techStack = await generateTechStack(prompt, this.provider);
      
      // Format and validate the tech stack
      this.techStackInfo = formatTechStack(techStack);
      
      // Log the tech stack structure for debugging
      logInfo('Generated tech stack structure:', { 
        tag: 'PROJECT_GEN', 
        data: JSON.stringify(this.techStackInfo, null, 2)
      });
      
      return this.techStackInfo;
    } catch (error) {
      logError(`Error generating tech stack: ${error}`, { tag: 'PROJECT_GEN' });
      // Create a minimal valid tech stack even if generation fails
      this.techStackInfo = formatTechStack(null);
      return this.techStackInfo;
    }
  }
  
  /**
   * Generate project content based on prompt and tech stack
   */
  async generateProjectContent(prompt: string, techStack: TechStack): Promise<ProjectContent> {
    try {
      logInfo('Generating project content...', { tag: 'CONTENT' });
      
      // Import content generator
      const { generateProjectContent } = await import('./content');
      
      // Format the tech stack to ensure it has the right structure
      const formattedTechStack = formatTechStack(techStack);
      
      // Generate and return the project content
      const projectContent = await generateProjectContent(prompt, formattedTechStack, this.provider);
      
      // Format and validate project content
      const formattedContent = formatProjectContent(projectContent);
      
      // Log the project content structure for debugging
      logInfo('Generated project content structure:', { 
        tag: 'PROJECT_GEN', 
        data: JSON.stringify(formattedContent, null, 2)
      });
      
      return formattedContent;
    } catch (error) {
      logError(`Error generating project content: ${error}`, { tag: 'PROJECT_GEN' });
      throw error;
    }
  }
  
  /**
   * Generate project architecture based on prompt, tech stack, and content
   */
  async generateProjectArchitecture(
    prompt: string,
    techStack: TechStack,
    projectContent: ProjectContent
  ): Promise<string> {
    try {
      logInfo('Generating project architecture...', { tag: 'PROJECT_GEN' });
      
      // Format the tech stack and project content to ensure they have the right structure
      const formattedTechStack = formatTechStack(techStack);
      const formattedContent = formatProjectContent(projectContent);
      
      // Build architecture prompt using formatted data
      const architecturePrompt = `
        You are an expert software architect.
        
        Generate a detailed architecture document for a project with the following details:
        
        Project Prompt: ${prompt}
        
        Technology Stack: ${JSON.stringify(formattedTechStack, null, 2)}
        
        Project Overview: ${safeJoin(formattedContent.overview, '\n')}
        
        Core Features: ${safeJoin(formattedContent.core, '\n')}
        
        Architecture Details: ${safeJoin(formattedContent.architecture, '\n')}
        
        The architecture document should include:
        1. A high-level overview of the system architecture
        2. Component breakdown with responsibilities
        3. Data flow diagrams and descriptions
        4. Technology choices and justifications
        5. Deployment architecture
        6. Security considerations
        
        Format the document in Markdown with appropriate headings and sections.
      `;
      
      // Generate architecture document
      return await this.provider.generate(architecturePrompt);
    } catch (error) {
      logError(`Error generating project architecture: ${error}`, { tag: 'PROJECT_GEN' });
      throw error;
    }
  }
  
  /**
   * Generate project features based on prompt, content, and architecture
   */
  async generateProjectFeatures(
    prompt: string,
    projectContent: ProjectContent,
    architecture: string
  ): Promise<string> {
    try {
      logInfo('Generating project features...', { tag: 'PROJECT_GEN' });
      
      // Format project content to ensure it has the right structure
      const formattedContent = formatProjectContent(projectContent);
      
      // Build features prompt
      const featuresPrompt = `
        You are an expert software product manager.
        
        Generate a detailed features document for a project with the following details:
        
        Project Prompt: ${prompt}
        
        Project Overview: ${safeJoin(formattedContent.overview, '\n')}
        
        Core Features: ${safeJoin(formattedContent.core, '\n')}
        
        Architecture Details: ${safeJoin(formattedContent.architecture, '\n')}
        
        Architecture Document: ${architecture.substring(0, 2000)}...
        
        The features document should include:
        1. User stories for primary features
        2. Feature breakdown with priorities
        3. Acceptance criteria for features
        4. Technical dependencies and requirements
        5. Implementation phases
        
        Format the document in Markdown with appropriate headings and sections.
      `;
      
      // Generate features document
      return await this.provider.generate(featuresPrompt);
    } catch (error) {
      logError(`Error generating project features: ${error}`, { tag: 'PROJECT_GEN' });
      throw error;
    }
  }
  
  /**
   * Generate init.md document
   */
  async generateInitMd(): Promise<string> {
    try {
      logInfo('Generating init.md...', { tag: 'PROJECT_GEN' });
      
      // Load init.md template
      return `# Implementation Guide
      
This is a placeholder for the init.md document that would normally contain
implementation instructions for the project. This will be generated by the
documentation module in a future update.`;
    } catch (error) {
      logError(`Error generating init.md: ${error}`, { tag: 'PROJECT_GEN' });
      throw error;
    }
  }
  
  /**
   * Generate project documentation
   */
  async generateProjectDocumentation(
    techStack: string,
    projectContent: any
  ): Promise<ProjectDocuments> {
    try {
      logInfo('Generating project documentation...', { tag: 'PROJECT_GEN' });
      
      // Format the techStackInfo
      const formattedTechStack = formatTechStack(this.techStackInfo);
      
      // Format the project content
      const formattedContent = formatProjectContent(projectContent);
      
      // Log what we're using to generate documentation
      logInfo('Generating documentation with:', {
        tag: 'DOCUMENTATION',
        data: {
          techStack: JSON.stringify(formattedTechStack, null, 2),
          projectContent: JSON.stringify(formattedContent, null, 2)
        }
      });
      
      // Generate documentation with formatted data
      const docs = await generateDocumentation(this.provider, formattedTechStack, formattedContent, this.initialPrompt);
      
      // Generate tech docs with formatted tech stack
      let techMd = '';
      try {
        techMd = await generateTechDocs(this.provider, formattedTechStack);
      } catch (techError) {
        logError(`Error generating tech docs, using fallback: ${techError}`, { tag: 'PROJECT_GEN' });
        techMd = '# Technology Documentation\n\n> This is a placeholder for the tech documentation.';
      }
      
      // Generate init.md
      const initMd = await this.generateInitMd();

      // Generate instructions document
      const instructionsPrompt = `
        You are a technical documentation specialist.
        
        Generate comprehensive instructions.md for a project with the following details:
        
        Project Prompt: ${this.initialPrompt}
        
        Tech Stack: ${JSON.stringify(formattedTechStack || {}, null, 2)}
        
        Project Content:
        - Overview: ${safeJoin(formattedContent?.overview)}
        - Core Features: ${safeJoin(formattedContent?.core)}
        - Architecture: ${safeJoin(formattedContent?.architecture)}
        
        The instructions.md should include:
        1. Project setup instructions
        2. Development workflow
        3. Key processes for working with the system
        4. Tips for common tasks
        
        Format the document in Markdown.
      `;
      const instructions = await this.provider.generate(instructionsPrompt);

      // Generate memory index document
      const memoryIndexPrompt = `
        You are a technical documentation specialist for AI agents.
        
        Generate a memory/index.md document for a project with the following details:
        
        Project Prompt: ${this.initialPrompt}
        Tech Stack: ${JSON.stringify(formattedTechStack || {}, null, 2)}
        
        This document should explain how the memory system works for LLM agents working with this project.
        Include:
        1. Memory system overview
        2. How memory is structured
        3. Key memory files and their purposes
        4. How to use memory effectively with the project
        
        Format the document in Markdown.
      `;
      const memoryIndex = await this.provider.generate(memoryIndexPrompt);

      // Generate memory bank document
      const memoryBankPrompt = `
        You are a technical documentation specialist for AI agents.
        
        Generate a memory/bank_1.md document for a project with the following details:
        
        Project Prompt: ${this.initialPrompt}
        Tech Stack: ${JSON.stringify(formattedTechStack || {}, null, 2)}
        
        This document should:
        1. Provide initial memory/context for LLM agents working with this project
        2. Include key information about the project structure and architecture
        3. Include helpful tips and guidance for AI agents
        4. Be structured in a way that's easily parseable by AI systems
        
        Format the document in Markdown.
      `;
      const memoryBank = await this.provider.generate(memoryBankPrompt);

      // Generate role prompts
      const architectPrompt = `
        You are a technical documentation specialist for AI agents.
        
        Generate a prompts/roles/architect.md document for a project with:
        
        Project Prompt: ${this.initialPrompt}
        Tech Stack: ${JSON.stringify(formattedTechStack || {}, null, 2)}
        
        This document should provide a system prompt for an AI agent taking on an architect role for this project.
        Include:
        1. Role description and responsibilities
        2. Key architectural considerations for this specific project
        3. Questions the architect should answer
        4. Guidance on architectural decisions
        
        Format the document in Markdown with clear sections.
      `;
      const promptArchitect = await this.provider.generate(architectPrompt);
      
      const developerPrompt = `
        You are a technical documentation specialist for AI agents.
        
        Generate a prompts/roles/developer.md document for a project with:
        
        Project Prompt: ${this.initialPrompt}
        Tech Stack: ${JSON.stringify(formattedTechStack || {}, null, 2)}
        
        This document should provide a system prompt for an AI agent taking on a developer role for this project.
        Include:
        1. Role description and coding responsibilities
        2. Implementation guidance specific to this project
        3. Code standards and best practices
        4. Testing approaches
        
        Format the document in Markdown with clear sections.
      `;
      const promptDeveloper = await this.provider.generate(developerPrompt);
      
      const designerPrompt = `
        You are a technical documentation specialist for AI agents.
        
        Generate a prompts/roles/designer.md document for a project with:
        
        Project Prompt: ${this.initialPrompt}
        Tech Stack: ${JSON.stringify(formattedTechStack || {}, null, 2)}
        
        This document should provide a system prompt for an AI agent taking on a designer role for this project.
        Include:
        1. Role description and design responsibilities
        2. UI/UX considerations specific to this project
        3. Design principles and guidelines
        4. Asset creation guidance
        
        Format the document in Markdown with clear sections.
      `;
      const promptDesigner = await this.provider.generate(designerPrompt);
      
      const enterprisePrompt = `
        You are a technical documentation specialist for AI agents.
        
        Generate a prompts/roles/enterprise.md document for a project with:
        
        Project Prompt: ${this.initialPrompt}
        Tech Stack: ${JSON.stringify(formattedTechStack || {}, null, 2)}
        
        This document should provide a system prompt for an AI agent taking on a business/enterprise role for this project.
        Include:
        1. Role description and strategic responsibilities
        2. Market considerations for this specific project
        3. Business model guidance
        4. Growth strategies
        
        Format the document in Markdown with clear sections.
      `;
      const promptEnterprise = await this.provider.generate(enterprisePrompt);
      
      // Generate architecture sample
      const architectureSamplePrompt = `
        You are a technical documentation specialist.
        
        Generate a detailed architecture/sample-feature.md document for a project with:
        
        Project Prompt: ${this.initialPrompt}
        Tech Stack: ${JSON.stringify(formattedTechStack || {}, null, 2)}
        
        This document should provide a sample architecture document for one key feature of the project.
        Include:
        1. Feature overview and purpose
        2. Detailed architecture diagram (described in text)
        3. Component breakdown
        4. Data flow
        5. API specifications
        6. Sequence diagrams (described in text)
        
        Format the document in Markdown with clear sections.
      `;
      const architectureSample = await this.provider.generate(architectureSamplePrompt);
      
      // Generate deployment guide
      const deploymentPrompt = `
        You are a technical documentation specialist.
        
        Generate a comprehensive deployment.md for a project with:
        
        Project Prompt: ${this.initialPrompt}
        Tech Stack: ${JSON.stringify(formattedTechStack || {}, null, 2)}
        
        This document should include:
        1. Prerequisites and environment setup
        2. Step-by-step deployment instructions
        3. Configuration details
        4. Common deployment issues and solutions
        5. Monitoring and maintenance guidance
        
        Format the document in Markdown with clear sections.
      `;
      const deployment = await this.provider.generate(deploymentPrompt);
      
      // Assemble all documents
      return {
        index: docs.index || '',
        design: docs.design || '',
        code: docs.code || '',
        init: initMd,
        tech: techMd,
        instructions,
        memoryIndex,
        memoryBank,
        promptArchitect,
        promptDeveloper,
        promptDesigner,
        promptEnterprise,
        architectureSample,
        deployment
      };
    } catch (error) {
      logError(`Error generating project documentation: ${error}`, { tag: 'PROJECT_GEN' });
      
      // Return minimal documentation on error
      return {
        index: '# Project Documentation\n\n> Error generating complete documentation.',
        design: '# Design Documentation\n\n> Error generating design documentation.',
        code: '# Code Documentation\n\n> Error generating code documentation.',
        init: '# Init Documentation\n\n> Error generating init documentation.',
        tech: '# Technology Documentation\n\n> Error generating tech documentation.',
        instructions: '# Instructions\n\n> Error generating instructions.',
        memoryIndex: '# Memory Index\n\n> Error generating memory index.',
        memoryBank: '# Memory Bank\n\n> Error generating memory bank.',
        promptArchitect: '# Architect Prompt\n\n> Error generating architect prompt.',
        promptDeveloper: '# Developer Prompt\n\n> Error generating developer prompt.',
        promptDesigner: '# Designer Prompt\n\n> Error generating designer prompt.',
        promptEnterprise: '# Enterprise Prompt\n\n> Error generating enterprise prompt.',
        architectureSample: '# Architecture Sample\n\n> Error generating architecture sample.',
        deployment: '# Deployment Guide\n\n> Error generating deployment guide.'
      };
    }
  }
  
  /**
   * Enhance tech documentation with individual tech files
   */
  async enrichTechDocumentation(
    techStack: any, 
    researchContext: string, 
    researchLinks: string[]
  ): Promise<TechDocumentation> {
    try {
      logInfo('Enriching tech documentation...', { tag: 'PROJECT_GEN' });
      
      // Format the tech stack
      const formattedTechStack = formatTechStack(techStack);
      
      // Generate tech documentation with formatted tech stack
      const techMd = await generateTechDocs(this.provider, formattedTechStack, researchLinks);
      
      return {
        index: techMd,
        files: {}
      };
    } catch (error) {
      logError(`Error enriching tech documentation: ${error}`, { tag: 'PROJECT_GEN' });
      
      // Return minimal tech documentation on error
      return {
        index: '# Technology Documentation\n\n> Error generating tech documentation.',
        files: {}
      };
    }
  }
  
  /**
   * Generate a tech file for a specific technology
   */
  async generateTechMdFile(
    techName: string, 
    docUrl: string, 
    researchContext: string
  ): Promise<string> {
    try {
      logInfo(`Generating tech documentation for ${techName}...`, { tag: 'PROJECT_GEN' });
      
      // Use r.jina.ai to fetch documentation if URL is provided
      let techContent = '';
      if (docUrl) {
        try {
          const jinaUrl = `https://r.jina.ai/${encodeURIComponent(docUrl)}`;
          const response = await fetch(jinaUrl);
          if (response.ok) {
            techContent = await response.text();
          }
        } catch (error) {
          logError(`Error fetching tech documentation: ${error}`, { tag: 'PROJECT_GEN' });
        }
      }
      
      // Generate documentation with LLM
      const prompt = `
        You are a technical documentation specialist.
        
        Generate a comprehensive markdown document about ${techName} technology.
        
        ${techContent ? `Here is some reference documentation about ${techName}:
        ${techContent.substring(0, 2000)}...` : ''}
        
        ${researchContext ? `Additional context about the project:
        ${researchContext}` : ''}
        
        The document should include:
        1. Overview of ${techName}
        2. Key features and benefits
        3. How to use ${techName} in a project
        4. Best practices
        5. Resources and links
        
        Format the document in Markdown with appropriate headings and code blocks.
      `;
      
      return await this.provider.generate(prompt);
    } catch (error) {
      logError(`Error generating tech file for ${techName}: ${error}`, { tag: 'PROJECT_GEN' });
      throw error;
    }
  }
  
  /**
   * Generate a project name based on the concept
   */
  async generateProjectName(concept: string): Promise<string> {
    try {
      logInfo('Generating project name...', { tag: 'PROJECT_GEN' });
      
      const { generateProjectName } = await import('./content');
      const name = await generateProjectName(concept, this.provider);
      this.projectName = name;
      return name;
    } catch (error) {
      logError(`Error generating project name: ${error}`, { tag: 'PROJECT_GEN' });
      throw error;
    }
  }
} 