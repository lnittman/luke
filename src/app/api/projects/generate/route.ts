import { projectGenerator } from '@/lib/llm';
import { prisma } from '@/lib/db/prisma';
import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';
import crypto from 'crypto';
import { getOpenRouterHeaders, getOpenRouterKey } from '@/lib/api-keys';
import { log, logInfo, logWarn, logError, LogLevel } from '@/lib/logger';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import Project from '@/types/project';
import Zip from 'jszip';
import { createZipFile } from '@/lib/zip-util';

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
  techStack: any,
  initialTechContext: string = ''
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
    
    // Include initial tech context in the prompt
    const techContextSection = initialTechContext 
      ? `\nUSE THIS TECH CONTEXT TO INFORM YOUR QUERIES:\n${initialTechContext.substring(0, 2000)}\n`
      : '';
    
    // Create a prompt for Claude to generate search queries
    const searchPlanPrompt = `
You are tasked with generating a comprehensive search plan for researching a ${techStackType} project based on the user's requirements.

USER REQUIREMENTS:
${prompt}

TECH STACK TYPE: ${techStackType}
${techContextSection}

Create a search plan consisting of 3-5 specific search queries that will help gather relevant context for implementing this project.

The search queries should focus on:
1. Best practices and architecture patterns for ${techStackType} projects
2. Implementation examples and tutorials for similar applications
3. Technical challenges and solutions specific to this domain
4. Recent developments in the technologies mentioned

FORMAT REQUIREMENTS:
- Return ONLY a valid JSON array of strings, with each string being a search query
- Do NOT include markdown formatting, code blocks, or explanatory text
- Ensure the response can be directly parsed with JSON.parse()
- Example valid response: ["query 1", "query 2", "query 3"]

IMPORTANT: Your entire response must be ONLY the JSON array with no other text.
`;

    // Make API call to Claude
    logInfo("Generating project search plan with Claude...", { tag: "GENERATE" });
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: getOpenRouterHeaders(),
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
      // Check if response is wrapped in markdown code blocks and extract
      let processedContent = searchPlanContent;
      
      // Handle markdown JSON code blocks
      const markdownJsonRegex = /```(json)?\s*(\[[\s\S]*?\])\s*```/;
      const markdownMatch = processedContent.match(markdownJsonRegex);
      
      if (markdownMatch && markdownMatch[2]) {
        processedContent = markdownMatch[2];
        logInfo("Extracted JSON from markdown code block", { tag: "GENERATE" });
      }
      
      // Try to parse the processed content
      const searchPlan = JSON.parse(processedContent);
      
      if (Array.isArray(searchPlan) && searchPlan.length > 0) {
        logInfo("Generated project search plan", { tag: "GENERATE", data: { searchPlan } });
        return searchPlan;
      }
    } catch (parseError) {
      logError("Error parsing search plan", { tag: "GENERATE", data: { parseError } });
      
      // Try to extract arrays manually as fallback
      try {
        const arrayMatch = searchPlanContent.match(/\[\s*"[^"]*"(?:\s*,\s*"[^"]*")*\s*\]/);
        if (arrayMatch) {
          const extractedArray = JSON.parse(arrayMatch[0]);
          logInfo("Manually extracted search plan", { tag: "GENERATE", data: { extractedArray } });
          return extractedArray;
        }
      } catch (fallbackError) {
        logError("Fallback parsing also failed", { tag: "GENERATE", data: { fallbackError } });
      }
    }
    
    // Fall back to default queries if anything goes wrong
    return getDefaultProjectSearchQueries(prompt, techStackType, techStack);
  } catch (error) {
    logError("Error generating project search plan", { tag: "GENERATE", data: { error } });
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
    logInfo("Enriching tech documentation with Perplexity Sonar Reasoning...", { tag: "GENERATE" });
    
    // Extract tech items to enrich
    const techItems = projectContent.tech.map((item: any) => 
      typeof item === 'string' ? item : item.name
    );
    
    // Create a detailed query for Perplexity to get documentation links
    const techQuery = `Provide detailed documentation links and brief explanations for these technologies: ${
      techItems.join(', ')
    }. 
    
    For each technology, provide:
    1. The official documentation URL
    2. A brief description (1-2 sentences)
    3. The type of technology (framework, library, tool, etc.)
    
    Format your response as a JSON array of objects with "name", "description", "url", and "type" fields.
    `;
    
    logInfo("Searching for tech documentation for", { tag: "GENERATE", data: { techItemsLength: techItems.length } });
    logInfo("Query", { tag: "GENERATE", data: { query: techQuery.substring(0, 100) } });
    
    // Use our API route to make the Perplexity request to avoid token exposure
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
      
    const response = await fetch(`${baseUrl}/api/sonar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: techQuery }),
    });
    
    if (!response.ok) {
      log(LogLevel.ERROR, "GENERATE", "Error enriching tech documentation", { status: response.status });
      return [];
    }
    
    log(LogLevel.INFO, "GENERATE", "Received tech documentation response");
    const data = await response.json();
    
    if (!data || !data.content) {
      log(LogLevel.ERROR, "GENERATE", "Invalid response from Perplexity");
      return [];
    }
    
    log(LogLevel.INFO, "GENERATE", "Processing tech documentation content", { contentLength: data.content.length });
    
    // Parse the markdown content to extract structured data
    const enrichedTechItems: Array<{ name: string; documentationUrl: string }> = [];
    
    // Extract sections from markdown
    const sections = data.content.split(/\n## /);
    
    // Process each section to extract tech info
    sections.forEach((section: string, index: number) => {
      if (index === 0 && !section.startsWith('## ')) {
        // Skip the first section if it's not a tech item (likely intro text)
        return;
      }
      
      // Extract tech name from section header (cleanup for first section)
      const sectionLines = section.split('\n');
      const techName = index === 0 ? 
        sectionLines[0].replace(/^## /, '') : 
        sectionLines[0];
      
      // Find URL in the section
      const urlMatch = section.match(/\[Link\]\((https?:\/\/[^\)]+)\)/);
      const documentationUrl = urlMatch ? urlMatch[1] : '';
      
      if (techName && documentationUrl) {
        enrichedTechItems.push({
          name: techName.trim(),
          documentationUrl
        });
        
        log(LogLevel.INFO, "GENERATE", "Enriched tech", { techName: techName.trim(), documentationUrl: documentationUrl.substring(0, 50) });
      }
    });
    
    log(LogLevel.INFO, "GENERATE", "Successfully enriched", { enrichedTechItemsLength: enrichedTechItems.length });
    return enrichedTechItems;
  } catch (error) {
    log(LogLevel.ERROR, "GENERATE", "Error enriching tech documentation", { error });
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        log(LogLevel.ERROR, "GENERATE", "Response data", { data: axiosError.response.data });
        log(LogLevel.ERROR, "GENERATE", "Response status", { status: axiosError.response.status });
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

// Modify the createZipFile function to include tech files
async function createZipFile(project: any, documents: any): Promise<Buffer> {
  const JSZip = require('jszip');
  const zip = new JSZip();
  
  logInfo("Creating ZIP file with project documentation", { tag: "ZIP" });
  
  // Create the main project-docs directory
  const docsDir = zip.folder('project-docs');
  
  // Add basic project info as JSON
  docsDir.file('project.json', JSON.stringify(project, null, 2));
  
  // Add main documentation files to root
  docsDir.file('README.md', documents.readme || `# ${project.name}\n\n${project.description}`);
  docsDir.file('index.md', documents.index);
  
  // Create docs directory with core documentation
  const coreDocsDir = docsDir.folder('docs');
  coreDocsDir.file('overview.md', documents.index || `# ${project.name} Overview`);
  coreDocsDir.file('design.md', documents.design);
  coreDocsDir.file('code.md', documents.code);
  coreDocsDir.file('deployment.md', documents.deployment);
  coreDocsDir.file('README.md', `# Core Documentation\n\nThis directory contains core project documentation for ${project.name}.`);
  
  // Create tech directory with tech documentation
  const techDir = docsDir.folder('tech');
  techDir.file('index.md', documents.tech); // Use tech.md as tech/index.md
  techDir.file('README.md', `# Technology Documentation\n\nThis directory contains documentation for the technologies used in ${project.name}.`);
  
  // Add individual tech files if available
  if (documents.techFiles && Object.keys(documents.techFiles).length > 0) {
    logInfo(`Adding ${Object.keys(documents.techFiles).length} individual tech files to ZIP`, { tag: "ZIP" });
    for (const [filename, content] of Object.entries(documents.techFiles)) {
      techDir.file(filename, content);
    }
  }
  
  // Create system directory with LLM system files
  const systemDir = docsDir.folder('system');
  systemDir.file('init.md', documents.init);
  systemDir.file('instructions.md', documents.instructions);
  systemDir.file('README.md', `# System Files\n\nThis directory contains system files for AI agents working with ${project.name}.`);
  
  // Create memory directory with memory system
  const memoryDir = docsDir.folder('memory');
  memoryDir.file('index.md', documents.memoryIndex);
  memoryDir.file('bank_1.md', documents.memoryBank);
  memoryDir.file('README.md', `# Memory System\n\nThis directory contains the memory system for AI agents working with ${project.name}.`);
  
  // Create prompts directory with role prompts
  const promptsDir = docsDir.folder('prompts');
  
  // Create roles subdirectory for role-specific prompts
  const rolesDir = promptsDir.folder('roles');
  rolesDir.file('architect.md', documents.promptArchitect);
  rolesDir.file('developer.md', documents.promptDeveloper);
  rolesDir.file('designer.md', documents.promptDesigner);
  rolesDir.file('enterprise.md', documents.promptEnterprise);
  rolesDir.file('README.md', `# Role Prompts\n\nThis directory contains role-specific prompts for AI agents working with ${project.name}.`);
  
  // Create commands subdirectory for command prompts
  const commandsDir = promptsDir.folder('commands');
  
  // Add command prompts if available
  if (documents.commandPrompts && Object.keys(documents.commandPrompts).length > 0) {
    logInfo(`Adding ${Object.keys(documents.commandPrompts).length} command prompts to ZIP`, { tag: "ZIP" });
    for (const [filename, content] of Object.entries(documents.commandPrompts)) {
      commandsDir.file(filename, content);
    }
  } else {
    // Add default command prompts if none were generated
    commandsDir.file('setup.md', await loadDefaultCommandPrompt('setup.md', project.name));
    commandsDir.file('testing.md', await loadDefaultCommandPrompt('testing.md', project.name));
    commandsDir.file('deployment.md', await loadDefaultCommandPrompt('deployment.md', project.name));
  }
  
  commandsDir.file('README.md', `# Command Prompts\n\nThis directory contains workflow-specific command prompts for ${project.name}.`);
  
  // Add main README for prompts directory
  promptsDir.file('README.md', `# Prompts\n\nThis directory contains role prompts and command prompts for AI agents working with ${project.name}.`);
  
  // Create architecture directory
  const archDir = docsDir.folder('architecture');
  archDir.file('sample-feature.md', documents.architectureSample);
  archDir.file('components.md', `# ${project.name} Component Architecture\n\nThis document outlines the component architecture for ${project.name}.`);
  archDir.file('README.md', `# Architecture Documentation\n\nThis directory contains architecture documentation for ${project.name}.`);
  
  // Generate zip content
  logInfo("ZIP file structure created, generating buffer", { tag: "ZIP" });
  return await zip.generateAsync({ type: 'nodebuffer' });
}

/**
 * Gather initial tech context from existing documentation
 */
async function gatherInitialTechContext(techStackType: string): Promise<string> {
  try {
    const fs = require('fs');
    const path = require('path');
    
    // Process tech stack type for directory lookup
    const normalizedTechStack = techStackType.toLowerCase()
      .replace('.js', '')
      .replace(/\s+/g, '');
    
    // Load tech index files
    const techDir = path.join(process.cwd(), 'docs', 'tech');
    let context = '';
    
    // 1. Load main tech.md file if it exists
    const techMdPath = path.join(techDir, 'tech.md');
    if (fs.existsSync(techMdPath)) {
      log(LogLevel.INFO, "GENERATE", "Loading tech.md");
      context += fs.readFileSync(techMdPath, 'utf8') + '\n\n';
    }
    
    // 2. Load tech stack specific docs
    const techStackPath = path.join(
      process.cwd(), 
      'docs', 
      'template', 
      'stack',
      normalizedTechStack, 
      'tech.md'
    );
    
    if (fs.existsSync(techStackPath)) {
      log(LogLevel.INFO, "GENERATE", "Loading stack template for", { normalizedTechStack });
      context += fs.readFileSync(techStackPath, 'utf8') + '\n\n';
    }
    
    // 3. Load all individual tech files (up to 10 to avoid context overload)
    if (fs.existsSync(techDir)) {
      const files = fs.readdirSync(techDir)
        .filter((file: string) => file.endsWith('.md') && file !== 'tech.md');
      
      const relevantFiles = files.slice(0, 10);
      log(LogLevel.INFO, "GENERATE", "Loading", { relevantFilesLength: relevantFiles.length });
      
      for (const file of relevantFiles) {
        context += fs.readFileSync(path.join(techDir, file), 'utf8') + '\n\n';
      }
    }
    
    log(LogLevel.INFO, "GENERATE", "Gathered", { contextLength: context.length });
    return context;
  } catch (error) {
    log(LogLevel.ERROR, "GENERATE", "Error gathering tech context", { error });
    return '';
  }
}

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();
    const { prompt, projectName: providedProjectName, selectedTechs } = requestData;
    
    // Explicitly extract tech stack selection
    const selectedTechStackType = requestData.selectedTechStack || 'Other';
    const techStack = requestData.techStack;  // Extract separately to fix initialization order
    
    log(LogLevel.INFO, "GENERATE", "Project generation request received", {
      promptLength: prompt.length,
      projectNameProvided: providedProjectName ? 'Yes' : 'No',
      selectedTechStackType,
      techStackLength: techStack ? Object.keys(techStack).length : 0
    });

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

    log(LogLevel.INFO, "GENERATE", "Starting project generation process");
    
    try {
      // Step 1: Generate a single-word project name if not provided
      let projectName = providedProjectName;
      if (!projectName) {
        projectName = await projectGenerator.generateProjectName(prompt);
        log(LogLevel.INFO, "GENERATE", "Generated project name", { projectName });
      }
      
      // Step 2: Process tech stack
      // Handle both techStack object and selectedTechStack string
      const userTechStack = requestData.techStack; 
      log(LogLevel.INFO, "GENERATE", "Processing tech stack for", { selectedTechStackType });
      
      let resolvedTechStack = userTechStack ? { ...userTechStack } : null;
      
      if (!resolvedTechStack) {
        // Generate tech stack if not provided
        log(LogLevel.INFO, "GENERATE", "Generating tech stack for", { selectedTechStackType });
        
        // Pass the tech stack type to influence generation based on the selection
        const techStackPrompt = `${prompt}\n\nPreferred tech stack: ${selectedTechStackType}`;
        resolvedTechStack = await projectGenerator.generateTechStack(techStackPrompt);
      }
        
      // Force the tech stack to include mandatory frameworks based on user selection
      // This ensures we always honor the user's explicit choice in the UI
      if (selectedTechStackType === 'Next.js') {
        log(LogLevel.INFO, "GENERATE", "Ensuring Next.js tech stack requirements are met");
        resolvedTechStack.frameworks = resolvedTechStack.frameworks || [];
        resolvedTechStack.libraries = resolvedTechStack.libraries || [];
        
        // Make sure Next.js is the first framework
        if (!resolvedTechStack.frameworks.includes('Next.js')) {
          resolvedTechStack.frameworks = ['Next.js', ...resolvedTechStack.frameworks];
        } else {
          // Move Next.js to front if already exists
          resolvedTechStack.frameworks = [
            'Next.js',
            ...resolvedTechStack.frameworks.filter((f: string) => f !== 'Next.js')
          ];
        }
        
        // Ensure React is included
        if (!resolvedTechStack.frameworks.includes('React') && 
            !resolvedTechStack.libraries.includes('React')) {
          resolvedTechStack.libraries = ['React', ...resolvedTechStack.libraries];
        }
      } else if (selectedTechStackType === 'Apple') {
        log(LogLevel.INFO, "GENERATE", "Ensuring Apple tech stack requirements are met");
        resolvedTechStack.frameworks = resolvedTechStack.frameworks || [];
        resolvedTechStack.libraries = resolvedTechStack.libraries || [];
        
        // Make sure SwiftUI is the first framework
        if (!resolvedTechStack.frameworks.includes('SwiftUI')) {
          resolvedTechStack.frameworks = ['SwiftUI', ...resolvedTechStack.frameworks];
        } else {
          // Move SwiftUI to front if already exists
          resolvedTechStack.frameworks = [
            'SwiftUI',
            ...resolvedTechStack.frameworks.filter((f: string) => f !== 'SwiftUI')
          ];
        }
        
        // Ensure Swift and Core Data are included
        const requiredLibraries = ['Swift', 'Core Data'];
        for (const lib of requiredLibraries) {
          if (!resolvedTechStack.libraries.includes(lib)) {
            resolvedTechStack.libraries.push(lib);
          }
        }
      } else if (selectedTechStackType === 'CLI') {
        log(LogLevel.INFO, "GENERATE", "Ensuring CLI tech stack requirements are met");
        resolvedTechStack.frameworks = resolvedTechStack.frameworks || [];
        resolvedTechStack.libraries = resolvedTechStack.libraries || [];
        
        // Make sure Go is the first framework for CLI
        if (!resolvedTechStack.frameworks.includes('Go')) {
          resolvedTechStack.frameworks = ['Go', ...resolvedTechStack.frameworks];
        } else {
          // Move Go to front if already exists
          resolvedTechStack.frameworks = [
            'Go',
            ...resolvedTechStack.frameworks.filter((f: string) => f !== 'Go')
          ];
        }
        
        // Ensure CLI-specific libraries are included
        const cliLibraries = ['Cobra', 'BubbleTea'];
        for (const lib of cliLibraries) {
          if (!resolvedTechStack.libraries.includes(lib)) {
            resolvedTechStack.libraries.push(lib);
          }
        }
      }
      
      // Step 3: Gather comprehensive project context using enhanced search approach
      log(LogLevel.INFO, "GENERATE", "Gathering comprehensive project context...");
      const { context: projectResearchContext, links: researchLinks } = 
        await gatherProjectContext(prompt, selectedTechStackType, resolvedTechStack);
      
      log(LogLevel.INFO, "GENERATE", "Gathered", { researchLinksLength: researchLinks.length });
        
        // Include documentation links in the tech stack if available
        if (resolvedTechStack.documentationLinks) {
          log(LogLevel.INFO, "GENERATE", "Using existing documentation links in tech stack");
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
      log(LogLevel.INFO, "GENERATE", "Generating project content with enhanced context...");
      
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
      const startTime = Date.now();
      const contentResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: getOpenRouterHeaders(),
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
        log(LogLevel.ERROR, "GENERATE", "OpenRouter API error", { status: contentResponse.status, errorText });
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
      
      log(LogLevel.INFO, "GENERATE", "Processed content for parsing", { contentLength: rawContent.length });
      
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
      log(LogLevel.INFO, "GENERATE", "Generating project structure...");
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: getOpenRouterHeaders(),
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
        log(LogLevel.ERROR, "GENERATE", "OpenRouter API error", { status: response.status, errorText });
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
      
      log(LogLevel.INFO, "GENERATE", "Processed content for parsing", { contentLength: content.length });
      
      const projectResponse = JSON.parse(content);
        
        log(LogLevel.INFO, "GENERATE", "Project structure generated successfully");
        
        // Now enrich the tech documentation with Perplexity
        const enrichedTechDocs = await enrichTechDocumentation(projectContent, resolvedTechStack);
        log(LogLevel.INFO, "GENERATE", "Enriched", { enrichedTechDocsLength: enrichedTechDocs.length });
        
        // Merge the original tech items with the enriched documentation
        if (enrichedTechDocs.length > 0 && projectResponse.project.content.tech.items) {
          projectResponse.project.content.tech.items = 
            mergeTechItems(projectResponse.project.content.tech.items, enrichedTechDocs);
          log(LogLevel.INFO, "GENERATE", "Merged tech items with enriched documentation");
        }
        
        // Extract the primary framework for template selection
      const primaryFramework = selectedTechStackType || 
        (resolvedTechStack.frameworks && 
          resolvedTechStack.frameworks.length > 0 ? 
        resolvedTechStack.frameworks[0] : 'next.js');
      
      // Step 5: Generate the documentation using the primary framework
      log(LogLevel.INFO, "GENERATE", "Generating project documentation for tech stack", { primaryFramework });
      
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
      const prisma = new PrismaClient();
      
      try {
        // Convert tech files to JSON for storage
        const techFilesJson = documents.techFiles ? 
          JSON.stringify(documents.techFiles) : 
          null;
        
        // Update the techItems field to be an array of strings
        const techItemsArray = projectResponse.project.content.tech.items.map((item: TechItem) => 
          typeof item === 'string' ? item : item.name
        );
        
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
            techItems: techItemsArray,
            techItemsJson: JSON.stringify(projectResponse.project.content.tech.items),
            indexDocument: documents.index,
            designDocument: documents.design,
            codeDocument: documents.code,
            techDocument: documents.tech,
            initDocument: documents.init,
            techFilesJson: techFilesJson,
            instructionsDocument: documents.instructions,
            memoryIndexDocument: documents.memoryIndex,
            memoryBankDocument: documents.memoryBank,
            promptArchitectDocument: documents.promptArchitect,
            promptDeveloperDocument: documents.promptDeveloper,
            promptDesignerDocument: documents.promptDesigner,
            promptEnterpriseDocument: documents.promptEnterprise,
            architectureSampleDocument: documents.architectureSample,
            deploymentDocument: documents.deployment,
            userPrompt: prompt,
            userIp: ip,
            userFingerprint: fingerprint,
          },
        });
        
        log(LogLevel.INFO, "GENERATE", "Saved project to database", { projectId: savedProject.id });
      } catch (error) {
        log(LogLevel.ERROR, "GENERATE", "Error saving project to database", { error });
      } finally {
        await prisma.$disconnect();
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
      
      logInfo("Project content generation complete", { 
        tag: "GENERATE", 
        data: { durationMs: Date.now() - startTime } 
      });
      
      // After generating project documentation and before creating ZIP file
      
      // Step 6: Generate command prompts
      logInfo("Generating command prompts", { tag: "GENERATE" });
      const commandPrompts = await generateCommandPrompts(
        projectResponse.project.name,
        projectResponse.project.description,
        processedTechStack,
        projectResearchContext
      );
      logInfo(`Generated ${Object.keys(commandPrompts).length} command prompts`, { 
        tag: "GENERATE", 
        data: { commandPromptCount: Object.keys(commandPrompts).length } 
      });
      
      // Add command prompts to the documents object
      const documentsWithCommands = {
        ...documents,
        commandPrompts
      };
      
      // Create the ZIP file with all documentation including command prompts
      const zipBuffer = await createZipFile(projectResponse.project, documentsWithCommands);
      
      // Combine the project and documents into the final response
      const generationResponse = {
        project: projectResponse.project,
        documents: documentsWithCommands,
        zipBuffer: Buffer.from(zipBuffer).toString('base64')
      };
      
      // Save the generated project to the database
      const prisma = new PrismaClient();
      
      try {
        // Convert tech files to JSON for storage
        const techFilesJson = documents.techFiles ? 
          JSON.stringify(documents.techFiles) : 
          null;
        
        // Convert command prompts to JSON for storage
        const commandPromptsJson = commandPrompts ? 
          JSON.stringify(commandPrompts) : 
          null;
        
        // Update the techItems field to be an array of strings
        const techItemsArray = projectResponse.project.content.tech.items.map((item: TechItem) => 
          typeof item === 'string' ? item : item.name
        );
        
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
            techItems: techItemsArray,
            techItemsJson: JSON.stringify(projectResponse.project.content.tech.items),
            indexDocument: documents.index,
            designDocument: documents.design,
            codeDocument: documents.code,
            techDocument: documents.tech,
            initDocument: documents.init,
            techFilesJson: techFilesJson,
            commandPromptsJson: commandPromptsJson, // Add command prompts to database
            instructionsDocument: documents.instructions,
            memoryIndexDocument: documents.memoryIndex,
            memoryBankDocument: documents.memoryBank,
            promptArchitectDocument: documents.promptArchitect,
            promptDeveloperDocument: documents.promptDeveloper,
            promptDesignerDocument: documents.promptDesigner,
            promptEnterpriseDocument: documents.promptEnterprise,
            architectureSampleDocument: documents.architectureSample,
            deploymentDocument: documents.deployment,
            userPrompt: prompt,
            userIp: ip,
            userFingerprint: fingerprint,
          },
        });
        
        logInfo("Saved project to database with command prompts", { 
          tag: "GENERATE", 
          data: { projectId: savedProject.id } 
        });
      } catch (error) {
        logError("Error saving project to database", { tag: "GENERATE", data: error });
      } finally {
        await prisma.$disconnect();
      }
      
      return NextResponse.json(generationResponse);
    } catch (error) {
      log(LogLevel.ERROR, "GENERATE", "Error in project generation", { error: error.message });
      return NextResponse.json(
        { error: 'Failed to generate project. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error) {
    log(LogLevel.ERROR, "GENERATE", "Error processing request", { error });
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
      log(LogLevel.INFO, "GENERATE", "Searching with Sonar Reasoning", { query });
      
      try {
        const result = await searchWithSonarReasoning(query);
        searchResults.push(result);
        
        // Extract links from the result
        const linkRegex = /https?:\/\/[^\s)"\]]+/g;
        const matches = result.match(linkRegex);
        if (matches) {
          allLinks.push(...matches);
        }
        
        log(LogLevel.INFO, "GENERATE", "Sonar Reasoning search completed successfully");
      } catch (error) {
        log(LogLevel.ERROR, "GENERATE", "Error in Sonar search", { error });
      }
    }
    
    // Generate follow-up queries based on initial results using Claude
    log(LogLevel.INFO, "GENERATE", "Generating follow-up queries based on initial results...");
    const followUpQueries = await generateFollowUpQueries(searchResults, prompt, techStackType, techStack);
    
    // Run follow-up queries to get deeper information
    log(LogLevel.INFO, "GENERATE", "Running follow-up queries for deeper context...");
    const followUpResults = [];
    
    for (const query of followUpQueries) {
      try {
        log(LogLevel.INFO, "GENERATE", "Follow-up query", { query: query.substring(0, 60) });
        const result = await searchWithSonarReasoning(query);
        followUpResults.push(result);
        
        // Extract links from the result
        const linkRegex = /https?:\/\/[^\s)"\]]+/g;
        const matches = result.match(linkRegex);
        if (matches) {
          allLinks.push(...matches);
        }
        
        log(LogLevel.INFO, "GENERATE", "Sonar Reasoning search completed successfully");
      } catch (error) {
        log(LogLevel.ERROR, "GENERATE", "Error in follow-up search", { error });
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
    
    log(LogLevel.INFO, "GENERATE", "Research context gathered", { contextLength: projectContext.length });
    
    return {
      context: projectContext,
      links: filteredLinks
    };
  } catch (error) {
    log(LogLevel.ERROR, "GENERATE", "Error gathering project context", { error });
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
      log(LogLevel.WARN, "GENERATE", "No OpenRouter API key found for follow-up query generation");
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
Based on the initial search results, generate follow-up queries to gather more specific information needed for implementing this project.

INITIAL RESULTS:
${initialResults.join('\n\n')}

USER REQUIREMENTS:
${prompt}

TECH STACK TYPE: ${techStackType}

Create 5 follow-up search queries that will help gather more detailed technical information about implementation patterns, best practices, and specific frameworks/libraries relevant to this project.

FORMAT REQUIREMENTS:
- Return ONLY a valid JSON array of strings, with each string being a search query
- Do NOT include markdown formatting, code blocks, or explanatory text
- Ensure the response can be directly parsed with JSON.parse()
- Example valid response: ["query 1", "query 2", "query 3"]

IMPORTANT: Your entire response must be ONLY the JSON array with no other text.
`;

    // Make API call to Claude
    log(LogLevel.INFO, "GENERATE", "Generating follow-up queries with Claude...");
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: getOpenRouterHeaders(),
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
      // Check if response is wrapped in markdown code blocks and extract
      let processedContent = followUpContent;
      
      // Handle markdown JSON code blocks
      const markdownJsonRegex = /```(json)?\s*(\[[\s\S]*?\])\s*```/;
      const markdownMatch = processedContent.match(markdownJsonRegex);
      
      if (markdownMatch && markdownMatch[2]) {
        processedContent = markdownMatch[2];
        log(LogLevel.INFO, "GENERATE", "Extracted JSON from markdown code block");
      }
      
      // Try to parse the processed content
      const followUpQueries = JSON.parse(processedContent);
      
      if (Array.isArray(followUpQueries) && followUpQueries.length > 0) {
        log(LogLevel.INFO, "GENERATE", "Generated follow-up queries", { followUpQueries });
        return followUpQueries;
      }
    } catch (parseError) {
      log(LogLevel.ERROR, "GENERATE", "Error parsing follow-up queries", { parseError });
      
      // Try to extract arrays manually as fallback
      try {
        const arrayMatch = followUpContent.match(/\[\s*"[^"]*"(?:\s*,\s*"[^"]*")*\s*\]/);
        if (arrayMatch) {
          const extractedArray = JSON.parse(arrayMatch[0]);
          log(LogLevel.INFO, "GENERATE", "Manually extracted follow-up queries", { extractedArray });
          return extractedArray;
        }
      } catch (fallbackError) {
        log(LogLevel.ERROR, "GENERATE", "Fallback parsing also failed", { fallbackError });
      }
    }
    
    // Fall back to default queries if anything goes wrong
    return getDefaultFollowUpQueries(initialResults, prompt, techStackType);
  } catch (error) {
    log(LogLevel.ERROR, "GENERATE", "Error generating follow-up queries", { error });
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

// Function to perform web search using Perplexity Sonar Reasoning via OpenRouter
async function searchWithSonarReasoning(query: string): Promise<string> {
  try {
    // Get OpenRouter API key from environment variable
    const openrouterApiKey = getOpenRouterKey();
    
    if (!openrouterApiKey) {
      log(LogLevel.ERROR, "GENERATE", "No OpenRouter API key found");
      throw new Error('No OpenRouter API key found');
    }
    
    log(LogLevel.INFO, "GENERATE", "Executing Sonar Reasoning query", { query: query.substring(0, 100) });
    
    // Use Perplexity via OpenRouter to get search results
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: getOpenRouterHeaders(),
      body: JSON.stringify({
        model: 'perplexity/sonar-reasoning',
        messages: [
          {
            role: 'user',
            content: `You are a helpful internet search engine. Search the web for up-to-date information about: ${query}`
          }
        ],
        max_tokens: 4096,
        temperature: 0.2
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Sonar Reasoning API error: ${response.status} ${errorText}`);
    }
    
    const responseData = await response.json();
    return responseData.choices[0].message.content;
  } catch (error) {
    log(LogLevel.ERROR, "GENERATE", "Sonar Reasoning search failed", { error });
    if (error instanceof AxiosError) {
      throw new Error(`Sonar Reasoning API error: ${error.response?.status} ${JSON.stringify(error.response?.data)}`);
    } else {
      throw new Error(`Sonar Reasoning error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

// Types for command prompt generation
interface CommandPromptPlan {
  baseCommandPrompts: Array<{
    filename: string;
    rationale: string;
    sections: string[];
    techConsiderations: string;
  }>;
  projectSpecificPrompts: Array<{
    filename: string;
    rationale: string;
    sections: string[];
    techConsiderations: string;
  }>;
}

// Type for tech items in project response
interface TechItem {
  name: string;
  documentationUrl?: string;
}

// Constants for command prompt generation
const TEMPLATE_DIR = path.join(process.cwd(), 'docs', 'template');

/**
 * Generate command prompts for the project
 * 
 * This function implements the command prompt generation workflow described in the 
 * architecture documentation. It generates both base command prompts (setup, testing, deployment)
 * and project-specific command prompts based on the project details and tech stack.
 */
async function generateCommandPrompts(
  projectName: string,
  projectDescription: string,
  techStack: any,
  researchContext: string
): Promise<Record<string, string>> {
  logInfo(`Generating command prompts for ${projectName}`, { tag: 'CMD_PROMPTS' });
  
  try {
    // Step 1: Generate command prompt plan using Claude
    const commandPromptPlan = await generateCommandPromptPlan(
      projectName,
      projectDescription,
      techStack,
      researchContext
    );
    
    // Step 2: Generate base command prompts
    const baseCommandPrompts: Record<string, string> = {};
    
    logInfo(`Generating ${commandPromptPlan.baseCommandPrompts.length} base command prompts`, { tag: 'CMD_PROMPTS' });
    for (const promptInfo of commandPromptPlan.baseCommandPrompts) {
      const content = await generateBaseCommandPrompt(
        promptInfo.filename,
        projectName,
        techStack,
        promptInfo.sections,
        promptInfo.techConsiderations
      );
      
      baseCommandPrompts[promptInfo.filename] = content;
      logInfo(`Generated base command prompt: ${promptInfo.filename}`, { tag: 'CMD_PROMPTS' });
    }
    
    // Step 3: Generate project-specific command prompts
    const projectSpecificPrompts: Record<string, string> = {};
    
    logInfo(`Generating ${commandPromptPlan.projectSpecificPrompts.length} project-specific command prompts`, { tag: 'CMD_PROMPTS' });
    for (const promptInfo of commandPromptPlan.projectSpecificPrompts) {
      const content = await generateProjectSpecificCommandPrompt(
        promptInfo.filename,
        projectName,
        projectDescription,
        techStack,
        researchContext,
        promptInfo.rationale,
        promptInfo.sections
      );
      
      projectSpecificPrompts[promptInfo.filename] = content;
      logInfo(`Generated project-specific command prompt: ${promptInfo.filename}`, { tag: 'CMD_PROMPTS' });
    }
    
    // Step 4: Combine all command prompts
    return {
      ...baseCommandPrompts,
      ...projectSpecificPrompts
    };
  } catch (error) {
    logError(`Error generating command prompts: ${error}`, { tag: 'CMD_PROMPTS' });
    
    // Fallback: Return minimal command prompts
    return {
      'setup.md': await loadDefaultCommandPrompt('setup.md', projectName),
      'testing.md': await loadDefaultCommandPrompt('testing.md', projectName),
      'deployment.md': await loadDefaultCommandPrompt('deployment.md', projectName)
    };
  }
}

/**
 * Generate command prompt plan using Claude
 */
async function generateCommandPromptPlan(
  projectName: string,
  projectDescription: string,
  techStack: any, 
  researchContext: string
): Promise<CommandPromptPlan> {
  logInfo(`Generating command prompt plan for ${projectName}`, { tag: 'CMD_PROMPTS' });
  
  try {
    // Construct the prompt for Claude
    const prompt = `
      You are an expert software engineering workflow architect.
      Given the following project details and tech stack, determine the essential command prompts
      that should be created to guide developers through common workflows for this project.
      
      PROJECT NAME: ${projectName}
      
      PROJECT DESCRIPTION: 
      ${projectDescription}
      
      TECH STACK:
      ${JSON.stringify(techStack, null, 2)}
      
      RESEARCH CONTEXT:
      ${researchContext.substring(0, 2000)}... (truncated)
      
      For each command prompt:
      1. Provide a filename (e.g., "database-migrations.md")
      2. Explain why this prompt is necessary for this project
      3. Outline the key sections and commands that should be included
      4. Note any tech stack-specific considerations
      
      Output your response as valid JSON in the following format:
      {
        "baseCommandPrompts": [
          {
            "filename": "setup.md",
            "rationale": "...",
            "sections": ["...", "..."],
            "techConsiderations": "..."
          },
          ...
        ],
        "projectSpecificPrompts": [
          {
            "filename": "custom-workflow.md",
            "rationale": "...",
            "sections": ["...", "..."],
            "techConsiderations": "..."
          },
          ...
        ]
      }
    `;
    
    // Call OpenRouter API with Claude-3.7-sonnet
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: getOpenRouterHeaders(),
      body: JSON.stringify({
        model: 'anthropic/claude-3.7-sonnet',
        messages: [
          { 
            role: 'system', 
            content: 'You are a workflow architect expert that creates JSON responses. Your output must be raw JSON without any markdown formatting or code blocks.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 4000,
        response_format: { type: 'json_object' }
      }),
    });
    
    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }
    
    const responseData = await response.json();
    const content = responseData.choices[0].message.content;
    
    // Parse the response
    const plan = JSON.parse(content);
    
    // Ensure the plan has the expected structure
    if (!plan.baseCommandPrompts || !plan.projectSpecificPrompts) {
      throw new Error('Invalid command prompt plan format');
    }
    
    logInfo(`Command prompt plan generated successfully with ${plan.baseCommandPrompts.length} base prompts and ${plan.projectSpecificPrompts.length} project-specific prompts`, { tag: 'CMD_PROMPTS' });
    
    return plan;
  } catch (error) {
    logError(`Error generating command prompt plan: ${error}`, { tag: 'CMD_PROMPTS' });
    
    // Return a default plan if generation fails
    return {
      baseCommandPrompts: [
        {
          filename: 'setup.md',
          rationale: 'Essential for setting up the project environment and dependencies',
          sections: ['Environment Setup', 'Dependencies Installation', 'Configuration', 'Development Server'],
          techConsiderations: 'Adjust installation commands based on the tech stack'
        },
        {
          filename: 'testing.md',
          rationale: 'Provides guidance on testing the project components',
          sections: ['Unit Testing', 'Integration Testing', 'End-to-End Testing', 'Performance Testing'],
          techConsiderations: 'Include stack-specific testing frameworks and tools'
        },
        {
          filename: 'deployment.md',
          rationale: 'Instructions for deploying the project to production environments',
          sections: ['Build Process', 'Environment Variables', 'Deployment Process', 'Post-Deployment Verification'],
          techConsiderations: 'Include hosting platform-specific deployment instructions'
        }
      ],
      projectSpecificPrompts: []
    };
  }
}

/**
 * Generate base command prompt using templates and tech-specific details
 */
async function generateBaseCommandPrompt(
  filename: string,
  projectName: string,
  techStack: any,
  sections: string[],
  techConsiderations: string
): Promise<string> {
  logInfo(`Generating base command prompt for ${filename}`, { tag: 'CMD_PROMPTS' });
  
  try {
    // Load the base template for this command prompt type
    const templatePath = path.join(TEMPLATE_DIR, 'prompts', 'commands', filename);
    let template = '';
    
    if (fs.existsSync(templatePath)) {
      template = fs.readFileSync(templatePath, 'utf8');
      logInfo(`Loaded template for ${filename} from filesystem`, { tag: 'CMD_PROMPTS' });
    } else {
      // If template doesn't exist, use a generic template
      template = `# ${filename.replace('.md', '').toUpperCase()} Commands\n\nThis document provides commands for ${filename.replace('.md', '')} the project.\n\n`;
      logInfo(`Using generic template for ${filename}`, { tag: 'CMD_PROMPTS' });
    }
    
    // Replace placeholders
    template = template.replace(/\[PROJECT_NAME\]/g, projectName);
    
    // Use Claude to generate tech-specific content based on template and tech considerations
    const generationPrompt = `
      You're creating a command prompt document for ${filename.replace('.md', '')} workflows.
      
      PROJECT: ${projectName}
      
      TECH STACK: ${JSON.stringify(techStack, null, 2)}
      
      TECH CONSIDERATIONS: ${techConsiderations}
      
      SECTIONS TO INCLUDE: ${sections.join(', ')}
      
      BASE TEMPLATE:
      ${template}
      
      Your task is to enhance this template with:
      1. Project-specific content based on the project name
      2. Tech-specific commands and examples based on the tech stack
      3. Detailed guidance for each of these sections: ${sections.join(', ')}
      4. Consider the tech-specific considerations mentioned above
      
      The final document should be comprehensive, focused on practical commands and workflows, 
      and tailored to this specific project's tech stack.
      
      Return ONLY the enhanced markdown document, without any surrounding text or explanation.
    `;
    
    // Call OpenRouter API with Claude
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: getOpenRouterHeaders(),
      body: JSON.stringify({
        model: 'anthropic/claude-3.7-sonnet',
        messages: [
          { role: 'user', content: generationPrompt }
        ],
        temperature: 0.3,
        max_tokens: 4000
      }),
    });
    
    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }
    
    const responseData = await response.json();
    const finalContent = responseData.choices[0].message.content;
    
    logInfo(`Base command prompt for ${filename} generated successfully`, { tag: 'CMD_PROMPTS' });
    
    return finalContent;
  } catch (error) {
    logError(`Error generating base command prompt for ${filename}: ${error}`, { tag: 'CMD_PROMPTS' });
    
    // If error occurs, return the original template with minimal substitutions
    return await loadDefaultCommandPrompt(filename, projectName);
  }
}

/**
 * Generate project-specific command prompt
 */
async function generateProjectSpecificCommandPrompt(
  filename: string,
  projectName: string,
  projectDescription: string,
  techStack: any,
  researchContext: string,
  rationale: string,
  sections: string[]
): Promise<string> {
  logInfo(`Generating project-specific command prompt for ${filename}`, { tag: 'CMD_PROMPTS' });
  
  try {
    // Determine the specific domain based on filename
    const domain = getDomainFromFilename(filename);
    
    // Get a summary of the tech stack for the prompt
    const techStackSummary = getTechStackSummary(techStack);
    
    // Construct the prompt for Claude
    const prompt = `
      You are an expert in ${domain} development workflows.
      Create a comprehensive command prompt document that guides developers through
      ${filename.replace('.md', '')} workflows for a ${projectName} project using ${techStackSummary}.
      
      The document should:
      1. Explain the purpose of these commands
      2. Provide step-by-step instructions
      3. Include example commands with explanations
      4. Cover common issues and troubleshooting
      5. Link to relevant documentation files (design.md, tech docs, etc.)
      
      TECH STACK DETAILS:
      ${JSON.stringify(techStack, null, 2)}
      
      PROJECT DESCRIPTION:
      ${projectDescription}
      
      RATIONALE FOR THIS DOCUMENT:
      ${rationale}
      
      KEY SECTIONS TO INCLUDE:
      ${sections.join('\n')}
      
      RESEARCH FINDINGS:
      ${researchContext.substring(0, 1500)}... (truncated)
      
      Format the document following this structure:
      
      # [Title: Workflow Name] Commands
      
      > Brief description of what these commands help accomplish
      
      ## Overview
      
      [Explain the purpose and importance of these commands]
      
      ## Prerequisites
      
      [List any requirements before using these commands]
      
      ## Command Categories
      
      ### [Category 1]
      
      \`\`\`bash
      # Command example
      command --option value
      \`\`\`
      
      [Explanation of what this command does]
      
      ### [Category 2]
      
      ...
      
      ## Troubleshooting
      
      ### Common Issues
      
      1. **[Issue 1]**
         [Solution]
      
      2. **[Issue 2]**
         [Solution]
      
      Return ONLY the markdown document, without any surrounding text or explanation.
    `;
    
    // Call OpenRouter API with Claude
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: getOpenRouterHeaders(),
      body: JSON.stringify({
        model: 'anthropic/claude-3.7-sonnet',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 4000
      }),
    });
    
    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }
    
    const responseData = await response.json();
    const content = responseData.choices[0].message.content;
    
    logInfo(`Project-specific command prompt for ${filename} generated successfully`, { tag: 'CMD_PROMPTS' });
    
    return content;
  } catch (error) {
    logError(`Error generating project-specific command prompt for ${filename}: ${error}`, { tag: 'CMD_PROMPTS' });
    
    // Create a minimal fallback document
    return `# ${filename.replace('.md', '').toUpperCase()} Commands for ${projectName}

> This document provides guidance for ${filename.replace('.md', '')} workflows.

## Overview

These commands help with ${filename.replace('.md', '')} operations for the ${projectName} project.

## Prerequisites

- Project setup completed
- Appropriate permissions and access

## Commands

\`\`\`bash
# Example command for ${filename.replace('.md', '')}
echo "Replace with actual commands for ${projectName}"
\`\`\`

## Troubleshooting

If you encounter issues, refer to the project documentation or contact the development team.
`;
  }
}

/**
 * Helper function to extract domain from filename
 */
function getDomainFromFilename(filename: string): string {
  const name = filename.replace('.md', '');
  
  const domainMap: Record<string, string> = {
    'database-migrations': 'database management',
    'authentication': 'user authentication',
    'state-management': 'state management',
    'api-integration': 'API integration',
    'performance-optimization': 'performance optimization',
    'ci-cd': 'CI/CD',
    'debugging': 'debugging and troubleshooting'
  };
  
  return domainMap[name] || name.replace(/-/g, ' ');
}

/**
 * Helper function to get a summary of the tech stack
 */
function getTechStackSummary(techStack: any): string {
  if (!techStack) return 'modern technologies';
  
  const technologies = [];
  
  if (techStack.frameworks && techStack.frameworks.length > 0) {
    technologies.push(...techStack.frameworks);
  }
  
  if (techStack.libraries && techStack.libraries.length > 0) {
    technologies.push(...techStack.libraries.slice(0, 2));
  }
  
  if (technologies.length === 0 && techStack.tools && techStack.tools.length > 0) {
    technologies.push(...techStack.tools.slice(0, 2));
  }
  
  if (technologies.length === 0) {
    return 'modern technologies';
  }
  
  return technologies.join(', ');
}

/**
 * Load a default command prompt template with minimal substitutions
 */
async function loadDefaultCommandPrompt(filename: string, projectName: string): Promise<string> {
  try {
    const templatePath = path.join(TEMPLATE_DIR, 'prompts', 'commands', filename);
    
    if (fs.existsSync(templatePath)) {
      const template = fs.readFileSync(templatePath, 'utf8');
      return template.replace(/\[PROJECT_NAME\]/g, projectName);
    }
    
    // If template doesn't exist, return a minimal document
    return `# ${filename.replace('.md', '').toUpperCase()} Commands for ${projectName}

This document provides guidance for ${filename.replace('.md', '')} operations in the ${projectName} project.

## Basic Commands

\`\`\`bash
# Example command
echo "Replace with actual commands for ${projectName}"
\`\`\`

## Common Workflows

1. **First workflow**
   - Step 1: Description
   - Step 2: Description

2. **Second workflow**
   - Step 1: Description
   - Step 2: Description
`;
  } catch (error) {
    logError(`Error loading default command prompt for ${filename}: ${error}`, { tag: 'CMD_PROMPTS' });
    
    // Return minimal content
    return `# ${filename.replace('.md', '').toUpperCase()} Commands for ${projectName}

This document provides basic guidance for ${filename.replace('.md', '')} operations.
`;
  }
} 