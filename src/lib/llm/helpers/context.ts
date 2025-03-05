import { LLMProvider } from '../types';
import { generateProjectSearchPlanPrompt } from '../prompts/project-generation';
import { fetchMultipleTechDocs } from '@/lib/jina';
import { createServerApiProvider } from '../providers';

/**
 * Context gathering result
 */
export interface ContextResult {
  context: string;
  links: string[];
}

/**
 * Result of fetching documents
 */
interface FetchDocumentsResult {
  documents: string[];
  links: string[];
}

/**
 * Interface for the fetchMultipleTechDocs response
 */
interface TechDocsResponse {
  documents?: string[];
  links?: string[];
  [key: string]: any;
}

/**
 * Gathers research context for a project based on its prompt and tech stack
 */
export async function gatherProjectContext(
  prompt: string,
  techStackType: string,
  techStack: any
): Promise<ContextResult> {
  try {
    // Create search queries based on the project prompt and tech stack
    const searchPlan = await generateSearchPlan(prompt, techStackType);
    
    // Fetch documents based on search queries
    const { documents, links } = await fetchProjectDocuments(searchPlan);
    
    return {
      context: documents.join('\n\n'),
      links
    };
  } catch (error) {
    console.error('Error gathering project context:', error);
    return {
      context: '',
      links: []
    };
  }
}

/**
 * Generates a search plan for gathering project context
 */
async function generateSearchPlan(
  prompt: string,
  techStackType: string
): Promise<string[]> {
  try {
    // Use the provider to generate a search plan
    const provider = createServerApiProvider();
    
    const searchPlanPrompt = generateProjectSearchPlanPrompt(
      prompt,
      techStackType
    );
    
    const searchPlan = await provider.generateStructured<string[]>(searchPlanPrompt, {
      model: 'anthropic/claude-3.7-sonnet',
      temperature: 0.7,
    });
    
    return searchPlan;
  } catch (error) {
    console.error('Error generating search plan:', error);
    
    // Fallback to basic search queries
    return [
      `best practices for ${techStackType} applications`,
      `${prompt} implementation tutorial`,
      `${techStackType} architecture patterns`
    ];
  }
}

/**
 * Fetches project documents based on search queries
 */
async function fetchProjectDocuments(
  searchQueries: string[]
): Promise<FetchDocumentsResult> {
  try {
    // Convert string queries to the format expected by fetchMultipleTechDocs
    const formattedQueries = searchQueries.map(query => ({ name: query }));
    
    // Use the fetchMultipleTechDocs function to get documents and links
    const results = await fetchMultipleTechDocs(formattedQueries) as TechDocsResponse;
    
    if (typeof results !== 'object' || results === null) {
      // Handle case where results is not an object
      return {
        documents: [],
        links: []
      };
    }
    
    return {
      documents: Array.isArray(results.documents) ? results.documents : [],
      links: Array.isArray(results.links) ? results.links : []
    };
  } catch (error) {
    console.error('Error fetching project documents:', error);
    return {
      documents: [],
      links: []
    };
  }
} 