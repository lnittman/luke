import { projectGenerator } from '@/lib/llm';
import { prisma } from '@/lib/db/prisma';
import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';
import crypto from 'crypto';

// Create a fingerprint from user IP and agent
function createFingerprint(ip: string, userAgent: string): string {
  const data = `${ip}|${userAgent}`;
  return crypto.createHash('sha256').update(data).digest('hex');
}

// Define project structure interface
interface ProjectStructure {
  project: {
    id: string;
    name: string;
    emoji: string;
    description: string;
    sourceUrl: string;
    content: {
      overview: {
        title: string;
        items: string[];
      };
      core: {
        title: string;
        items: string[];
      };
      architecture: {
        title: string;
        items: string[];
      };
      tech: {
        title: string;
        items: Array<string | { name: string; documentationUrl: string }>;
      };
    };
  };
}

export const maxDuration = 300; // 5 minutes

// Add this new function before the enrichTechDocumentation function

/**
 * Generate a search plan for project generation using Claude
 */
async function generateProjectSearchPlan(
  prompt: string,
  techStackType: string,
  techStack: any
): Promise<string[]> {
  try {
    // Get the OpenRouter API key
    const openrouterApiKey = process.env.OPENROUTER_API_KEY;
    
    if (!openrouterApiKey) {
      console.warn('No OpenRouter API key found for search plan generation');
      return getDefaultProjectSearchQueries(prompt, techStackType, techStack);
    }
    
    const currentYear = new Date().getFullYear().toString();
    const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });
    
    // Extract tech stack items for the prompt
    const techItems: string[] = [];
    if (techStack) {
      if (techStack.frameworks) techItems.push(...techStack.frameworks);
      if (techStack.libraries) techItems.push(...techStack.libraries);
      if (techStack.apis) techItems.push(...techStack.apis);
      if (techStack.tools) techItems.push(...techStack.tools);
    }
    
    // Create a prompt for Claude to generate search queries
    const searchPlanPrompt = `
You are a search strategist tasked with creating the optimal set of 4-6 search queries to gather comprehensive information for generating documentation for a software project.

PROJECT REQUIREMENTS: "${prompt}"
TECH STACK TYPE: "${techStackType}"
${techItems.length > 0 ? `TECH STACK: ${techItems.join(', ')}` : ''}

Current date: ${currentMonth} ${currentYear}

Your task is to create search queries that will retrieve the most valuable information to help document and implement this project effectively.

The search queries should:
1. Cover best practices and implementation patterns for the specified tech stack
2. Find current resources, tutorials, and documentation for the project's technologies
3. Identify common architecture patterns for this type of application
4. Explore potential API integrations and libraries that would benefit this project
5. Research common challenges and solutions for similar projects

Format your response as a JSON array of strings, each representing a single search query.
Example: ["query 1", "query 2", "query 3"]

Make each query specific and information-dense to maximize the quality of search results.
`;

    // Make API call to Claude
    console.log("Generating project search plan with Claude...");
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openrouterApiKey}`,
        'HTTP-Referer': 'https://luke-portfolio.vercel.app',
        'X-Title': 'Luke App',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.7-sonnet',
        messages: [
          { role: 'user', content: searchPlanPrompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate search plan: ${response.status}`);
    }

    const data = await response.json();
    const searchPlanContent = data.choices[0].message.content;
    
    try {
      // Parse the JSON response
      const searchPlan = JSON.parse(searchPlanContent);
      
      if (Array.isArray(searchPlan) && searchPlan.length > 0) {
        console.log("Generated project search plan:", searchPlan);
        return searchPlan;
      }
    } catch (parseError) {
      console.error("Error parsing search plan:", parseError);
    }
    
    // Fall back to default queries if anything goes wrong
    return getDefaultProjectSearchQueries(prompt, techStackType, techStack);
  } catch (error) {
    console.error("Error generating project search plan:", error);
    return getDefaultProjectSearchQueries(prompt, techStackType, techStack);
  }
}

/**
 * Get default search queries for project generation if search plan generation fails
 */
function getDefaultProjectSearchQueries(
  prompt: string, 
  techStackType: string, 
  techStack: any
): string[] {
  // Extract tech stack items
  const techItems: string[] = [];
  if (techStack) {
    if (techStack.frameworks) techItems.push(...techStack.frameworks);
    if (techStack.libraries) techItems.push(...techStack.libraries);
    if (techStack.apis) techItems.push(...techStack.apis);
    if (techStack.tools) techItems.push(...techStack.tools);
  }
  
  const currentYear = new Date().getFullYear().toString();
  
  return [
    `best practices architecture patterns for ${techStackType} applications in ${currentYear}`,
    `latest tutorials and documentation for ${techItems.slice(0, 3).join(', ')} implementation`,
    `${prompt} application development approach using ${techStackType}`,
    `common challenges and solutions for building ${techStackType} applications`,
    `recommended API integrations and libraries for ${prompt} projects`
  ];
}

// Function to enrich tech documentation using Perplexity's Sonar Reasoning
async function enrichTechDocumentation(projectContent: any, techStack: any): Promise<Array<{ name: string; documentationUrl: string }>> {
  try {
    // Get OpenRouter API key from environment variable
    const openrouterApiKey = process.env.OPENROUTER_API_KEY;
    
    if (!openrouterApiKey) {
      console.warn('No OpenRouter API key found in environment variables');
      return [];
    }
    
    // Extract tech names from project content
    const techItems = projectContent.tech || [];
    
    if (!techItems || techItems.length === 0) {
      console.warn('No tech items found in project content');
      return [];
    }
    
    console.log('Enriching tech documentation with Perplexity Sonar Reasoning...');
    
    // Create a list of tech items for the prompt
    const techNames = techItems.map((item: any) => {
      if (typeof item === 'string') return item;
      return item.name;
    }).filter(Boolean);
    
    // Additional tech items from the tech stack if available
    const additionalTech: string[] = [];
    if (techStack) {
      if (techStack.frameworks) additionalTech.push(...techStack.frameworks);
      if (techStack.libraries) additionalTech.push(...techStack.libraries);
      if (techStack.apis) additionalTech.push(...techStack.apis);
      if (techStack.tools) additionalTech.push(...techStack.tools);
    }
    
    // Combine all tech items and remove duplicates
    const allTechItems = Array.from(new Set([...techNames, ...additionalTech]));
    
    // Format tech items for the prompt
    const techItemsStr = allTechItems.join(', ');
    
    // Use Perplexity via OpenRouter to get current documentation links
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'perplexity/sonar-reasoning',
        messages: [
          {
            role: 'system',
            content: `You are a technical documentation specialist who provides the most current and official documentation links for software technologies, libraries, frameworks, and tools. You should focus on finding the official documentation URLs, GitHub repositories, and other authoritative sources.`
          },
          {
            role: 'user',
            content: `Please provide the most current and official documentation links for the following technologies: ${techItemsStr}.

For each technology, provide:
1. The exact name of the technology (correcting any typos or casing issues)
2. The primary official documentation URL
3. A secondary resource URL (like GitHub repo, tutorials site, etc.) if available

Format your response as a valid JSON array of objects, each with "name" and "documentationUrl" properties. Do not include any explanatory text outside the JSON array.

Example format:
[
  {
    "name": "React",
    "documentationUrl": "https://react.dev"
  },
  {
    "name": "TailwindCSS",
    "documentationUrl": "https://tailwindcss.com/docs"
  }
]`
          }
        ],
        max_tokens: 2048,
        temperature: 0.1,
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openrouterApiKey}`,
          'HTTP-Referer': 'https://luke-portfolio.vercel.app',
          'X-Title': 'Luke Project Generator'
        }
      }
    );
    
    console.log('Received tech documentation links from Perplexity');
    
    // Parse the response to get the tech documentation links
    const content = response.data.choices[0].message.content;
    
    try {
      // Parse the JSON response, handling markdown code blocks
      let jsonContent = content;
      
      // Check if the content is wrapped in markdown code blocks
      const markdownCodeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
      const markdownMatch = content.match(markdownCodeBlockRegex);
      
      if (markdownMatch && markdownMatch[1]) {
        // Extract the JSON content from the markdown code block
        jsonContent = markdownMatch[1].trim();
        console.log('Extracted JSON from markdown code block');
      }
      
      // Try to parse the JSON
      let techDocs;
      try {
        techDocs = JSON.parse(jsonContent);
      } catch (error) {
        const parseError = error as Error;
        console.error('First JSON parse attempt failed:', parseError.message);
        
        // If the parsing fails, try to fix common issues
        // Sometimes there are extra backticks or quotes that need to be removed
        const cleanedJson = jsonContent
          .replace(/^```.*\n/, '') // Remove starting code block marker
          .replace(/\n```$/, '')   // Remove ending code block marker
          .trim();
          
        try {
          techDocs = JSON.parse(cleanedJson);
          console.log('Successfully parsed JSON after cleaning');
        } catch (error) {
          // If it still fails, try to extract an array pattern
          const secondParseError = error as Error;
          console.error('Second JSON parse attempt failed:', secondParseError.message);
          
          // Last resort: Try to manually extract data if it looks like JSON but has syntax issues
          // This is a simplified approach that will only work for basic JSON structures
          const extractedLinks = [];
          const itemRegex = /"name":\s*"([^"]+)"[^"]*"documentationUrl":\s*"([^"]+)"/g;
          let match;
          
          while ((match = itemRegex.exec(cleanedJson)) !== null) {
            extractedLinks.push({
              name: match[1],
              documentationUrl: match[2]
            });
          }
          
          if (extractedLinks.length > 0) {
            console.log(`Manually extracted ${extractedLinks.length} links from malformed JSON`);
            return extractedLinks;
          }
          
          throw new Error(`Failed to parse tech documentation JSON: ${secondParseError.message}`);
        }
      }
      
      // Make sure we have an array of objects with name and documentationUrl properties
      if (Array.isArray(techDocs)) {
        return techDocs.filter((item: any) => 
          item && typeof item === 'object' && 
          item.name && typeof item.name === 'string' && 
          item.documentationUrl && typeof item.documentationUrl === 'string'
        );
      }
      
      if (techDocs.links && Array.isArray(techDocs.links)) {
        return techDocs.links.filter((item: any) => 
          item && typeof item === 'object' && 
          item.name && typeof item.name === 'string' && 
          item.documentationUrl && typeof item.documentationUrl === 'string'
        );
      }
      
      console.error('Invalid tech documentation format:', techDocs);
      return [];
      
    } catch (error) {
      console.error('Error parsing tech documentation JSON:', error);
      return [];
    }
    
  } catch (error) {
    console.error('Error enriching tech documentation:', error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error('Response data:', axiosError.response.data);
        console.error('Response status:', axiosError.response.status);
      }
    }
    return [];
  }
}

// Function to merge original tech items with enriched docs
function mergeTechItems(
  originalTech: Array<string | { name: string; documentationUrl: string }>,
  enrichedDocs: Array<{ name: string; documentationUrl: string }>
): Array<{ name: string; documentationUrl: string }> {
  // Create a map of enriched docs by name (lowercase for case-insensitive matching)
  const enrichedDocsMap = new Map();
  enrichedDocs.forEach(doc => {
    enrichedDocsMap.set(doc.name.toLowerCase(), doc);
  });
  
  // Process original tech items
  const result = originalTech.map(item => {
    // If already an object with documentationUrl, use it as is
    if (typeof item !== 'string' && item.documentationUrl) {
      return item;
    }
    
    // Get the name from either string or object
    const name = typeof item === 'string' ? item : item.name;
    
    // Look for enriched doc (case-insensitive)
    const enrichedDoc = enrichedDocsMap.get(name.toLowerCase());
    
    if (enrichedDoc) {
      // Use the enriched doc, but keep the original name casing
      return {
        name: name,
        documentationUrl: enrichedDoc.documentationUrl
      };
    }
    
    // If no enriched doc found, but item is an object, just return it
    if (typeof item !== 'string') {
      return item;
    }
    
    // If string and no enriched doc, create a basic object
    return {
      name: name,
      documentationUrl: `https://www.google.com/search?q=${encodeURIComponent(name)}+documentation`
    };
  });
  
  // Return as array of objects with name and documentationUrl
  return result as Array<{ name: string; documentationUrl: string }>;
}

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();
    const { prompt, projectName: providedProjectName, selectedTechs, selectedTechStack } = requestData;
    const techStack = requestData.techStack;  // Extract separately to fix initialization order

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid prompt. Please provide a text prompt.' },
        { status: 400 }
      );
    }

    // Get client information
    const ip = request.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const fingerprint = createFingerprint(ip, userAgent);

    console.log("Starting project generation process");
    
    try {
      // Step 1: Generate a single-word project name if not provided
      let projectName = providedProjectName;
      if (!projectName) {
        projectName = await projectGenerator.generateProjectName(prompt);
        console.log(`Generated project name: ${projectName}`);
      }
      
      // Step 2: Process tech stack
      // Handle both techStack object and selectedTechStack string
      const userTechStack = requestData.techStack; 
      const selectedTechStackType = requestData.selectedTechStack || 'Other'; 
      console.log(`Selected tech stack type: ${selectedTechStackType}`);
      
      let resolvedTechStack = userTechStack ? { ...userTechStack } : null;
      
      if (!resolvedTechStack) {
        // Generate tech stack if not provided
        console.log("Generating tech stack for " + selectedTechStackType);
        
        // Pass the tech stack type to influence generation based on the selection
        const techStackPrompt = `${prompt}\n\nPreferred tech stack: ${selectedTechStackType}`;
        resolvedTechStack = await projectGenerator.generateTechStack(techStackPrompt);
        
        // Ensure at least a minimal tech stack based on the selection
        if (selectedTechStackType === 'Next.js' && 
            (!resolvedTechStack.frameworks || !resolvedTechStack.frameworks.includes('Next.js'))) {
          resolvedTechStack.frameworks = [...(resolvedTechStack.frameworks || []), 'Next.js'];
          if (!resolvedTechStack.libraries || !resolvedTechStack.libraries.includes('React')) {
            resolvedTechStack.libraries = [...(resolvedTechStack.libraries || []), 'React'];
          }
        } else if (selectedTechStackType === 'Apple' && 
                  (!resolvedTechStack.frameworks || !resolvedTechStack.frameworks.includes('SwiftUI'))) {
          resolvedTechStack.frameworks = [...(resolvedTechStack.frameworks || []), 'SwiftUI'];
          resolvedTechStack.libraries = [...(resolvedTechStack.libraries || []), 'Swift', 'Core Data'];
        } else if (selectedTechStackType === 'CLI' && 
                  (!resolvedTechStack.frameworks || !resolvedTechStack.frameworks.includes('Go'))) {
          resolvedTechStack.frameworks = [...(resolvedTechStack.frameworks || []), 'Go'];
          resolvedTechStack.libraries = [...(resolvedTechStack.libraries || []), 'Cobra', 'BubbleTea'];
        }
      }
      
      // Step 3: Gather comprehensive project context using enhanced search approach
      console.log("Gathering comprehensive project context...");
      const { context: projectResearchContext, links: researchLinks } = 
        await gatherProjectContext(prompt, selectedTechStackType, resolvedTechStack);
      
      console.log(`Gathered ${researchLinks.length} research links and comprehensive context`);
      
      // Include documentation links in the tech stack if available
      if (resolvedTechStack.documentationLinks) {
        console.log('Using existing documentation links in tech stack');
      } else {
        // Create empty documentation links object
        resolvedTechStack.documentationLinks = {};
        
        // Add documentation links for all tech items
        ['frameworks', 'libraries', 'apis', 'tools'].forEach(category => {
          if (resolvedTechStack[category]) {
            resolvedTechStack[category].forEach((tech: string) => {
              // Create a placeholder documentation link
              resolvedTechStack.documentationLinks[tech] = 
                `https://www.google.com/search?q=${encodeURIComponent(tech)}+documentation`;
            });
          }
        });
      }
      
      // Step 4: Generate project content with enhanced context
      console.log("Generating project content with enhanced context...");
      
      // Get OpenRouter API key
      const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    
      if (!openRouterApiKey) {
        return NextResponse.json(
          { error: 'OpenRouter API key not configured on the server.' },
          { status: 500 }
        );
      }
      
      // Define the system prompt for project content generation
      const systemPrompt = `
You are a project content generator that takes a user's project idea and technology stack to create structured project content.
The content should be concise, specific, and focused on the project's overview, core features, architecture, and technologies.

IMPORTANT:
1. The user has selected a tech stack type of "${selectedTechStackType}" - make sure your response explicitly focuses on this technology
2. Your response MUST be valid JSON - do not include markdown formatting or code blocks
3. Your tech list MUST include all items from the provided tech stack, especially the frameworks and libraries

The output should be a JSON object with the following structure:
{
  "overview": [
    "Overview item 1",
    "Overview item 2",
    "Overview item 3",
    "Overview item 4"
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
    "technology1",
    "technology2",
    "technology3",
    "technology4"
  ]
}

Your goal is to help the user implement their project by providing clear, actionable content.
The architecture section should specifically reflect the selected tech stack type (${selectedTechStackType}).
`;

      const techStackJson = JSON.stringify(resolvedTechStack);
      
      // Include the project research context in the prompt
      const fullPrompt = `${systemPrompt}

Project idea: ${prompt}

Technology stack: ${techStackJson}

Research Context:
${projectResearchContext ? projectResearchContext.substring(0, 4000) : ''}

Generate project content:`;

      // Generate the project content by directly calling OpenRouter API
      const contentResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openRouterApiKey}`,
          'HTTP-Referer': 'https://luke-portfolio.vercel.app',
          'X-Title': 'Luke Portfolio',
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.7-sonnet',
          messages: [
            { 
              role: 'system', 
              content: 'You are a project content generator specialized in creating structured JSON responses. Your output must be valid JSON without markdown formatting. Never wrap your JSON in markdown code blocks. Your response should start with { and end with } with no additional text before or after.'
            },
            { role: 'user', content: fullPrompt }
          ],
          temperature: 0.7,
          max_tokens: 2000,
          response_format: { type: 'json_object' }
        }),
      });

      if (!contentResponse.ok) {
        const errorText = await contentResponse.text();
        console.error(`OpenRouter API error: ${contentResponse.status} ${errorText}`);
        return NextResponse.json(
          { error: `OpenRouter API error: ${contentResponse.status}` },
          { status: contentResponse.status }
        );
      }

      const contentData = await contentResponse.json();
      
      // Get the raw content from the LLM response
      let rawContent = contentData.choices[0].message.content;
      
      // Strip markdown formatting if present
      // Check if the content starts with markdown code block indicators and remove them
      rawContent = rawContent.trim();
      if (rawContent.startsWith('```json') || rawContent.startsWith('```')) {
        // Remove opening markdown code block
        rawContent = rawContent.replace(/^```(?:json)?\n/, '');
        // Remove closing markdown code block if present
        rawContent = rawContent.replace(/\n```$/, '');
      }
      
      console.log("Processed content for parsing:", rawContent.substring(0, 100) + "...");
      
      // Parse the cleaned JSON content
      const contentJson = JSON.parse(rawContent);
      
      // Ensure tech items include documentation URLs by merging with tech stack
      type TechItem = string | { name: string; documentationUrl?: string };
      
      const projectContent = {
        ...contentJson,
        tech: contentJson.tech.map((item: TechItem) => {
          const itemName = typeof item === 'string' ? item : 
                          item.name || 'Unknown Technology';
          
          const docUrl = resolvedTechStack.documentationLinks[itemName] || 
            `https://www.google.com/search?q=${encodeURIComponent(itemName)}`;
          
          // Resolve links
          return {
            name: itemName,
            documentationUrl: docUrl,
          };
        }) as Array<{ name: string; documentationUrl: string }>,
      };
      
      // Step 4: Create the basic project structure
      const basicProjectPrompt = `
You are a creative project generator that takes a user's project idea and transforms it into a structured project description. 
The output should be a valid JSON object that strictly follows the format below, without any additional explanation or text outside the JSON.

The project should include:
1. A short, memorable project name (lowercase, no spaces)
2. A single emoji that represents the project
3. A concise description (max 10 words)
4. A source URL (use "#" as placeholder)
5. Content sections for:
   - Overview: the provided overview items
   - Core: the provided core items
   - Architecture: the provided architecture items
   - Tech: the provided tech items (with documentation URLs)

IMPORTANT: 
- Use the provided project content exactly as given
- Use "${projectName}" as the project name (this is required)
- Choose an emoji that accurately represents the project theme
- Make the description concise but descriptive

Project content to use:
${JSON.stringify(projectContent, null, 2)}

Example format:
{
  "project": {
    "id": "${projectName}",
    "name": "${projectName}",
    "emoji": "🔥",
    "description": "concise description of the project",
    "sourceUrl": "#",
    "content": {
      "overview": {
        "title": "overview",
        "items": ["feature 1", "feature 2", "feature 3", "feature 4"]
      },
      "core": {
        "title": "core",
        "items": ["core feature 1", "core feature 2", "core feature 3", "core feature 4"]
      },
      "architecture": {
        "title": "architecture",
        "items": ["architecture point 1", "architecture point 2", "architecture point 3", "architecture point 4"]
      },
      "tech": {
        "title": "tech",
        "items": [
          {"name": "tech1", "documentationUrl": "https://tech1.docs.com"},
          {"name": "tech2", "documentationUrl": "https://tech2.docs.com"}
        ]
      }
    }
  }
}
`;

      // Generate the project structure by directly calling OpenRouter API instead of using projectGenerator
      console.log('Generating project structure...');
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openRouterApiKey}`,
          'HTTP-Referer': 'https://luke-portfolio.vercel.app',
          'X-Title': 'Luke Portfolio',
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.7-sonnet',
          messages: [
            { 
              role: 'system', 
              content: 'You are a project structure generator that creates valid JSON responses. Your output must be raw JSON without any markdown formatting or code blocks. Your response should start with { and end with } with no additional text.'
            },
            { role: 'user', content: basicProjectPrompt }
          ],
          temperature: 0.7,
          max_tokens: 3000,
          response_format: { type: 'json_object' }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenRouter API error: ${response.status} ${errorText}`);
        return NextResponse.json(
          { error: `OpenRouter API error: ${response.status}` },
          { status: response.status }
        );
      }

      const responseData = await response.json();
      
      // Get the raw content from the response
      let content = responseData.choices[0].message.content;
      
      // Strip markdown formatting if present
      if (content.startsWith("```json") || content.startsWith("```")) {
        content = content.replace(/^```json\n|^```\n/, "").replace(/\n```$/, "");
      }
      
      console.log("Processed content for parsing:", content.substring(0, 200) + "...");
      
      const projectResponse = JSON.parse(content);
      
      console.log('Project structure generated successfully');
      
      // Now enrich the tech documentation with Perplexity
      const enrichedTechDocs = await enrichTechDocumentation(projectContent, resolvedTechStack);
      console.log(`Enriched ${enrichedTechDocs.length} tech documentation links with Perplexity`);
      
      // Merge the original tech items with the enriched documentation
      if (enrichedTechDocs.length > 0 && projectResponse.project.content.tech.items) {
        projectResponse.project.content.tech.items = 
          mergeTechItems(projectResponse.project.content.tech.items, enrichedTechDocs);
        console.log('Merged tech items with enriched documentation');
      }
      
      // Extract the primary framework for template selection
      const primaryFramework = selectedTechStackType || 
        (resolvedTechStack.frameworks && 
        resolvedTechStack.frameworks.length > 0 ? 
        resolvedTechStack.frameworks[0] : 'next.js');
      
      // Step 5: Generate the documentation using the primary framework
      console.log(`Generating project documentation for tech stack: ${primaryFramework}`);
      
      // Create an enhanced project content object with research context
      const enhancedProjectContent = {
        ...projectContent,
        researchContext: projectResearchContext,
        researchLinks: researchLinks
      };
      
      const documents = await projectGenerator.generateProjectDocumentation(
        primaryFramework, 
        enhancedProjectContent
      );
      
      // Combine the project and documents into the final response
      const generationResponse = {
        project: projectResponse.project,
        documents: {
          ...documents,
          tech: documents.tech // Ensure tech.md is included
        }
      };
      
      // Save the generated project to the database
      try {
        const savedProject = await prisma.generatedProject.create({
          data: {
            id: projectResponse.project.id,
            name: projectResponse.project.name,
            emoji: projectResponse.project.emoji,
            description: projectResponse.project.description,
            sourceUrl: projectResponse.project.sourceUrl,
            overviewItems: projectResponse.project.content.overview.items,
            coreItems: projectResponse.project.content.core.items,
            architectureItems: projectResponse.project.content.architecture.items,
            techItems: projectResponse.project.content.tech.items.map((item: TechItem) => 
              typeof item === 'string' ? item : item.name
            ),
            techItemsJson: JSON.stringify(projectResponse.project.content.tech.items),
            indexDocument: documents.index,
            designDocument: documents.design,
            codeDocument: documents.code,
            initDocument: documents.init,
            techDocument: documents.tech, // Save tech.md to the database
            userPrompt: prompt,
            userIp: ip,
            userFingerprint: fingerprint
          }
        });
        
        console.log(`Saved project to database with ID: ${savedProject.id}`);
      } catch (dbError) {
        console.error('Error saving project to database:', dbError);
        // Continue even if database save fails
      }
      
      // Process the technology items
      const techStack = projectResponse.project.content.tech.items;
      const processedTechStack = {
        documentationLinks: {} as Record<string, string>,
        frameworks: [] as string[],
        libraries: [] as string[],
        apis: [] as string[],
        tools: [] as string[]
      };
      
      // Process each tech item
      techStack.forEach((item: { name: string; documentationUrl: string }) => {
        const { name, documentationUrl } = item;
        
        // Add to documentation links
        processedTechStack.documentationLinks[name] = documentationUrl;
        
        // Determine category based on name or documentation URL
        // This is a simple heuristic and could be improved
        if (name.toLowerCase().includes('framework') || 
            documentationUrl.includes('framework')) {
          processedTechStack.frameworks.push(name);
        } else if (name.toLowerCase().includes('api') || 
                  documentationUrl.includes('api')) {
          processedTechStack.apis.push(name);
        } else if (name.toLowerCase().includes('tool') || 
                  documentationUrl.includes('tool')) {
          processedTechStack.tools.push(name);
        } else {
          processedTechStack.libraries.push(name);
        }
      });
      
      return NextResponse.json(generationResponse);
    } catch (error) {
      console.error('Error in project generation:', error);
      return NextResponse.json(
        { error: 'Failed to generate project. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to process request. Please try again.' },
      { status: 500 }
    );
  }
}

/**
 * Execute the search plan and gather comprehensive project context
 */
async function gatherProjectContext(
  prompt: string,
  techStackType: string,
  techStack: any
): Promise<{ context: string; links: string[] }> {
  try {
    // Generate search plan
    const searchQueries = await generateProjectSearchPlan(prompt, techStackType, techStack);
    
    // Perform searches with Sonar Reasoning for each query
    const searchResults = [];
    const allLinks: string[] = [];
    
    for (const query of searchQueries) {
      console.log(`Searching with Sonar Reasoning: ${query}`);
      
      try {
        const result = await searchWithSonarReasoning(query);
        searchResults.push(result);
        
        // Extract links from the result
        const linkRegex = /https?:\/\/[^\s)"\]]+/g;
        const matches = result.match(linkRegex);
        if (matches) {
          allLinks.push(...matches);
        }
        
        console.log("Sonar Reasoning search completed successfully");
      } catch (error) {
        console.error(`Error in Sonar search: ${error}`);
      }
    }
    
    // Generate follow-up queries based on initial results using Claude
    console.log("Generating follow-up queries based on initial results...");
    const followUpQueries = await generateFollowUpQueries(searchResults, prompt, techStackType, techStack);
    
    // Run follow-up queries to get deeper information
    console.log("Running follow-up queries for deeper context...");
    const followUpResults = [];
    
    for (const query of followUpQueries) {
      try {
        console.log(`Follow-up query: ${query.substring(0, 60)}...`);
        const result = await searchWithSonarReasoning(query);
        followUpResults.push(result);
        
        // Extract links from the result
        const linkRegex = /https?:\/\/[^\s)"\]]+/g;
        const matches = result.match(linkRegex);
        if (matches) {
          allLinks.push(...matches);
        }
        
        console.log("Sonar Reasoning search completed successfully");
      } catch (error) {
        console.error(`Error in follow-up search: ${error}`);
      }
    }
    
    // Deduplicate links and filter out incomplete or broken URLs
    const filteredLinks = Array.from(new Set(allLinks))
      .filter(link => 
        link.includes('.') && 
        !link.endsWith('.') && 
        !link.includes('...')
      )
      .slice(0, 15); // Limit to top 15 links
    
    // Combine all search results to create a structured context
    const initialContext = searchResults.join('\n\n');
    const followUpContext = followUpResults.join('\n\n');
    
    const projectContext = `
## Technology Best Practices and Architecture Patterns
${initialContext}

## Detailed Implementation Guidance
${followUpContext}
    `.trim();
    
    return {
      context: projectContext,
      links: filteredLinks
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
 * Generate follow-up queries using Claude to create more targeted searches based on initial results
 */
async function generateFollowUpQueries(
  initialResults: string[], 
  prompt: string, 
  techStackType: string,
  techStack: any
): Promise<string[]> {
  try {
    // Get the OpenRouter API key
    const openrouterApiKey = process.env.OPENROUTER_API_KEY;
    
    if (!openrouterApiKey) {
      console.warn('No OpenRouter API key found for follow-up query generation');
      return getDefaultFollowUpQueries(initialResults, prompt, techStackType);
    }
    
    // Extract tech stack items
    const techItems: string[] = [];
    if (techStack) {
      if (techStack.frameworks) techItems.push(...techStack.frameworks);
      if (techStack.libraries) techItems.push(...techStack.libraries);
      if (techStack.apis) techItems.push(...techStack.apis);
      if (techStack.tools) techItems.push(...techStack.tools);
    }
    
    // Create a condensed version of the initial results to feed into Claude
    const condensedResults = initialResults.join('\n\n').substring(0, 4000); // Truncate to avoid token limits
    
    // Create a prompt for Claude to generate follow-up queries
    const followUpPrompt = `
You are a search strategist tasked with analyzing search results and creating follow-up search queries to gather deeper, more specific information for project documentation.

Here are the initial search results:
---
${condensedResults}
---

PROJECT REQUIREMENTS: "${prompt}"
TECH STACK TYPE: "${techStackType}"
${techItems.length > 0 ? `TECH STACK: ${techItems.join(', ')}` : ''}

Your task is to create 3-5 follow-up search queries that will retrieve deeper, more specific information about implementation details, technical challenges, and best practices for this project.

Identify specific technical challenges, architectural patterns, or implementation details that warrant deeper investigation based on the initial search results.

Format your response as a JSON array of strings, each representing a single search query.
Example: ["query 1", "query 2", "query 3"]

Each follow-up query should be highly specific and target a particular technical aspect that deserves deeper exploration.
`;

    // Make API call to Claude
    console.log("Generating follow-up queries with Claude...");
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openrouterApiKey}`,
        'HTTP-Referer': 'https://luke-portfolio.vercel.app',
        'X-Title': 'Luke App',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.7-sonnet',
        messages: [
          { role: 'user', content: followUpPrompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate follow-up queries: ${response.status}`);
    }

    const data = await response.json();
    const followUpContent = data.choices[0].message.content;
    
    try {
      // Parse the JSON response
      const followUpQueries = JSON.parse(followUpContent);
      
      if (Array.isArray(followUpQueries) && followUpQueries.length > 0) {
        console.log("Generated follow-up queries:", followUpQueries);
        return followUpQueries;
      }
    } catch (parseError) {
      console.error("Error parsing follow-up queries:", parseError);
    }
    
    // Fall back to default queries if anything goes wrong
    return getDefaultFollowUpQueries(initialResults, prompt, techStackType);
  } catch (error) {
    console.error("Error generating follow-up queries:", error);
    return getDefaultFollowUpQueries(initialResults, prompt, techStackType);
  }
}

/**
 * Generate default follow-up queries based on keyword extraction if the Claude approach fails
 */
function getDefaultFollowUpQueries(
  initialResults: string[], 
  prompt: string, 
  techStackType: string
): string[] {
  // Extract key concepts using simple keyword extraction
  const allText = initialResults.join(' ');
  const words = allText.split(/\s+/);
  const keywordCounts: Record<string, number> = {};
  
  // Count word occurrences, ignoring common words
  const stopWords = new Set(['and', 'the', 'for', 'in', 'on', 'with', 'to', 'a', 'an', 'of', 'is', 'are', 'that', 'this', 'it', 'as']);
  words.forEach(word => {
    const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (cleanWord.length > 3 && !stopWords.has(cleanWord)) {
      keywordCounts[cleanWord] = (keywordCounts[cleanWord] || 0) + 1;
    }
  });
  
  // Get top keywords
  const topKeywords = Object.entries(keywordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(entry => entry[0]);
  
  // Generate follow-up queries based on top keywords and tech stack
  return topKeywords.map(keyword => 
    `${keyword} implementation best practices for ${techStackType} applications with detailed code examples`
  );
}

/**
 * Search with Perplexity Sonar Reasoning
 */
async function searchWithSonarReasoning(query: string): Promise<string> {
  try {
    // Get OpenRouter API key from environment variable
    const openrouterApiKey = process.env.OPENROUTER_API_KEY;
    
    if (!openrouterApiKey) {
      throw new Error('No OpenRouter API key found in environment variables');
    }
    
    // Use Perplexity via OpenRouter to get search results
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'perplexity/sonar-reasoning',
        messages: [
          {
            role: 'user',
            content: query
          }
        ],
        max_tokens: 4096,
        temperature: 0.2
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openrouterApiKey}`,
          'HTTP-Referer': 'https://luke-portfolio.vercel.app',
          'X-Title': 'Luke Project Generator'
        }
      }
    );
    
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(`Error in Sonar Reasoning search: ${error}`);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      throw new Error(`Sonar Reasoning search failed: ${axiosError.message}`);
    }
    throw error;
  }
} 