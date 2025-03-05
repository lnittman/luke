import { LLMProvider } from '../types';
import { createServerApiProvider } from '../providers';
import { logInfo, logError, logWarn } from '../../logger';
import { 
  TechStack, 
  ProjectContent, 
  ProjectDocuments,
  TechDocumentation,
  ProjectGenerationResponse
} from '../types';
import { Project } from '@/utils/constants/projects';

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
      return generateTechStack(prompt, this.provider);
    } catch (error) {
      logError(`Error generating tech stack: ${error}`, { tag: 'PROJECT_GEN' });
      throw error;
    }
  }
  
  /**
   * Generate project content based on prompt and tech stack
   */
  async generateProjectContent(prompt: string, techStack: TechStack): Promise<ProjectContent> {
    try {
      logInfo('Generating project content...', { tag: 'PROJECT_GEN' });
      
      const { generateProjectContent } = await import('./content');
      return generateProjectContent(prompt, techStack, this.provider);
    } catch (error) {
      logError(`Error generating project content: ${error}`, { tag: 'PROJECT_GEN' });
      throw error;
    }
  }
  
  /**
   * Generate init.md document
   */
  async generateInitMd(): Promise<string> {
    try {
      logInfo('Generating init.md...', { tag: 'PROJECT_GEN' });
      
      const { generateInitMd } = await import('./documentation');
      return generateInitMd();
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
      
      const { generateProjectDocumentation } = await import('./documentation');
      return generateProjectDocumentation(techStack, projectContent, this.provider);
    } catch (error) {
      logError(`Error generating project documentation: ${error}`, { tag: 'PROJECT_GEN' });
      throw error;
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
      
      const { enrichTechDocumentation } = await import('./tech-docs');
      return enrichTechDocumentation(techStack, researchContext, researchLinks, this.provider);
    } catch (error) {
      logError(`Error enriching tech documentation: ${error}`, { tag: 'PROJECT_GEN' });
      throw error;
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
      
      const { generateTechMdFile } = await import('./tech-docs');
      return generateTechMdFile(techName, docUrl, researchContext, this.provider);
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