import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import axios from 'axios';

export const maxDuration = 60; // 60 second timeout for tech stack generation

// Utility to get the current year and month
function getCurrentYear(): number {
  return new Date().getFullYear();
}

function getCurrentMonthName(): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[new Date().getMonth()];
}

/**
 * Search for technical documentation using Perplexity/Sonar Reasoning
 */
async function searchWithSonarReasoning(query: string): Promise<string> {
  console.log(`[TECH GENERATE] Searching with Sonar: "${query.substring(0, 100)}..."`);
  
  // Get the OpenRouter API key from environment variable
  const openrouterApiKey = process.env.OPENROUTER_API_KEY;
  
  if (!openrouterApiKey) {
    throw new Error('OpenRouter API key not configured');
  }
  
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'perplexity/sonar-reasoning',
        messages: [
          {
            role: 'system',
            content: `You are a technical documentation specialist who provides comprehensive, accurate information about technology stacks, frameworks, and libraries. Focus on finding official documentation, community resources, and best practices.`
          },
          {
            role: 'user',
            content: `Research the following technology stack thoroughly: ${query}. 
            
Focus on:
1. Core frameworks and libraries
2. Common third-party integrations
3. Development tools and utilities
4. Best practices and architectural patterns
5. Official documentation links

Provide detailed information with links to official documentation, tutorials, GitHub repositories, and community resources.`
          }
        ],
        max_tokens: 4000,
        temperature: 0.7
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openrouterApiKey}`,
          'HTTP-Referer': 'https://luke-portfolio.vercel.app',
          'X-Title': 'Luke App'
        }
      }
    );
    
    const content = response.data.choices[0].message.content;
    console.log(`[TECH GENERATE] Received ${content.length} chars from Sonar`);
    return content;
  } catch (error: any) {
    console.error(`[TECH GENERATE] Error searching with Sonar: ${error.message}`);
    throw new Error(`Sonar search failed: ${error.message}`);
  }
}

/**
 * Generate a comprehensive tech stack documentation using Claude
 */
async function generateTechDocumentation(
  framework: string, 
  searchResults: string[]
): Promise<string> {
  console.log(`[TECH GENERATE] Generating documentation for ${framework}`);
  
  // Get the OpenRouter API key from environment variable
  const openrouterApiKey = process.env.OPENROUTER_API_KEY;
  
  if (!openrouterApiKey) {
    throw new Error('OpenRouter API key not configured');
  }
  
  // Extract URLs from search results
  const urlRegex = /https?:\/\/[^\s)"\]]+/g;
  const urls: string[] = [];
  
  searchResults.forEach(result => {
    const matches = result.match(urlRegex) || [];
    matches.forEach(url => {
      if (!urls.includes(url)) {
        urls.push(url);
      }
    });
  });
  
  // Create a context from search results (truncated to avoid token limits)
  const searchContext = searchResults.join('\n\n---\n\n').substring(0, 10000);
  
  // Create the system prompt
  const systemPrompt = `You are a technical documentation expert specializing in creating comprehensive, well-structured documentation for technology stacks.

Your task is to create a complete tech.md file for the ${framework} framework/technology stack that includes:

1. A clear title and introduction
2. Core concepts and architecture
3. Main components and modules
4. Installation and setup instructions 
5. Common usage patterns and examples
6. Best practices and optimization tips
7. Integration with other technologies
8. Debugging and troubleshooting
9. Community resources and official links

Format the documentation as Markdown with proper headings, code blocks, and lists.
Include exact version numbers when available and specific code examples where appropriate.
Structure the information hierarchically for easy navigation.
Make sure to reference official documentation URLs throughout the document.`;

  try {
    // Generate the tech documentation using Claude
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'anthropic/claude-3.7-sonnet',
        messages: [
          { 
            role: 'system', 
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Please create a comprehensive tech.md documentation file for the ${framework} technology stack.

Use the following research information I've gathered:

${searchContext}

Additional resource links:
${urls.slice(0, 15).join('\n')}

Please structure the documentation with clear sections, including installation, key concepts, common patterns, best practices, and integrations with other technologies.

Current date: ${getCurrentMonthName()} ${getCurrentYear()}
`
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openrouterApiKey}`,
          'HTTP-Referer': 'https://luke-portfolio.vercel.app',
          'X-Title': 'Luke App'
        }
      }
    );
    
    const content = response.data.choices[0].message.content;
    console.log(`[TECH GENERATE] Generated documentation (${content.length} chars)`);
    return content;
  } catch (error: any) {
    console.error(`[TECH GENERATE] Error generating tech doc: ${error.message}`);
    throw new Error(`Tech doc generation failed: ${error.message}`);
  }
}

/**
 * Extract tech items from generated documentation
 */
function extractTechItems(documentation: string): string[] {
  const techItems: string[] = [];
  
  // Extract from headings (## Technology Name)
  const headingRegex = /##\s+([A-Za-z0-9\s\-\.]+)/g;
  let headingMatch: RegExpExecArray | null;
  while ((headingMatch = headingRegex.exec(documentation)) !== null) {
    if (headingMatch[1] && headingMatch[1].length > 1 && headingMatch[1].length < 50) {
      techItems.push(headingMatch[1].trim());
    }
  }
  
  // Extract from code blocks (`npm install package-name`)
  const npmRegex = /`(?:npm|yarn|pnpm)(?:\s+add|\s+install)\s+([^`]+)`/g;
  let npmMatch: RegExpExecArray | null;
  while ((npmMatch = npmRegex.exec(documentation)) !== null) {
    if (npmMatch[1]) {
      const packages = npmMatch[1].split(/\s+/).filter((pkg: string) => 
        !pkg.startsWith('-') && 
        !pkg.startsWith('@types/') && 
        pkg !== 'install' && 
        pkg !== 'add'
      );
      techItems.push(...packages);
    }
  }
  
  // Extract from inline code references
  const inlineCodeRegex = /`([a-zA-Z0-9\-\.\/]+)`/g;
  let inlineMatch: RegExpExecArray | null;
  while ((inlineMatch = inlineCodeRegex.exec(documentation)) !== null) {
    if (inlineMatch[1] && inlineMatch[1].length > 1 && inlineMatch[1].length < 30 && 
        !inlineMatch[1].includes('./') && !inlineMatch[1].includes('../')) {
      techItems.push(inlineMatch[1]);
    }
  }
  
  // Remove duplicates
  return Array.from(new Set(techItems));
}

/**
 * API route to generate tech stack documentation
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[TECH GENERATE] Received request to generate tech stack');
    
    // Parse the request body
    const requestData = await request.json();
    const { framework } = requestData;

    if (!framework || typeof framework !== 'string') {
      console.error('[TECH GENERATE] Invalid framework name provided');
      return NextResponse.json(
        { error: 'Invalid framework name. Please provide a framework name.' },
        { status: 400 }
      );
    }

    console.log(`[TECH GENERATE] Generating tech stack for: ${framework}`);
    
    // Normalize the framework name for file naming
    const normalizedFramework = framework.toLowerCase().replace(/\s+/g, '-');
    
    // 1. Generate search queries for different aspects of the framework
    const searchQueries = [
      `${framework} technology stack guide ${getCurrentYear()} official documentation best practices`,
      `${framework} architecture components and libraries ${getCurrentYear()}`,
      `${framework} development tools debugging integration with other frameworks`,
      `${framework} common patterns example projects gitHub repositories community resources`
    ];
    
    // 2. Execute search queries in parallel
    console.log(`[TECH GENERATE] Executing ${searchQueries.length} search queries with Sonar`);
    const searchPromises = searchQueries.map(query => searchWithSonarReasoning(query));
    const searchResults = await Promise.all(searchPromises);
    console.log(`[TECH GENERATE] Completed ${searchResults.length} search queries`);
    
    // 3. Generate the comprehensive tech documentation
    console.log(`[TECH GENERATE] Generating comprehensive documentation with Claude`);
    const techDocumentation = await generateTechDocumentation(framework, searchResults);
    
    // 4. Extract tech items from the documentation
    const techItems = extractTechItems(techDocumentation);
    console.log(`[TECH GENERATE] Extracted ${techItems.length} tech items from documentation`);
    
    // 5. Save the documentation to Vercel Blob
    const techFileName = `tech-${normalizedFramework}.md`;
    const blob = await put(techFileName, techDocumentation, { access: 'public' });
    console.log(`[TECH GENERATE] Saved documentation to Vercel Blob: ${blob.url}`);
    
    // 6. Return the generated documentation and tech items
    return NextResponse.json({
      message: `Successfully generated tech documentation for ${framework}`,
      documentation: techDocumentation,
      techItems: techItems,
      url: blob.url
    });
  } catch (error: any) {
    console.error(`[TECH GENERATE] Error generating tech stack: ${error.message}`);
    return NextResponse.json(
      { error: `Error generating tech stack: ${error.message}` },
      { status: 500 }
    );
  }
} 