import { LLMProvider } from '../types';
import { generateProjectSearchPlanPrompt } from '../prompts/project-generation';
import { logInfo, logError } from '@/lib/llm/logger';
import axios from 'axios';

/**
 * Context gathering result
 */
export interface ContextResult {
  context: string;
  links: string[];
}

/**
 * Result of fetching documents from search queries
 */
interface FetchDocumentsResult {
  documents: string[];
  links: string[];
}

/**
 * Search with Sonar Reasoning to get comprehensive search results
 */
async function searchWithSonarReasoning(query: string): Promise<string> {
  console.log(`[SEARCH] Searching with Sonar Reasoning: ${query.substring(0, 100)}...`);
  
  try {
    // Get the OpenRouter API key
    const openrouterApiKey = process.env.OPENROUTER_API_KEY;
    
    if (!openrouterApiKey) {
      console.warn('[SEARCH] No OpenRouter API key found for Sonar search');
      return '';
    }
    
    // Call the OpenRouter API with the Sonar model
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'perplexity/sonar-small-online',
        messages: [
          {
            role: 'user',
            content: query
          }
        ],
        max_tokens: 4096,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openrouterApiKey}`,
          'HTTP-Referer': 'https://luke.nittmann.com'
        }
      }
    );
    
    if (response.data && 
        response.data.choices && 
        response.data.choices[0] && 
        response.data.choices[0].message && 
        response.data.choices[0].message.content) {
      
      const content = response.data.choices[0].message.content;
      console.log(`[SEARCH] Sonar Reasoning search completed successfully for "${query.substring(0, 30)}..."`);
      return content;
    }
    
    console.error('[SEARCH] Invalid response format from Sonar Reasoning');
    return '';
  } catch (error) {
    console.error(`[SEARCH] Error executing Sonar Reasoning search: ${error}`);
    return '';
  }
}

/**
 * Gathers research context for a project based on its prompt and tech stack
 */
export async function gatherProjectContext(
  prompt: string,
  techStackType: string,
  techStack: any
): Promise<ContextResult> {
  console.log(`[CONTEXT] Starting context gathering for ${techStackType} project with prompt length: ${prompt.length}`);
  
  try {
    // Create search queries based on the project prompt and tech stack
    const searchPlan = await generateSearchPlan(prompt, techStackType);
    console.log(`[CONTEXT] Generated search plan with ${searchPlan.length} queries: ${JSON.stringify(searchPlan)}`);
    
    // Fetch documents based on search queries
    const { documents, links } = await fetchProjectDocuments(searchPlan);
    console.log(`[CONTEXT] Fetched ${documents.length} documents and ${links.length} links`);
    
    const contextLength = documents.join('\n\n').length;
    console.log(`[CONTEXT] Generated total context of ${contextLength} chars`);
    
    return {
      context: documents.join('\n\n'),
      links
    };
  } catch (error) {
    logError(`Error gathering project context: ${error}`, { tag: 'CONTEXT', data: error });
    console.error(`[CONTEXT] Error gathering project context: ${error}`);
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
  console.log(`[SEARCH-PLAN] Starting search plan generation for ${techStackType}`);
  const startTime = Date.now();
  
  try {
    // Use the provider to generate a search plan
    const provider = createServerApiProvider();
    
    const searchPlanPrompt = generateProjectSearchPlanPrompt(
      prompt,
      techStackType
    );
    
    console.log(`[SEARCH-PLAN] Calling LLM with prompt of ${searchPlanPrompt.length} chars`);
    
    const searchPlan = await provider.generateStructured<string[]>(searchPlanPrompt, {
      model: 'anthropic/claude-3.7-sonnet',
      temperature: 0.7,
    });
    
    const processingTime = Date.now() - startTime;
    
    if (Array.isArray(searchPlan)) {
      console.log(`[SEARCH-PLAN] Successfully generated ${searchPlan.length} search queries in ${processingTime}ms`);
      console.log(`[SEARCH-PLAN] Queries: ${JSON.stringify(searchPlan)}`);
      return searchPlan;
    } else {
      console.error(`[SEARCH-PLAN] Received invalid response format, expected array but got: ${typeof searchPlan}`);
      return [];
    }
  } catch (error) {
    logError(`Error generating search plan`, { tag: 'CONTEXT', data: error });
    console.error(`[SEARCH-PLAN] Error generating search plan (${Date.now() - startTime}ms): ${error}`);
    
    // Fallback to basic search queries
    const fallbackQueries = [
      `best practices for ${techStackType} applications`,
      `${prompt.substring(0, 50)} implementation tutorial`,
      `${techStackType} architecture patterns`
    ];
    
    console.log(`[SEARCH-PLAN] Using fallback queries: ${JSON.stringify(fallbackQueries)}`);
    return fallbackQueries;
  }
}

/**
 * Fetches project documents based on search queries
 */
async function fetchProjectDocuments(
  searchQueries: string[]
): Promise<FetchDocumentsResult> {
  console.log(`[FETCH-DOCS] Starting document fetch for ${searchQueries.length} queries`);
  const startTime = Date.now();
  
  const documents: string[] = [];
  const links: string[] = [];
  
  try {
    // Process each search query
    for (let i = 0; i < searchQueries.length; i++) {
      const query = searchQueries[i];
      console.log(`[FETCH-DOCS] Processing query ${i+1}/${searchQueries.length}: "${query.substring(0, 80)}..."`);
      
      try {
        // Use r.jina.ai to fetch search results
        const searchResults = await searchWithSonarReasoning(query);
        if (searchResults) {
          documents.push(searchResults);
          console.log(`[FETCH-DOCS] Added search results for query ${i+1} (${searchResults.length} chars)`);
        }
      } catch (queryError) {
        console.error(`[FETCH-DOCS] Error processing query ${i+1}: ${queryError}`);
      }
    }
    
    const totalTime = Date.now() - startTime;
    console.log(`[FETCH-DOCS] Completed document fetch in ${totalTime}ms, ${documents.length}/${searchQueries.length} successful`);
    
    return {
      documents,
      links
    };
  } catch (error) {
    logError(`Error fetching project documents`, { tag: 'CONTEXT', data: error });
    console.error(`[FETCH-DOCS] Error fetching project documents: ${error}`);
    return {
      documents,
      links
    };
  }
}

// Import missing function
function createServerApiProvider(): LLMProvider {
  try {
    const { createServerApiProvider } = require('../providers');
    return createServerApiProvider();
  } catch (error) {
    logError('Error creating server API provider:', { tag: 'CONTEXT', data: error });
    throw new Error('Failed to create LLM provider');
  }
}