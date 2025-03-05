# Implementation Plan for Project Generation Enhancements

## Priority 1: Enhanced Tech Documentation Structure

### 1. Convert `tech.md` to a `tech/` folder with `index.md`

**Implementation Steps:**
1. Modify `ProjectGenerator.generateProjectDocumentation()` to create a tech folder structure
2. Update the route handler to package this folder structure in the ZIP
3. Create separate markdown files for each technology in the tech stack

**Code Changes:**
```typescript
// In src/lib/llm/index.ts - ProjectGenerator class
async generateTechDocumentation(techStack: any, techItems: any[]): Promise<TechDocumentation> {
  // Generate the main tech/index.md (former tech.md)
  const techIndexMd = await this.generateTechIndexMd(techStack, techItems);
  
  // Generate individual tech markdown files
  const techFiles: Record<string, string> = {};
  for (const item of techItems) {
    const techName = typeof item === 'string' ? item : item.name;
    const techFile = await this.generateIndividualTechMd(techName, techStack);
    techFiles[`${techName.toLowerCase().replace(/\s+/g, '-')}.md`] = techFile;
  }
  
  return {
    index: techIndexMd,
    files: techFiles
  };
}
```

### 2. Implement r.jina.ai document fetching

**Implementation Steps:**
1. Enhance the Jina integration to extract full documentation
2. Store fetched documentation in the local filesystem
3. Use fetched documentation in the project generation process

**Code Changes:**
```typescript
// In src/lib/jina/index.ts
export async function fetchTechDocumentation(techName: string, docUrl: string): Promise<string> {
  // Create a cache key combining tech name and URL
  const cacheKey = `${techName}-${docUrl}`;
  
  // Check if we have this in cache already
  if (techDocCache[cacheKey] && 
      (Date.now() - techDocCache[cacheKey].timestamp) < CACHE_EXPIRY) {
    console.log(`[JINA] Using cached tech documentation for ${techName}`);
    return techDocCache[cacheKey].content;
  }
  
  try {
    console.log(`[JINA] Fetching tech documentation for ${techName} from ${docUrl}`);
    
    // Make the API request to r.jina.ai
    const response = await axios.post('https://r.jina.ai/api/v1/extract', {
      url: docUrl
    }, {
      headers: {
        'Authorization': `Bearer ${getJinaApiKey()}`,
        'Content-Type': 'application/json'
      }
    });
    
    // Extract the markdown content
    const markdown = response.data.markdown || '';
    
    // Store in cache
    techDocCache[cacheKey] = {
      timestamp: Date.now(),
      content: markdown
    };
    
    // Save to local filesystem
    await saveTechDocToFilesystem(techName, markdown);
    
    return markdown;
  } catch (error) {
    console.error(`[JINA] Error fetching tech documentation for ${techName}:`, error);
    return `# ${techName} Documentation\n\nDocumentation could not be fetched from ${docUrl}.`;
  }
}

async function saveTechDocToFilesystem(techName: string, content: string): Promise<void> {
  // Only run on server side
  if (typeof window !== 'undefined') return;
  
  const fs = require('fs');
  const path = require('path');
  
  try {
    // Create the docs/tech directory if it doesn't exist
    const techDir = path.join(process.cwd(), 'docs', 'tech');
    if (!fs.existsSync(techDir)) {
      fs.mkdirSync(techDir, { recursive: true });
    }
    
    // Sanitize the tech name for filesystem use
    const sanitizedName = techName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const filePath = path.join(techDir, `${sanitizedName}.md`);
    
    // Write the content to the file
    fs.writeFileSync(filePath, content);
    console.log(`[JINA] Saved tech documentation for ${techName} to ${filePath}`);
  } catch (error) {
    console.error(`[JINA] Error saving tech documentation to filesystem:`, error);
  }
}
```

## Priority 2: Improve Logging and Observability

### 1. Implement structured logging with [TAG] prefixes

**Implementation Steps:**
1. Create a centralized logging utility
2. Add consistent [TAG] prefixes for all log messages
3. Implement log levels for better filtering

**Code Changes:**
```typescript
// Create a new file: src/lib/logger.ts
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

export interface LogOptions {
  tag: string;
  level?: LogLevel;
  data?: any;
}

export function log(message: string, options: LogOptions): void {
  const { tag, level = LogLevel.INFO, data } = options;
  const timestamp = new Date().toISOString();
  const logPrefix = `[${timestamp}] [${level}] [${tag}]`;
  
  // Log the message with its prefix
  console.log(`${logPrefix} ${message}`);
  
  // If there's additional data, log it too (truncate if needed)
  if (data) {
    const dataString = typeof data === 'string' 
      ? data 
      : JSON.stringify(data, null, 2);
    
    // Truncate very large data
    const truncated = dataString.length > 2000
      ? `${dataString.substring(0, 2000)}... (truncated, full length: ${dataString.length})`
      : dataString;
    
    console.log(`${logPrefix} Data:`, truncated);
  }
}

// Example usage in route.ts
import { log, LogLevel } from '@/lib/logger';

// Before API call
log('Starting project generation process', { 
  tag: 'PROJECT_GEN',
  level: LogLevel.INFO,
  data: { prompt, techStack, projectName }
});
```

### 2. Log full API inputs/outputs

**Implementation Steps:**
1. Add comprehensive logging around all API calls
2. Create middleware for logging route handlers
3. Implement redaction for sensitive information

**Code Changes:**
```typescript
// In src/app/api/llm/route.ts
export async function POST(req: Request) {
  // Log the incoming request (redact sensitive data)
  const requestBody = await req.clone().json();
  log('LLM API request received', {
    tag: 'LLM_API',
    data: redactSensitiveData(requestBody)
  });
  
  try {
    const response = await processLlmRequest(requestBody);
    
    // Log the response (truncate for very large responses)
    log('LLM API response sent', {
      tag: 'LLM_API',
      data: {
        status: 200,
        responseLength: JSON.stringify(response).length,
        preview: JSON.stringify(response).substring(0, 500) + '...'
      }
    });
    
    return NextResponse.json(response);
  } catch (error) {
    // Log the error
    log('LLM API error', {
      tag: 'LLM_API',
      level: LogLevel.ERROR,
      data: {
        error: error.message,
        stack: error.stack
      }
    });
    
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

## Priority 3: Fix Identified Issues

### 1. Address Perplexity/Sonar URL path issue

**Implementation Steps:**
1. Fix the relative URL path in `enrichTechDocumentation`
2. Add proper error handling around the fetch call

**Code Changes:**
```typescript
// In src/app/api/projects/generate/route.ts
async function enrichTechDocumentation(projectContent: any, techStack: any): Promise<any[]> {
  try {
    console.log('[Perplexity] Searching for tech documentation...');
    
    // Extract tech items
    const techItems = projectContent.tech || [];
    if (!techItems || techItems.length === 0) {
      console.log('[Perplexity] No tech items to enrich');
      return [];
    }
    
    // Create a query for tech documentation
    const techNames = techItems.map((item: any) => 
      typeof item === 'string' ? item : item.name
    ).join(', ');
    
    const query = `Provide detailed documentation links and brief explanations for these technologies: ${techNames}`;
    console.log(`[Perplexity] Query: "${query.substring(0, 100)}..."`);
    
    // Fix: Use absolute URL instead of relative path
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    
    // Use our API route to make the Perplexity request to avoid token exposure
    const response = await fetch(`${baseUrl}/api/sonar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query })
    });
    
    if (!response.ok) {
      throw new Error(`Sonar API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('[Perplexity] Received tech documentation response');
    
    // Process and return the enriched documentation
    // ... existing processing code
  } catch (error) {
    console.error(`[Perplexity] Error enriching tech documentation:`, error);
    return [];
  }
}
```

### 2. Implement retry mechanisms for external API calls

**Implementation Steps:**
1. Create a utility for retrying failed API calls
2. Add exponential backoff for retries
3. Apply the retry mechanism to all external API calls

**Code Changes:**
```typescript
// Create a new file: src/lib/api-utils.ts
interface RetryOptions {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
}

export async function retryFetch(
  url: string, 
  options: RequestInit,
  retryOptions: RetryOptions = { maxRetries: 3, initialDelay: 1000, maxDelay: 10000 }
): Promise<Response> {
  const { maxRetries, initialDelay, maxDelay } = retryOptions;
  
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Log the retry attempt
      if (attempt > 0) {
        console.log(`[RETRY] Attempt ${attempt}/${maxRetries} for ${url}`);
      }
      
      const response = await fetch(url, options);
      
      // If the response is successful, return it
      if (response.ok) {
        return response;
      }
      
      // If we get here, the response was not successful
      const errorText = await response.text();
      lastError = new Error(`Fetch failed with status ${response.status}: ${errorText}`);
      
      // Don't retry if we've reached the max number of retries
      if (attempt >= maxRetries) {
        throw lastError;
      }
    } catch (error) {
      lastError = error;
      
      // Don't retry if we've reached the max number of retries
      if (attempt >= maxRetries) {
        throw error;
      }
    }
    
    // Calculate delay with exponential backoff and jitter
    const delay = Math.min(
      maxDelay,
      initialDelay * Math.pow(2, attempt) * (0.9 + Math.random() * 0.2)
    );
    
    console.log(`[RETRY] Waiting ${Math.round(delay)}ms before next attempt`);
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  // This should never happen, but TypeScript needs it
  throw lastError || new Error('Unknown error during retry');
}
```

## Timeline

1. **Phase 1: Core Tech Documentation Enhancements (1-2 days)**
   - Convert tech.md to tech folder with index.md
   - Implement initial Jina document fetching

2. **Phase 2: Logging and Observability (1 day)**
   - Create centralized logging utility
   - Implement structured logs with [TAG] prefixes

3. **Phase 3: Bug Fixes (0.5 day)**
   - Fix Perplexity/Sonar URL path issue
   - Implement retry mechanisms

4. **Phase 4: Final Integration (0.5 day)**
   - Update ZIP packaging to include new directory structure
   - Test end-to-end functionality
   - Document changes in architecture document 