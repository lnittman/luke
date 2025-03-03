import axios from 'axios';

// Add a cache for documentation to avoid repeated requests
interface DocumentCache {
  [url: string]: {
    timestamp: number;
    data: {
      title: string;
      content: string;
      description: string;
      images: Record<string, string>;
      links: Record<string, string>;
      metadata: any;
    }
  }
}

// Cache documentation results to avoid repeated API calls
// Use URLs as keys with a timestamp to allow for expiration
const documentCache: DocumentCache = {};

// Cache for search results
interface SearchCache {
  [query: string]: {
    timestamp: number;
    results: any[];
  }
}

const searchCache: SearchCache = {};

// Global tech documentation cache with key combining tech name and URL
interface TechDocCache {
  [key: string]: {
    timestamp: number;
    content: string;
  }
}

const techDocCache: TechDocCache = {};

// Cache expiration time (30 minutes)
const CACHE_EXPIRY = 30 * 60 * 1000;

/**
 * Get the Jina API key from environment variables
 * @returns The API key or null if not found
 */
function getJinaApiKey(): string | null {
  // Check for the API key in process.env first
  if (typeof process !== 'undefined' && process.env && process.env.JINA_API_KEY) {
    return process.env.JINA_API_KEY;
  }
  
  // For client-side or if not found in process.env, try window.__ENV__
  if (typeof window !== 'undefined' && (window as any).__ENV__ && (window as any).__ENV__.JINA_API_KEY) {
    return (window as any).__ENV__.JINA_API_KEY;
  }
  
  // Fallback to our demo key if needed
  return 'jina_bf18dc26a34f4b33aaad6cd76d7ca015ZVe--1PyRIqF96GzewEkPliq2puq';
}

const JINA_API_KEY = getJinaApiKey();

/**
 * Creates a Jina Reader client that can be used with or without an API key
 */
export const jinaFreeClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${JINA_API_KEY}`
  }
});

/**
 * Creates a Jina DeepSearch client with API key
 */
export const jinaDeepSearchClient = axios.create({
  baseURL: 'https://api.jina.ai/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${JINA_API_KEY}`
  }
});

// Add request/response logging for debugging
if (process.env.NODE_ENV === 'development') {
  jinaFreeClient.interceptors.request.use(request => {
    console.log(`JINA Request: ${request.method?.toUpperCase()} ${request.url}`);
    return request;
  });
  
  jinaFreeClient.interceptors.response.use(
    response => {
      console.log(`JINA Response: ${response.status} ${response.statusText}`);
      return response;
    },
    error => {
      console.error('JINA Error:', 
        error.response?.status,
        error.response?.data?.detail || error.message
      );
      return Promise.reject(error);
    }
  );
  
  jinaDeepSearchClient.interceptors.request.use(request => {
    console.log(`JINA DeepSearch Request: ${request.method?.toUpperCase()} ${request.url}`);
    return request;
  });
  
  jinaDeepSearchClient.interceptors.response.use(
    response => {
      console.log(`JINA DeepSearch Response: ${response.status} ${response.statusText}`);
      return response;
    },
    error => {
      console.error('JINA DeepSearch Error:', 
        error.response?.status,
        error.response?.data?.detail || error.message
      );
      return Promise.reject(error);
    }
  );
}

/**
 * Updates the Jina API key for the clients
 * @param apiKey The new API key to use
 */
export function updateJinaApiKey(apiKey: string): void {
  if (!apiKey) return;
  
  jinaDeepSearchClient.defaults.headers.common['Authorization'] = `Bearer ${apiKey}`;
  jinaFreeClient.defaults.headers.common['Authorization'] = `Bearer ${apiKey}`;
}

/**
 * Retry utility with exponential backoff - useful for handling rate limits
 */
export async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3, initialDelay = 500): Promise<T> {
  let retries = 0;
  
  while (true) {
    try {
      return await fn();
    } catch (error: any) {
      retries += 1;
      
      // If we've reached max retries or it's not a retryable error, throw
      if (retries >= maxRetries || 
          !(error.response && (error.response.status === 429 || error.response.status === 503))) {
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = initialDelay * Math.pow(2, retries - 1);
      console.log(`Rate limited. Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

/**
 * Check if a response indicates a payment/authorization issue
 */
function isPaymentError(error: any): boolean {
  return error.response && 
    (error.response.status === 402 || // Payment Required
     error.response.status === 403 || // Forbidden
     error.response.status === 401 || // Unauthorized
     (error.response.status === 400 && // Bad Request with payment-related message
      typeof error.response.data?.detail === 'string' && 
      (error.response.data.detail.includes('payment') || 
       error.response.data.detail.includes('subscription') ||
       error.response.data.detail.includes('credit'))));
}

/**
 * Read a webpage and extract its content using Jina r.reader API
 * @param url The URL to read
 * @returns Structured content with title, text content, and metadata
 */
export async function readDocumentation(url: string): Promise<{
  title: string;
  content: string;
  description: string;
  images: Record<string, string>;
  links: Record<string, string>;
  metadata: any;
}> {
  // Skip duplicate reads with aggressive caching
  const cacheKey = url.toLowerCase();
  const cachedDoc = documentCache[cacheKey];
  const now = Date.now();
  
  if (cachedDoc && (now - cachedDoc.timestamp < CACHE_EXPIRY)) {
    console.log(`Using cached documentation for: ${url}`);
    return cachedDoc.data;
  }
  
  return withRetry(async () => {
    console.log(`Reading documentation: ${url}`);
    
    const response = await jinaFreeClient.post('https://r.jina.ai/', {
      url,
      options: 'markdown'
    });
    
    const data = response.data;
    
    // Extract the useful parts from the response
    const result = {
      title: data.data?.title || '',
      content: data.data?.content || '',
      description: data.data?.description || '',
      images: data.data?.images || {},
      links: data.data?.links || {},
      metadata: {
        url,
        timestamp: new Date().toISOString(),
        status: data.code || 200
      }
    };
    
    // Store in cache
    documentCache[cacheKey] = {
      timestamp: now,
      data: result
    };
    
    return result;
  });
}

/**
 * Search for documentation using Jina API with proper fallbacks
 * @param query The query to search for
 * @returns Search results with content and metadata
 */
export async function searchDocumentation(query: string): Promise<any[]> {
  // Skip duplicate searches with aggressive caching
  const cacheKey = query.toLowerCase();
  const cachedSearch = searchCache[cacheKey];
  const now = Date.now();
  
  if (cachedSearch && (now - cachedSearch.timestamp < CACHE_EXPIRY)) {
    console.log(`Using cached search results for: ${query}`);
    return cachedSearch.results;
  }
  
  // First try the native Jina search endpoint (more reliable)
  try {
    return await withRetry(async () => {
      console.log(`Searching documentation: ${query}`);
      
      // Use the Jina search API format
      const response = await jinaFreeClient.post('https://s.jina.ai/', {
        q: query,
        options: 'markdown'
      });
      
      // Process results
      const results = response.data.data || [];
      
      // Store in cache
      searchCache[cacheKey] = {
        timestamp: now,
        results
      };
      
      return results;
    });
  } catch (error) {
    console.error(`Error searching with Jina search API: ${error}`);
    console.warn('Falling back to DeepSearch API...');
    
    // Fall back to DeepSearch API
    try {
      return await withRetry(async () => {
        console.log(`Searching with DeepSearch: ${query}`);
        
        // Use the DeepSearch API format
        const response = await jinaDeepSearchClient.post('/chat/completions', {
          model: "jina-deepsearch-v1",
          messages: [
            {
              role: "user",
              content: query
            }
          ],
          stream: false,
          reasoning_effort: "medium"
        });
        
        // Extract visited URLs and their content
        const visitedURLs = response.data.visitedURLs || [];
        const readURLs = response.data.readURLs || [];
        
        console.log(`DeepSearch found ${visitedURLs.length} URLs, read ${readURLs.length} URLs`);
        
        // Format the results to match the expected structure
        const results = readURLs.map((url: string) => {
          return {
            url,
            title: url.split('/').pop() || url,
            content: `Content from ${url}\n\n${response.data.choices[0].message.content}`
          };
        });
        
        // Store in cache
        searchCache[cacheKey] = {
          timestamp: now,
          results
        };
        
        return results;
      });
    } catch (deepSearchError) {
      // If we get a payment error, handle it gracefully
      if (isPaymentError(deepSearchError)) {
        console.warn('DeepSearch API requires payment, returning empty results.');
        
        // Cache empty results to avoid repeated failing calls
        searchCache[cacheKey] = {
          timestamp: now,
          results: []
        };
        
        return [];
      }
      
      console.error(`DeepSearch API failed: ${deepSearchError}`);
      
      // Return empty array for any other error
      return [];
    }
  }
}

/**
 * Fetch documentation for a specific technology to use as context
 * @param techName The name of the technology
 * @param docUrl The documentation URL (if available)
 * @returns Documentation content
 */
export async function fetchTechDocumentation(techName: string, docUrl?: string): Promise<string> {
  // Skip duplicate fetches with aggressive caching
  const cacheKey = `${techName.toLowerCase()}:${docUrl?.toLowerCase() || ''}`;
  const cachedDoc = techDocCache[cacheKey];
  const now = Date.now();
  
  if (cachedDoc && (now - cachedDoc.timestamp < CACHE_EXPIRY)) {
    console.log(`Using cached tech documentation for: ${techName}`);
    return cachedDoc.content;
  }
  
  try {
    let content = '';
    
    // If we have a documentation URL, try to read it directly
    if (docUrl && docUrl.startsWith('http')) {
      try {
        const docData = await readDocumentation(docUrl);
        if (docData.content) {
          // Return a cleaned and summarized version of the content
          const cleanedContent = docData.content
            .replace(/```[a-z]*\n[\s\S]*?\n```/g, '') // Remove code blocks
            .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
            .split('\n')
            .slice(0, 100) // Take first 100 lines max
            .join('\n');
          
          content = `## ${docData.title || techName} Documentation\n\n${cleanedContent.substring(0, 3000)}`;
        }
      } catch (error) {
        console.warn(`Error reading documentation for ${techName}, will fall back to search: ${error}`);
      }
    }
    
    // If direct reading failed or no URL, try search
    if (!content) {
      try {
        // Use search for more comprehensive results
        const searchQuery = `${techName} documentation guide tutorial best practices`;
        const searchResults = await searchDocumentation(searchQuery);
        
        if (searchResults && searchResults.length > 0) {
          const topResult = searchResults[0];
          content = `## ${techName} Documentation (via Search)\n\n${
            topResult.content.substring(0, 3000)
          }`;
        }
      } catch (error) {
        console.warn(`Error searching documentation for ${techName}: ${error}`);
      }
    }
    
    // If we still don't have content, fall back to a default message
    if (!content) {
      content = `# ${techName} Documentation\n\nBasic documentation for ${techName}. For detailed information, refer to the official documentation.`;
    }
    
    // Store in cache
    techDocCache[cacheKey] = {
      timestamp: now,
      content
    };
    
    return content;
  } catch (error) {
    console.error(`Error fetching documentation for ${techName}:`, error);
    const fallbackContent = `# ${techName} Documentation\n\nBasic documentation for ${techName}. For detailed information, refer to the official documentation.`;
    
    // Store fallback in cache
    techDocCache[cacheKey] = {
      timestamp: now,
      content: fallbackContent
    };
    
    return fallbackContent;
  }
}

/**
 * Fetch documentation for multiple technologies with optimized processing
 * @param technologies Array of technology names and their documentation URLs
 * @param maxParallel Maximum number of parallel requests (to avoid rate limits)
 * @returns Combined documentation content
 */
export async function fetchMultipleTechDocs(
  technologies: Array<{name: string, docUrl?: string}>, 
  maxParallel: number = 3
): Promise<string> {
  // Deduplicate technologies by name to avoid redundant fetches
  const uniqueTechs: Array<{name: string, docUrl?: string}> = [];
  const techNames = new Set<string>();
  
  for (const tech of technologies) {
    if (!techNames.has(tech.name.toLowerCase())) {
      uniqueTechs.push(tech);
      techNames.add(tech.name.toLowerCase());
    }
  }
  
  const results: string[] = [];
  
  // Process in batches to avoid overloading the API
  for (let i = 0; i < uniqueTechs.length; i += maxParallel) {
    const batch = uniqueTechs.slice(i, i + maxParallel);
    const batchResults = await Promise.all(
      batch.map(tech => fetchTechDocumentation(tech.name, tech.docUrl))
    );
    results.push(...batchResults);
    
    // Add a small delay between batches to be nice to the API
    if (i + maxParallel < uniqueTechs.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return results.join('\n\n');
} 