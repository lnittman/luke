import { ProjectGenerationResponse, TechStackOption } from '../interfaces';

/**
 * Generates a project based on user input
 * Makes a call to the /api/projects/generate endpoint
 */
export const generateProject = async (
  prompt: string,
  projectName: string,
  techStack: TechStackOption
): Promise<ProjectGenerationResponse> => {
  try {
    const response = await fetch('/api/projects/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        projectName,
        selectedTechStackType: techStack
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error generating project:', error);
    throw error;
  }
};

/**
 * Generates a random app idea
 * Makes a call to the /api/ideas/random endpoint
 */
export const generateRandomIdea = async (
  techStack: TechStackOption
): Promise<{
  idea: string;
  discoveredTechs: Array<{name: string; documentationUrl: string}>;
}> => {
  try {
    const response = await fetch('/api/ideas/random', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ techStack }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error generating random idea:', error);
    throw error;
  }
};

/**
 * Utility function to retry failed API calls
 */
export const fetchWithRetry = async <T>(
  fetchFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fetchFn();
    } catch (error) {
      console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
      lastError = error as Error;
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 1.5; // Exponential backoff
    }
  }
  
  throw lastError || new Error('Unknown error during retry');
}; 