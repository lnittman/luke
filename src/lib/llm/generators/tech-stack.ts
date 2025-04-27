import { TechStack, LLMProvider } from '../types';
import { searchDocumentation } from '../jina';
import { logInfo, logWarn, logError } from '../logger';

/**
 * Generate a technology stack based on a project prompt
 */
export async function generateTechStack(
  prompt: string,
  provider: LLMProvider
): Promise<TechStack> {
  try {
    logInfo('Generating tech stack using Claude-3.7-sonnet...', { tag: 'TECH_STACK' });
    
    // Search for tech stack recommendations related to the project
    logInfo('Searching for tech stack recommendations...', { tag: 'TECH_STACK' });
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
      
      logInfo('Found tech stack context from search results', { tag: 'TECH_STACK' });
    } else {
      logInfo('No search results found for tech stack, using LLM knowledge only', { tag: 'TECH_STACK' });
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
    const techStackResponse = await provider.generateStructured<TechStack>(
      systemPrompt + '\n\n' + prompt,
      {
        model: 'anthropic/claude-3.7-sonnet', // Explicitly specify the model
        responseFormat: { type: "json_object" },
        temperature: 0.7
      }
    );
    
    return techStackResponse;
  } catch (error) {
    logError(`Error generating tech stack: ${error}`, { tag: 'TECH_STACK' });
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
 * Process tech items into a structured tech stack
 */
export function processTechItems(
  techItems: Array<string | { name: string; documentationUrl?: string }>
): TechStack {
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
      categorizeTech(techName, result);
      
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
        categorizeTech(techName, result);
        
        // Add documentation URL if it exists
        if ('documentationUrl' in item && typeof item.documentationUrl === 'string') {
          result.documentationLinks[techName] = item.documentationUrl;
        } else {
          // Add a generic documentation URL if none exists
          result.documentationLinks[techName] = 
            `https://www.google.com/search?q=${encodeURIComponent(techName)}+documentation`;
        }
      } else {
        logWarn(`Tech item at index ${i} has invalid format:`, { tag: 'TECH_STACK', data: item });
      }
    } else {
      logWarn(`Tech item at index ${i} has unexpected type:`, { tag: 'TECH_STACK', data: typeof item });
    }
  }
  
  return result;
}

/**
 * Categorize a technology name into the appropriate category
 * @param techName The technology name (lowercase)
 * @param techStack The tech stack to update
 */
export function categorizeTech(techName: string, techStack: TechStack): void {
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