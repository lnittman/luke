import { LLMProvider } from '../types/models';
import { logInfo, logError, logWarn, logLLMRequest, logLLMResponse } from '../../logger';
import { TechStack } from '../types/project';
import { formatTechStack, safeGet } from '../helpers/safe-operations';

/**
 * Generate tech documentation
 */
export async function generateTechDocs(
  provider: LLMProvider,
  techStack: TechStack,
  urls: string[] = []
): Promise<string> {
  try {
    logInfo('Generating tech docs...', { tag: 'TECH_DOCS' });

    // Safely access framework properties
    const frameworks = techStack?.frameworks || [];
    
    // Generate URLs for each tech stack item if not provided
    let techUrls = urls.length > 0 ? urls : generateDefaultTechUrls(techStack);
    
    // Fallback in case there are no URLs or tech items
    if (techUrls.length === 0) {
      logWarn('No tech URLs found, generating basic tech documentation', { tag: 'TECH_DOCS' });
      return generateBasicTechMarkdown(provider, techStack);
    }

    // Fetch content from each URL
    const techContents: string[] = [];
    
    for (const url of techUrls) {
      try {
        if (!url) continue;
        
        const content = await fetchContentFromJina(url);
        if (content) {
          techContents.push(content);
        }
      } catch (error) {
        logError(`Error fetching tech content from ${url}: ${error}`, { tag: 'TECH_DOCS' });
        // Continue with other URLs
      }
    }

    // If we couldn't fetch any valid content, fall back to generating basic documentation
    if (techContents.length === 0) {
      logWarn('No tech content was fetched, generating basic tech documentation', { tag: 'TECH_DOCS' });
      return generateBasicTechMarkdown(provider, techStack);
    }

    // Generate tech markdown
    return await generateTechMarkdown(provider, techStack, techContents);
  } catch (error) {
    logError(`Error generating tech docs: ${error}`, { tag: 'TECH_DOCS' });
    // Provide a more substantial fallback
    return generateFallbackTechDocs(techStack);
  }
}

/**
 * Generate URLs for tech stack items
 */
function generateDefaultTechUrls(techStack: TechStack): string[] {
  try {
    const urls: string[] = [];

    // Handle potential undefined properties safely
    const frameworks = techStack?.frameworks || [];
    const libraries = techStack?.libraries || [];
    const docLinks = techStack?.documentationLinks || {};
    
    // Add URLs from documentation links
    Object.values(docLinks).forEach(url => {
      if (url && typeof url === 'string' && !urls.includes(url)) {
        urls.push(url);
      }
    });

    // Add default documentation URLs for frameworks
    frameworks.forEach(framework => {
      if (!framework) return;
      
      // Try to get URL from documentationLinks
      const frameworkUrl = docLinks[framework];
      
      if (frameworkUrl && !urls.includes(frameworkUrl)) {
        urls.push(frameworkUrl);
      } else {
        // Generate a default URL
        const defaultUrl = getDefaultDocUrl(framework);
        if (defaultUrl && !urls.includes(defaultUrl)) {
          urls.push(defaultUrl);
        }
      }
    });

    // Add default URLs for libraries (limited to avoid too many requests)
    const topLibraries = libraries.slice(0, 3);
    topLibraries.forEach(library => {
      if (!library) return;
      
      // Try to get URL from documentationLinks
      const libraryUrl = docLinks[library];
      
      if (libraryUrl && !urls.includes(libraryUrl)) {
        urls.push(libraryUrl);
      } else {
        // Generate a default URL
        const defaultUrl = getDefaultDocUrl(library);
        if (defaultUrl && !urls.includes(defaultUrl)) {
          urls.push(defaultUrl);
        }
      }
    });

    return urls;
  } catch (error) {
    logError(`Error generating default tech URLs: ${error}`, { tag: 'TECH_DOCS' });
    return [];
  }
}

/**
 * Get default documentation URL for common tech
 */
function getDefaultDocUrl(tech: string): string {
  if (!tech) return '';
  
  try {
    const lowerTech = tech.toLowerCase();
    
    // Common mapping of tech to documentation URLs
    const docMap: Record<string, string> = {
      'next.js': 'https://nextjs.org/docs',
      'react': 'https://react.dev',
      'tailwind css': 'https://tailwindcss.com/docs',
      'tailwind': 'https://tailwindcss.com/docs',
      'vercel ai sdk': 'https://sdk.vercel.ai/docs',
      'zustand': 'https://github.com/pmndrs/zustand',
      'jotai': 'https://jotai.org/docs/introduction',
      'react query': 'https://tanstack.com/query/latest',
      'framer motion': 'https://www.framer.com/motion',
      'framer-motion': 'https://www.framer.com/motion',
      'pixijs': 'https://pixijs.com/guides',
      'typescript': 'https://www.typescriptlang.org/docs/',
      'prisma': 'https://www.prisma.io/docs',
      'shadcn': 'https://ui.shadcn.com/docs',
      'mastra': 'https://mastra.ai/docs',
      'priompt': 'https://github.com/anysphere/priompt',
    };
    
    return docMap[lowerTech] || '';
  } catch (error) {
    logError(`Error in getDefaultDocUrl for ${tech}: ${error}`, { tag: 'TECH_DOCS' });
    return '';
  }
}

/**
 * Fetch content from URL using r.jina.ai
 */
async function fetchContentFromJina(url: string): Promise<string> {
  if (!url) {
    logWarn('Empty URL passed to fetchContentFromJina', { tag: 'TECH_DOCS' });
    return '';
  }
  
  try {
    logInfo(`Fetching content from ${url}`, { tag: 'TECH_DOCS' });
    
    // Use r.jina.ai to fetch content
    const jinaUrl = `https://r.jina.ai/${encodeURIComponent(url)}`;
    const response = await fetch(jinaUrl);
    
    if (!response.ok) {
      throw new Error(`Error fetching from r.jina.ai: ${response.status}`);
    }
    
    const text = await response.text();
    return text;
  } catch (error) {
    logError(`Error fetching from r.jina.ai: ${error}`, { tag: 'TECH_DOCS' });
    return '';
  }
}

/**
 * Generate tech markdown with LLM from tech content
 */
async function generateTechMarkdown(
  provider: LLMProvider,
  techStack: TechStack,
  techContents: string[]
): Promise<string> {
  try {
    // Keep only first 2000 chars of each content to avoid token limits
    const truncatedContents = techContents.map(content => 
      content.length > 2000 ? content.substring(0, 2000) + '...' : content
    );
    
    // Safe stringify of techStack
    let techStackStr = '{}';
    try {
      techStackStr = JSON.stringify(techStack || {}, null, 2);
    } catch (e) {
      logError(`Error stringifying techStack: ${e}`, { tag: 'TECH_DOCS' });
    }
    
    const prompt = `
      You are a technical documentation specialist.
      
      Generate a comprehensive tech.md document for a project with the following technology stack:
      ${techStackStr}
      
      Here is some reference documentation about these technologies:
      ${truncatedContents.join('\n\n---\n\n')}
      
      The tech.md should include:
      1. Overview of the technology stack
      2. Key components and their purposes
      3. How the technologies work together
      4. Best practices for implementation
      5. Useful resources and links
      
      Format the document in Markdown with appropriate headings and code blocks.
      Limit the document to a reasonable length while still covering all important aspects.
    `;
    
    // Log that we're about to make an LLM request for tech docs
    logInfo('Generating tech docs with content from URLs', { tag: 'TECH_DOCS' });
    logLLMRequest(prompt, { tag: 'TECH_DOCS_LLM' });
    
    const result = await provider.generate(prompt);
    logLLMResponse(result, { tag: 'TECH_DOCS_LLM' });
    
    return result;
  } catch (error) {
    logError(`Error in generateTechMarkdown: ${error}`, { tag: 'TECH_DOCS' });
    return '# Technology Documentation\n\n> Error generating complete technology documentation.';
  }
}

/**
 * Generate basic tech markdown without external content
 */
async function generateBasicTechMarkdown(
  provider: LLMProvider,
  techStack: TechStack
): Promise<string> {
  try {
    // Safe stringify of techStack
    let techStackStr = '{}';
    try {
      techStackStr = JSON.stringify(techStack || {}, null, 2);
    } catch (e) {
      logError(`Error stringifying techStack: ${e}`, { tag: 'TECH_DOCS' });
    }
    
    const prompt = `
      You are a technical documentation specialist.
      
      Generate a comprehensive tech.md document for a project with the following technology stack:
      ${techStackStr}
      
      The tech.md should include:
      1. Overview of the technology stack
      2. Key components and their purposes
      3. How the technologies work together
      4. Best practices for implementation
      5. Useful resources and links
      
      Format the document in Markdown with appropriate headings and code blocks.
      Use your knowledge to provide accurate and helpful information about each technology.
    `;
    
    // Log that we're about to make a basic LLM request for tech docs
    logInfo('Generating basic tech docs without URL content', { tag: 'TECH_DOCS' });
    logLLMRequest(prompt, { tag: 'TECH_DOCS_LLM' });
    
    const result = await provider.generate(prompt);
    logLLMResponse(result, { tag: 'TECH_DOCS_LLM' });
    
    return result;
  } catch (error) {
    logError(`Error in generateBasicTechMarkdown: ${error}`, { tag: 'TECH_DOCS' });
    return '# Technology Documentation\n\n> Error generating basic technology documentation.';
  }
}

/**
 * Generate a fallback tech documentation when everything else fails
 */
function generateFallbackTechDocs(techStack: TechStack): string {
  const frameworks = techStack?.frameworks || [];
  const libraries = techStack?.libraries || [];
  const apis = techStack?.apis || [];
  const tools = techStack?.tools || [];
  
  return `# Technology Stack Documentation

## Overview of the Technology Stack

${frameworks.length > 0 ? `\n### Frameworks\n\n${frameworks.map(f => `- ${f}`).join('\n')}` : ''}
${libraries.length > 0 ? `\n### Libraries\n\n${libraries.map(l => `- ${l}`).join('\n')}` : ''}
${apis.length > 0 ? `\n### APIs\n\n${apis.map(a => `- ${a}`).join('\n')}` : ''}
${tools.length > 0 ? `\n### Tools\n\n${tools.map(t => `- ${t}`).join('\n')}` : ''}

## Key Components and Their Purposes

When defining your technology stack, consider including the following components:

### Frameworks
Frameworks provide a structured foundation for your application, offering pre-built components and architectural patterns.

### Libraries
Libraries are collections of pre-written code that provide specific functionality without dictating application structure.

### APIs
APIs (Application Programming Interfaces) allow your application to interact with external services and data sources.

### Tools
Development, testing, and deployment tools that support your development workflow.

## How Technologies Work Together

When selecting technologies for your stack, consider:

1. **Compatibility**: Ensure all components can work together without conflicts
2. **Performance**: Evaluate how the combined technologies affect application performance
3. **Maintainability**: Consider long-term support and community activity for each technology
4. **Learning Curve**: Balance using cutting-edge technologies with team expertise

## Best Practices for Implementation

### Technology Selection
- Choose technologies based on project requirements, not trends
- Consider team expertise when selecting technologies
- Evaluate the maturity and community support of each technology
- Assess licensing implications

### Documentation
- Document why specific technologies were chosen
- Maintain up-to-date dependency information
- Document setup procedures for new team members
- Include links to official documentation

### Dependency Management
- Use a dependency management system
- Regularly update dependencies for security patches
- Lock dependency versions for production builds
- Consider the impact of transitive dependencies

### Security Considerations
- Review security implications of each technology
- Follow security best practices for each component
- Regularly update components to address security vulnerabilities

## Useful Resources and Links

When you select technologies for your project, include links to:

- Official documentation
- Getting started guides
- Community forums
- Tutorials and examples
- GitHub repositories
- Security advisories

---

**Note**: This document should be updated as technologies are added to or removed from your project stack.
`;
} 