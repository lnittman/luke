import { NextRequest, NextResponse } from 'next/server';
import { put, list, del, head, getDownloadUrl } from '@vercel/blob';
import axios from 'axios';
import path from 'path';
import { promises as fs } from 'fs';
import { createHash } from 'crypto';
import { LLMProvider, createServerApiProvider } from '@/lib/llm';

// Tech stack names for file management
const TECH_STACKS = ['next', 'apple', 'cli', 'other'];

// Check update frequency - 24 hours
const UPDATE_FREQUENCY_MS = 24 * 60 * 60 * 1000;

// Create a Jina client for API calls
const jinaClient = axios.create({
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Define paths for the local file system
const DOCS_DIR = path.join(process.cwd(), 'docs');
const TEMPLATE_DIR = path.join(DOCS_DIR, 'template');
const TOOLS_DIR = path.join(DOCS_DIR, 'tools');

// Retry utility for API calls
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3, initialDelay = 500): Promise<T> {
  let retries = 0;
  
  while (true) {
    try {
      return await fn();
    } catch (error: any) {
      retries += 1;
      
      if (retries >= maxRetries || (error.response && error.response.status !== 429)) {
        throw error;
      }
      
      const delay = initialDelay * Math.pow(2, retries - 1);
      console.log(`Rate limited. Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Function to search for documentation using Jina
async function searchDocumentation(query: string): Promise<any[]> {
  try {
    console.log(`[JINA] Searching documentation: ${query}`);
    
    return withRetry(async () => {
      const response = await jinaClient.post('https://s.jina.ai/', {
        q: query,
        options: 'markdown'
      });
      
      console.log(`[JINA] Search results received for: ${query}`);
      return response.data.data || [];
    });
  } catch (error) {
    console.error(`[JINA] Error searching documentation: ${error}`);
    // Return empty array on error
    return [];
  }
}

// Function to read a webpage using Jina
async function readWebpage(url: string): Promise<any> {
  try {
    console.log(`[JINA] Reading webpage: ${url}`);
    
    return withRetry(async () => {
      const response = await jinaClient.post('https://r.jina.ai/', {
        url,
        options: 'markdown'
      });
      
      console.log(`[JINA] Successfully read webpage: ${url}`);
      return response.data;
    });
  } catch (error) {
    console.error(`[JINA] Error reading webpage ${url}: ${error}`);
    // Return empty data on error
    return { data: { title: url, content: `Failed to read content from ${url}` } };
  }
}

// Get latest technologies for a specific stack
async function getTechForStack(stack: string): Promise<{content: string, techItems: string[]}> {
  console.log(`[TECH] Generating tech content for ${stack} stack`);
  
  let query = "modern technology stack software development";
  let additionalTechs: string[] = [];
  
  // Stack-specific search queries
  switch(stack.toLowerCase()) {
    case 'next':
      query = "modern next.js react frontend development stack typescript libraries tools 2024";
      additionalTechs = ["next.js", "react", "typescript", "tailwind"];
      break;
    case 'apple':
      query = "modern apple ios macos development swift swiftui stack libraries tools 2024";
      additionalTechs = ["swift", "swiftui", "combine", "xcode"];
      break;
    case 'cli':
      query = "modern command line interface cli development stack node.js libraries tools 2024";
      additionalTechs = ["node.js", "commander", "inquirer", "chalk"];
      break;
    case 'other':
      query = "modern software development stack full stack technologies frameworks libraries tools 2024";
      additionalTechs = ["react", "next.js", "swift", "node.js", "python"];
      break;
  }
  
  try {
    // Search for tech stack information
    const stackResults = await searchDocumentation(query);
    const techItems = [...additionalTechs];
    
    // Extract content from top results
    let searchContent = '';
    if (stackResults && stackResults.length > 0) {
      searchContent = stackResults.slice(0, 2).map(result => {
        // Extract tech items using basic pattern matching
        const techMatches = result.content.match(/["`']([a-zA-Z0-9\.\-\/]+)["`']/g) || [];
        const extractedTechs = techMatches
          .map((match: string) => match.replace(/["`']/g, '').toLowerCase())
          .filter((tech: string) => tech.length > 1 && !tech.includes('.com'));
        
        // Add unique tech items
        for (const tech of extractedTechs) {
          if (!techItems.includes(tech) && !tech.match(/^\d+$/) && tech.length < 30 && tech.length > 1) {
            techItems.push(tech);
          }
        }
        
        return result.content.substring(0, 3000);
      }).join('\n\n---\n\n');
    }
    
    // Generate stack-specific content
    const title = stack === 'next' ? 'Next.js' : 
                 stack === 'apple' ? 'Apple Platform' :
                 stack === 'cli' ? 'Command Line Interface' : 'Full Stack';
    
    const techMdContent = `# ${title} Technology Stack Guide

> Generated documentation for ${title} development.
> Last updated: ${new Date().toISOString()}

## Core Technologies

${searchContent || `No specific content available for ${title} at this time.`}

## Recommended Libraries and Tools

${techItems.length > 0 ? techItems.map(tech => `- ${tech}`).join('\n') : 'No specific technologies available at this time.'}
`;

    console.log(`[TECH] Successfully generated content for ${stack} with ${techItems.length} tech items`);
    return { content: techMdContent, techItems };
  } catch (error) {
    console.error(`[TECH] Error generating tech content for ${stack}:`, error);
    
    // Fallback content
    return { 
      content: `# ${stack.toUpperCase()} Technology Stack Guide\n\nDefault technology information for ${stack}.\nLast updated: ${new Date().toISOString()}`,
      techItems: []
    };
  }
}

// Determine if a file should be updated based on age
async function shouldUpdateFile(pathName: string): Promise<boolean> {
  try {
    const { blobs } = await list();
    const blob = blobs.find(b => b.pathname === pathName);
    
    if (!blob) {
      console.log(`[TECH] File ${pathName} not found, should generate`);
      return true;
    }
    
    // Check if file is older than 24 hours
    const lastUpdated = new Date(blob.uploadedAt);
    const now = new Date();
    const diffHours = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
    
    // Update if older than 24 hours
    if (diffHours > 24) {
      console.log(`[TECH] File ${pathName} is ${diffHours.toFixed(1)} hours old, should update`);
      return true;
    }
    
    console.log(`[TECH] File ${pathName} is ${diffHours.toFixed(1)} hours old, no update needed`);
    return false;
  } catch (error) {
    console.error(`[TECH] Error checking file age for ${pathName}:`, error);
    return true; // Update on error to be safe
  }
}

// Generate tech relationships data
async function generateTechRelationships(allTechItems: string[]): Promise<Record<string, string[]>> {
  console.log(`[TECH] Generating relationships for ${allTechItems.length} tech items`);
  
  // Base relationships
  const relationships: Record<string, string[]> = {
    // Frontend frameworks
    "react": ["next.js", "tailwindcss", "typescript", "framer-motion", "shadcn-ui", "eslint", "zod"],
    "next.js": ["react", "tailwindcss", "typescript", "prisma", "vercel", "eslint"],
    "vue.js": ["vite", "typescript", "pinia", "vuex", "nuxt.js"],
    
    // Backend frameworks
    "node.js": ["express", "typescript", "prisma", "mongodb", "postgresql"],
    "express": ["node.js", "mongodb", "postgresql", "jwt", "typescript"],
    "fastapi": ["python", "pydantic", "sqlalchemy", "postgresql"],
    
    // Databases
    "postgresql": ["prisma", "typeorm", "node.js", "python", "sqlalchemy"],
    "mongodb": ["mongoose", "node.js", "express", "typescript"],
    
    // Mobile
    "swift": ["swiftui", "combine", "xcode", "coredata", "swiftdata"],
    "swiftui": ["swift", "combine", "xcode"]
  };
  
  // Add newly discovered tech items with basic relationships
  for (const tech of allTechItems) {
    if (!relationships[tech]) {
      // Assign related items based on tech name pattern matching
      const relatedItems: string[] = [];
      
      // Try to find related technologies from existing relationships
      for (const [key, values] of Object.entries(relationships)) {
        // If tech name appears in another tech's related items, reciprocate
        if (values.includes(tech)) {
          relatedItems.push(key);
        }
        
        // Fuzzy matching based on name
        if (tech.includes(key) || key.includes(tech)) {
          relatedItems.push(key);
        }
      }
      
      // Add discovered relations
      if (relatedItems.length > 0) {
        // Remove duplicates by creating an array from unique values
        const uniqueRelatedItems = Array.from(new Set(relatedItems));
        relationships[tech] = uniqueRelatedItems.slice(0, 5); // Limit to 5 related items
      }
    }
  }
  
  console.log(`[TECH] Generated relationships for ${Object.keys(relationships).length} tech items`);
  return relationships;
}

// Check for token in request headers or environment
function getBlobToken(request: NextRequest): string | undefined {
  // Check for token in custom header
  const headerToken = request.headers.get('x-vercel-blob-token');
  if (headerToken) {
    return headerToken;
  }
  
  // Fall back to environment variables
  return process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_TOKEN;
}

// Handler for GET requests
export async function GET(request: NextRequest) {
  // Set the token for this request
  const token = getBlobToken(request);
  process.env.VERCEL_BLOB_TOKEN = token;
  
  try {
    const techData = await getTechData();
    return NextResponse.json(techData);
  } catch (error) {
    console.error('Error retrieving tech data:', error);
    return NextResponse.json({
      error: 'Failed to retrieve tech data',
      message: error instanceof Error ? error.message : String(error),
      fallback: 'Using local files instead',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Handler for POST requests - to manually trigger updates
export async function POST(request: NextRequest) {
  // Set the token for this request
  const token = getBlobToken(request);
  process.env.VERCEL_BLOB_TOKEN = token;
  
  try {
    await updateTechFiles();
    const techData = await getTechData();
    return NextResponse.json({
      success: true,
      data: techData,
      message: 'Tech files updated successfully'
    });
  } catch (error) {
    console.error('Error updating tech files:', error);
    return NextResponse.json({
      error: 'Failed to update tech files',
      message: error instanceof Error ? error.message : String(error),
      fallback: 'Using existing files instead',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Update tech files in both Vercel Blob and local filesystem
async function updateTechFiles() {
  console.log('[TECH] Starting tech files update process');
  
  // Check if we should update all files
  const shouldUpdate = await shouldUpdateFile('tech.md');
  if (!shouldUpdate) {
    console.log('[TECH] No update needed based on file age');
    return { message: 'Tech files are up to date' };
  }
  
  // Local file operations - ensure directories exist
  try {
    // Ensure the directories exist
    await fs.mkdir(DOCS_DIR, { recursive: true });
    await fs.mkdir(TEMPLATE_DIR, { recursive: true });
    await fs.mkdir(TOOLS_DIR, { recursive: true });
    
    // Create stack directory in template dir
    const stackDir = path.join(TEMPLATE_DIR, 'stack');
    await fs.mkdir(stackDir, { recursive: true });
    
    // Create each tech stack directory in the template/stack dir
    for (const stack of TECH_STACKS) {
      const techStackDir = path.join(stackDir, stack);
      await fs.mkdir(techStackDir, { recursive: true });
    }
  } catch (error) {
    console.error('Error creating directories:', error);
  }
  
  // Collect all tech items for relationship building
  const allTechItems: string[] = [];
  
  // Generate tech docs for each stack
  for (const stack of TECH_STACKS) {
    console.log(`[TECH] Generating tech docs for ${stack}...`);
    try {
      const { content, techItems } = await getTechForStack(stack);
      allTechItems.push(...techItems);
      
      // Save to Vercel Blob
      try {
        const blobName = `tech-${stack}.md`;
        const blob = await put(blobName, content, { access: 'public' });
        console.log(`[TECH] Uploaded ${blobName} to Vercel Blob: ${blob.url}`);
      } catch (blobError) {
        console.error(`[TECH] Error uploading ${stack} to Vercel Blob:`, blobError);
      }
      
      // Save locally to both new and legacy locations
      try {
        // New location in template/stack/{stack}/tech.md
        const stackDir = path.join(TEMPLATE_DIR, 'stack', stack);
        await fs.writeFile(path.join(stackDir, 'tech.md'), content);
        
        // Legacy location
        await fs.writeFile(path.join(DOCS_DIR, `tech-${stack}.md`), content);
        
        console.log(`[TECH] Saved ${stack} documentation locally`);
      } catch (fileError) {
        console.error(`[TECH] Error saving ${stack} documentation locally:`, fileError);
      }
    } catch (error) {
      console.error(`[TECH] Error generating tech docs for ${stack}:`, error);
    }
  }
  
  // Generate relationships between tech stacks
  const relationships = await generateTechRelationships(allTechItems);
  
  // Save relationships
  try {
    const relationshipsJSON = JSON.stringify(relationships, null, 2);
    
    // Save to Vercel Blob
    try {
      await put('relationships.json', relationshipsJSON, { access: 'public' });
      console.log('[TECH] Saved relationships to Vercel Blob');
    } catch (error) {
      console.error('[TECH] Error saving relationships to Vercel Blob:', error);
    }
    
    // Save locally
    try {
      await fs.writeFile(path.join(DOCS_DIR, 'relationships.json'), relationshipsJSON);
      console.log('[TECH] Saved relationships locally');
    } catch (error) {
      console.error('[TECH] Error saving relationships locally:', error);
    }
  } catch (error) {
    console.error('[TECH] Error generating relationships:', error);
  }
  
  // Generate main tech.md file with all stacks
  try {
    // Read all stack files and combine them
    const techMdParts: string[] = [];
    
    for (const stack of TECH_STACKS) {
      try {
        const stackPath = path.join(TEMPLATE_DIR, stack, 'tech.md');
        const content = await fs.readFile(stackPath, 'utf-8');
        
        // Extract content without the header and last updated line
        const lines = content.split('\n');
        const filteredLines = lines.filter((line, index) => 
          index > 2 && !line.includes('Last updated')
        );
        
        techMdParts.push(`## ${stack.charAt(0).toUpperCase() + stack.slice(1)} Technologies\n\n${filteredLines.join('\n')}`);
      } catch (error) {
        console.error(`[TECH] Error reading stack file for ${stack}:`, error);
      }
    }
    
    // Create the main tech.md file
    const mainTechContent = `# Technology Stack Guide 2024

> Comprehensive guide to modern development technologies across different platforms.
> Last updated: ${new Date().toISOString()}

${techMdParts.join('\n\n---\n\n')}
`;
    
    // Save to Vercel Blob
    try {
      const blob = await put('tech.md', mainTechContent, { access: 'public' });
      console.log(`[TECH] Uploaded main tech.md to Vercel Blob: ${blob.url}`);
    } catch (blobError) {
      console.error('[TECH] Error uploading main tech.md to Vercel Blob:', blobError);
    }
    
    // Save locally to both new and legacy locations
    try {
      // New location in tools/tech.md
      await fs.writeFile(path.join(TOOLS_DIR, 'tech.md'), mainTechContent);
      
      // Legacy location
      await fs.writeFile(path.join(DOCS_DIR, 'tech.md'), mainTechContent);
      
      console.log('[TECH] Saved main tech.md documentation locally');
    } catch (fileError) {
      console.error('[TECH] Error saving main tech.md documentation locally:', fileError);
    }
  } catch (error) {
    console.error('[TECH] Error generating main tech file:', error);
  }
  
  console.log('[TECH] Tech files update complete');
  return { message: 'Tech files updated' };
}

// Retrieve tech data, first from Vercel Blob, then fall back to local file if necessary
async function getTechData() {
  const techData: Record<string, any> = {
    stacks: {},
    main: '',
    relationships: {},
  };

  // Try to get data from Vercel Blob first
  try {
    // Get the list of blobs
    const blobs = await list();
    console.log(`Found ${blobs.blobs.length} blobs.`);
    
    // Process tech stacks and main file
    const techStacks = ['next', 'apple', 'cli', 'other'];
    for (const stack of techStacks) {
      const blobName = `tech-${stack}.md`;
      const blob = blobs.blobs.find(b => b.pathname === blobName);
      
      if (blob) {
        try {
          const url = await getDownloadUrl(blobName);
          const response = await fetch(url);
          if (response.ok) {
            techData[stack] = await response.text();
          } else {
            console.error(`Failed to fetch ${blobName} from blob storage: ${response.status}`);
          }
        } catch (error) {
          console.error(`Error fetching ${blobName} from blob:`, error);
        }
      }
    }
    
    // Get main tech.md file
    const mainBlob = blobs.blobs.find(b => b.pathname === 'tech.md');
    if (mainBlob) {
      try {
        const url = await getDownloadUrl('tech.md');
        const response = await fetch(url);
        if (response.ok) {
          techData.main = await response.text();
        } else {
          console.error(`Failed to fetch tech.md from blob storage: ${response.status}`);
        }
      } catch (error) {
        console.error('Error retrieving tech.md from blob:', error);
        // Will fall back to local files
      }
    }
    
    // Get relationships file
    const relBlob = blobs.blobs.find(b => b.pathname === 'relationships.json');
    if (relBlob) {
      try {
        const url = await getDownloadUrl('relationships.json');
        const response = await fetch(url);
        if (response.ok) {
          techData.relationships = await response.json();
        } else {
          console.error(`Failed to fetch relationships.json from blob storage: ${response.status}`);
        }
      } catch (error) {
        console.error('Error retrieving relationships.json from blob:', error);
        // Will fall back to local files
      }
    }
    
    console.log('Successfully retrieved tech data from Vercel Blob');
    return techData;
  } catch (blobError) {
    console.error('Error retrieving from Vercel Blob, falling back to local files:', blobError);
    
    // Fallback to local files
    try {
      const techStacks = ['next', 'apple', 'cli', 'other'];
      
      for (const stack of techStacks) {
        try {
          // Try new location first
          const templateStackPath = path.join(TEMPLATE_DIR, stack, 'tech.md');
          techData[stack] = await fs.readFile(templateStackPath, 'utf-8');
          console.log(`Read ${stack} from ${templateStackPath}`);
        } catch (e) {
          // Fallback to legacy location
          try {
            const legacyPath = path.join(DOCS_DIR, `tech-${stack}.md`);
            techData[stack] = await fs.readFile(legacyPath, 'utf-8');
            console.log(`Read ${stack} from legacy path ${legacyPath}`);
          } catch (legacyError) {
            console.error(`Could not read ${stack} documentation from any location:`, legacyError);
            techData[stack] = `# ${stack} Documentation\n\nDocumentation not available.`;
          }
        }
      }
      
      // Get main tech file
      try {
        // Try new location first
        const toolsPath = path.join(TOOLS_DIR, 'tech.md');
        techData.main = await fs.readFile(toolsPath, 'utf-8');
        console.log(`Read main tech from ${toolsPath}`);
      } catch (e) {
        // Fallback to legacy location
        try {
          const legacyMainPath = path.join(DOCS_DIR, 'tech.md');
          techData.main = await fs.readFile(legacyMainPath, 'utf-8');
          console.log(`Read main tech from legacy path ${legacyMainPath}`);
        } catch (legacyError) {
          console.error('Could not read main tech documentation from any location:', legacyError);
          techData.main = '# Technology Documentation\n\nMain documentation not available.';
        }
      }
      
      // Try to read relationships file
      try {
        const relationshipsPath = path.join(DOCS_DIR, 'relationships.json');
        const relationshipsContent = await fs.readFile(relationshipsPath, 'utf-8');
        techData.relationships = JSON.parse(relationshipsContent);
      } catch (e) {
        console.error('Could not read relationships file:', e);
        techData.relationships = {};
      }
      
      console.log('Successfully retrieved tech data from local files');
    } catch (fileError) {
      console.error('Error retrieving from local files:', fileError);
      throw new Error('Failed to retrieve tech data from Vercel Blob and local files');
    }
  }
  
  return techData;
} 