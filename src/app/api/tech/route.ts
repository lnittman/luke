import { NextRequest, NextResponse } from 'next/server';
import { put, list, del, head, getDownloadUrl, get } from '@vercel/blob';
import axios from 'axios';
import path from 'path';
import fs from 'fs';

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

// Handler for GET requests
export async function GET(request: NextRequest) {
  try {
    const techData = await getTechData();
    return NextResponse.json(techData);
  } catch (error) {
    console.error('Error retrieving tech data:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve tech data' },
      { status: 500 }
    );
  }
}

// Handler for POST requests - to manually trigger updates
export async function POST(request: NextRequest) {
  try {
    console.log('[TECH] Manual update requested');
    const updatedData = await updateTechFiles();
    return NextResponse.json(updatedData);
  } catch (error) {
    console.error('Error updating tech data:', error);
    return NextResponse.json(
      { error: 'Failed to update tech data' },
      { status: 500 }
    );
  }
}

// Update tech files in Vercel Blob
async function updateTechFiles() {
  console.log('[TECH] Updating tech documentation files');
  
  const techData = {
    techMd: '',
    stacks: {} as Record<string, { lastUpdated: string }>,
    relationships: {} as Record<string, string[]>
  };
  
  // Process each tech stack
  const stackContents: Record<string, string> = {};
  let allTechItems: string[] = [];
  
  for (const stack of TECH_STACKS) {
    console.log(`[TECH] Generating content for ${stack}`);
    
    try {
      // Generate content for this stack
      const { content, techItems } = await getTechForStack(stack);
      
      // Store in Vercel Blob
      const techFileName = `tech-${stack}.md`;
      await put(techFileName, content, { access: 'public' });
      
      // Track data
      stackContents[stack] = content;
      allTechItems = [...allTechItems, ...techItems];
      
      // Update stacks info
      techData.stacks[stack] = {
        lastUpdated: new Date().toISOString()
      };
      
      console.log(`[TECH] Successfully updated ${techFileName}`);
    } catch (error) {
      console.error(`[TECH] Error updating ${stack}:`, error);
    }
  }
  
  // Generate main tech.md file
  const mainTechMd = `# Technology Stack Guide 2024

> Comprehensive guide to modern development technologies across different platforms.
> Last updated: ${new Date().toISOString()}

${Object.entries(stackContents).map(([stack, content]) => {
  // Extract content without the header and last updated line
  const lines = content.split('\n');
  const filteredLines = lines.filter((line, index) => 
    index > 2 && !line.includes('Last updated')
  );
  return `## ${stack.charAt(0).toUpperCase() + stack.slice(1)} Technologies\n\n${filteredLines.join('\n')}`;
}).join('\n\n---\n\n')}
`;
  
  // Store combined content
  await put('tech.md', mainTechMd, { access: 'public' });
  techData.techMd = mainTechMd;
  
  // Generate relationships - deduplicate tech items first
  allTechItems = Array.from(new Set(allTechItems));
  techData.relationships = await generateTechRelationships(allTechItems);
  
  return techData;
}

// Retrieve tech data, first from Vercel Blob, then fall back to local file if necessary
async function getTechData() {
  let techMd = '';
  let stacks = {} as Record<string, { lastUpdated: string }>;
  let relationships = {} as Record<string, string[]>;

  try {
    // First try to get files from Vercel Blob
    console.log('Fetching tech files from Vercel Blob...');

    // List all blobs to find tech files
    const { blobs } = await list();
    const techMdBlob = blobs.find(blob => blob.pathname === 'tech.md');
    
    if (techMdBlob) {
      // Get the main tech.md file
      const response = await fetch(techMdBlob.url);
      if (response.ok) {
        techMd = await response.text();
        console.log('Successfully retrieved tech.md from Vercel Blob');
      }

      // Get the stack files
      const stacksData: Record<string, { lastUpdated: string }> = {};
      const stackFiles = blobs.filter(blob => blob.pathname.startsWith('tech-') && blob.pathname.endsWith('.md'));
      
      for (const stackFile of stackFiles) {
        const stackName = stackFile.pathname.replace('tech-', '').replace('.md', '');
        stacksData[stackName] = {
          lastUpdated: new Date(stackFile.uploadedAt).toISOString()
        };
      }
      
      stacks = stacksData;
      console.log(`Found ${Object.keys(stacks).length} tech stack files in Vercel Blob`);
      
      // Extract relationships from content (simplified version)
      // In a real implementation, you would parse the content of each file to generate relationships
      const techNames = Object.keys(stacks);
      for (const tech of techNames) {
        relationships[tech] = techNames.filter(t => t !== tech).slice(0, 3);
      }
      
      // Check if the files need updating
      const oldestFile = Object.values(stacks).reduce((oldest, current) => {
        const currentDate = new Date(current.lastUpdated).getTime();
        return currentDate < oldest ? currentDate : oldest;
      }, Date.now());
      
      const ageMs = Date.now() - oldestFile;
      if (ageMs > UPDATE_FREQUENCY_MS) {
        console.log(`Files are ${ageMs / (1000 * 60 * 60)} hours old, triggering background update`);
        // Trigger update in background
        updateTechFiles().catch(err => console.error('Background update failed:', err));
      }
      
      return {
        techMd,
        relationships,
        stacks
      };
    } else {
      console.log('No tech.md file found in Vercel Blob, generating new content');
      return await updateTechFiles();
    }
  } catch (error) {
    console.error('Error retrieving from Vercel Blob:', error);
    console.log('Falling back to local files...');
  }

  // Fall back to local files if Vercel Blob fails
  try {
    const docsPath = path.join(process.cwd(), 'docs');
    const mainFilePath = path.join(docsPath, 'tech.md');
    
    if (fs.existsSync(mainFilePath)) {
      techMd = fs.readFileSync(mainFilePath, 'utf-8');
      
      // Parse stack files
      const stackFiles = fs.readdirSync(docsPath)
        .filter(file => file.startsWith('tech-') && file.endsWith('.md'));
      
      for (const file of stackFiles) {
        const stackName = file.replace('tech-', '').replace('.md', '');
        const stats = fs.statSync(path.join(docsPath, file));
        
        stacks[stackName] = {
          lastUpdated: stats.mtime.toISOString()
        };
      }
      
      // Extract relationships (simplified)
      const techNames = Object.keys(stacks);
      for (const tech of techNames) {
        relationships[tech] = techNames.filter(t => t !== tech).slice(0, 3);
      }
      
      return {
        techMd,
        relationships,
        stacks
      };
    } else {
      console.log('No local tech.md file found, generating new content');
      return await updateTechFiles();
    }
  } catch (error) {
    console.error('Error reading local files:', error);
  }

  // If all else fails, return default content
  return {
    techMd: "# Technology Stack Guide\n\nNo documentation available. Run the tech update command to generate documentation.",
    relationships: {},
    stacks: {}
  };
} 