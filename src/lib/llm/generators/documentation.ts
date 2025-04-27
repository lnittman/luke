import { LLMProvider } from '../types/models';
import { logInfo, logError } from '../logger';
import { ProjectContent, TechStack } from '../types/project';
import { safeJoin, formatProjectContent } from '../helpers/safe-operations';

/**
 * Generate project documentation based on tech stack and content
 */
export async function generateDocumentation(
  provider: LLMProvider,
  techStack: TechStack, 
  projectContent: ProjectContent,
  prompt: string
): Promise<Record<string, string>> {
  logInfo('Generating project documentation...', { tag: 'DOCUMENTATION' });
  
  try {
    // Ensure projectContent has the expected structure
    const formattedContent = formatProjectContent(projectContent);
    
    // Generate index.md
    const indexMd = await generateIndexDocument(provider, techStack, formattedContent, prompt);
    
    // Generate design.md
    const designMd = await generateDesignDocument(provider, techStack, formattedContent, prompt);
    
    // Generate code.md
    const codeMd = await generateCodeDocument(provider, techStack, formattedContent, prompt);
    
    // Return all documentation
    return {
      index: indexMd,
      design: designMd,
      code: codeMd
    };
  } catch (error) {
    logError(`Error generating documentation: ${error}`, { tag: 'DOCUMENTATION' });
    throw error;
  }
}

/**
 * Generate index.md document for project
 */
async function generateIndexDocument(
  provider: LLMProvider,
  techStack: TechStack,
  projectContent: ProjectContent,
  prompt: string
): Promise<string> {
  logInfo('Generating index.md...', { tag: 'DOCUMENTATION' });
  
  const indexPrompt = `
    You are a technical documentation specialist.
    
    Generate a comprehensive index.md for a project with the following details:
    
    Project Prompt: ${prompt}
    
    Tech Stack: ${JSON.stringify(techStack || {}, null, 2)}
    
    Project Content:
    - Overview: ${safeJoin(projectContent?.overview)}
    - Core Features: ${safeJoin(projectContent?.core)}
    - Architecture: ${safeJoin(projectContent?.architecture)}
    
    The index.md should include:
    1. Project title and description
    2. Key features
    3. Technology overview
    4. Getting started section
    5. Project structure overview
    
    Format the document in Markdown.
  `;
  
  return await provider.generate(indexPrompt);
}

/**
 * Generate design.md document for project
 */
async function generateDesignDocument(
  provider: LLMProvider,
  techStack: TechStack,
  projectContent: ProjectContent,
  prompt: string
): Promise<string> {
  logInfo('Generating design.md...', { tag: 'DOCUMENTATION' });
  
  const designPrompt = `
    You are a technical documentation specialist with expertise in software architecture.
    
    Generate a comprehensive design.md for a project with the following details:
    
    Project Prompt: ${prompt}
    
    Tech Stack: ${JSON.stringify(techStack || {}, null, 2)}
    
    Project Content:
    - Overview: ${safeJoin(projectContent?.overview)}
    - Core Features: ${safeJoin(projectContent?.core)}
    - Architecture: ${safeJoin(projectContent?.architecture)}
    
    The design.md should include:
    1. Architecture overview
    2. Component design
    3. Data models
    4. API design (if applicable)
    5. UI/UX considerations
    
    Format the document in Markdown with appropriate headings, code blocks, and diagrams described in text.
  `;
  
  return await provider.generate(designPrompt);
}

/**
 * Generate code.md document for project
 */
async function generateCodeDocument(
  provider: LLMProvider,
  techStack: TechStack,
  projectContent: ProjectContent,
  prompt: string
): Promise<string> {
  logInfo('Generating code.md...', { tag: 'DOCUMENTATION' });
  
  const codePrompt = `
    You are a technical documentation specialist with expertise in software development.
    
    Generate a comprehensive code.md for a project with the following details:
    
    Project Prompt: ${prompt}
    
    Tech Stack: ${JSON.stringify(techStack || {}, null, 2)}
    
    Project Content:
    - Overview: ${safeJoin(projectContent?.overview)}
    - Core Features: ${safeJoin(projectContent?.core)}
    - Architecture: ${safeJoin(projectContent?.architecture)}
    
    The code.md should include:
    1. Code examples for key components
    2. Implementation guidelines
    3. Coding patterns and best practices
    4. Testing approach
    5. Deployment considerations
    
    Format the document in Markdown with appropriate headings and code blocks.
  `;
  
  return await provider.generate(codePrompt);
} 