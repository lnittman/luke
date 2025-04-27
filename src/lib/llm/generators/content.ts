import { ProjectContent, TechStack, LLMProvider } from '../types';
import { logInfo, logWarn, logError } from '../logger';

/**
 * Generate project content based on a prompt and tech stack
 */
export async function generateProjectContent(
  prompt: string, 
  techStack: TechStack, 
  provider: LLMProvider
): Promise<ProjectContent> {
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
    logInfo('Generating project content...', { tag: 'CONTENT' });
    const response = await provider.generateStructured<ProjectContent>(fullPrompt, {
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
    logError(`Error generating project content: ${error}`, { tag: 'CONTENT' });
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
 * Generate a project name based on the concept
 */
export async function generateProjectName(
  concept: string,
  provider: LLMProvider
): Promise<string> {
  logInfo("Generating project name...", { tag: 'CONTENT' });
  
  const namePrompt = `
    Generate a single-word, short and cute project name (maximum 2-3 syllables) for this concept:
    "${concept}"
    
    The name should be memorable, easy to pronounce, and reflect the essence of the project.
    It should follow the pattern of existing project names like: squish, top, voet, sine, helios, ther, loops, jobs.
    
    Return ONLY the name, nothing else - no quotes, no explanation, just the single word.
  `;
  
  try {
    const nameResponse = await provider.generate(namePrompt, {
      temperature: 0.9, // Higher temperature for creativity
      maxTokens: 50 // Short response needed
    });
    
    // Clean up the response to ensure it's a single word
    const cleanedName = nameResponse.trim().toLowerCase().split(/\s+/)[0];
    logInfo(`Generated project name: ${cleanedName}`, { tag: 'CONTENT' });
    
    return cleanedName;
  } catch (error) {
    logError(`Error generating project name: ${error}`, { tag: 'CONTENT' });
    // Fallback to a simple name based on concept
    const fallbackName = concept.toLowerCase().split(/\s+/)[0].replace(/[^a-z0-9]/g, '');
    const shortName = fallbackName.substring(0, 10); // Limit length
    return shortName;
  }
} 