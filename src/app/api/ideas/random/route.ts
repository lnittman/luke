import { NextRequest, NextResponse } from 'next/server';
import { projectGenerator } from '@/lib/llm';
import axios, { AxiosError } from 'axios';

export const maxDuration = 60; // Set a 60 second timeout for idea generation

// Function to get current year (hardcoded to 2025 for now)
function getCurrentYear(): number {
  // In a real deployment, this would use new Date().getFullYear()
  // But to match the user's timeline, we're using 2025
  return 2025;
}

// Function to get current month name (hardcoded to March for now)
function getCurrentMonthName(): string {
  // In a real deployment, this would get the actual month
  // But to match the user's timeline, we're using March
  return "March";
}

// Function to perform web search using Perplexity Sonar Reasoning via OpenRouter
async function searchWithSonarReasoning(query: string): Promise<string> {
  try {
    // Get OpenRouter API key from environment variable
    const openrouterApiKey = process.env.OPENROUTER_API_KEY;
    
    if (!openrouterApiKey) {
      console.error('[ERROR] No OpenRouter API key found in environment variables');
      throw new Error('No OpenRouter API key found in environment variables');
    }
    
    console.log(`[SEARCH] Executing Sonar Reasoning query: "${query.substring(0, 100)}..."`);
    
    // Use Perplexity via OpenRouter to get search results
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openrouterApiKey}`,
        'HTTP-Referer': 'https://luke-portfolio.vercel.app',
        'X-Title': 'Luke App',
      },
      body: JSON.stringify({
        model: 'perplexity/sonar-reasoning',
        messages: [
          {
            role: 'user',
            content: query
          }
        ],
        max_tokens: 2048,
        temperature: 0.2
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[ERROR] Sonar Reasoning API error: ${response.status} ${errorText}`);
      throw new Error(`Sonar Reasoning API error: ${response.status}`);
    }
    
    const data = await response.json();
    const result = data.choices[0].message.content;
    
    console.log(`[SEARCH] Sonar Reasoning response received (${result.length} chars)`);
    console.log(`[SEARCH] Sample result: "${result.substring(0, 150)}..."`);
    
    return result;
  } catch (error) {
    console.error(`[ERROR] Sonar Reasoning search failed: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

/**
 * Generate a search plan using Claude to create more effective search queries based on user input
 */
async function generateSearchPlan(userInput: string = ''): Promise<string[]> {
  console.log(`[PLAN] Generating search plan${userInput ? ` for input: "${userInput.substring(0, 100)}..."` : ''}`);
  
  try {
    // Get the OpenRouter API key
    const openrouterApiKey = process.env.OPENROUTER_API_KEY;
    
    if (!openrouterApiKey) {
      console.warn('[WARN] No OpenRouter API key found for search plan generation');
      const defaultQueries = getDefaultSearchQueries(userInput);
      console.log(`[PLAN] Using default search queries: ${JSON.stringify(defaultQueries)}`);
      return defaultQueries;
    }
    
    const currentYear = getCurrentYear();
    const currentMonth = getCurrentMonthName();
    
    // Create a prompt for Claude to generate search queries
    const searchPlanPrompt = `
You are a search strategist tasked with creating the optimal set of 3-4 search queries to gather comprehensive information for generating a viral app idea.

${userInput ? `USER CONTEXT: "${userInput}"` : 'No specific user requirements provided.'}

Current date: ${currentMonth} ${currentYear}

Your task is to create search queries that will retrieve the most valuable information to help create a compelling, relevant app concept.

The search queries should:
1. Cover trending cultural and social phenomena
2. Explore relevant technological innovations and trends
3. Identify market opportunities and user needs
4. ${userInput ? 'Specifically address the user\'s stated requirements' : 'Identify emerging viral potential areas'}

Format your response as a JSON array of strings, each representing a single search query.
Example: ["query 1", "query 2", "query 3"]

Make each query specific and information-dense to maximize the quality of search results.
`;

    console.log(`[LLM INPUT] Claude search plan prompt: "${searchPlanPrompt.substring(0, 150)}..."`);

    // Make API call to Claude
    console.log("[API] Calling Claude to generate search plan...");
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
      const errorText = await response.text();
      console.error(`[ERROR] Claude API error: ${response.status} ${errorText}`);
      throw new Error(`Failed to generate search plan: ${response.status}`);
    }

    const data = await response.json();
    const searchPlanContent = data.choices[0].message.content;
    console.log(`[LLM OUTPUT] Claude search plan response: ${searchPlanContent}`);
    
    try {
      // Parse the JSON response
      const searchPlan = JSON.parse(searchPlanContent);
      
      if (Array.isArray(searchPlan) && searchPlan.length > 0) {
        console.log(`[PLAN] Generated search plan with ${searchPlan.length} queries: ${JSON.stringify(searchPlan)}`);
        return searchPlan;
      } else {
        console.error(`[ERROR] Invalid search plan format: ${searchPlanContent}`);
      }
    } catch (parseError) {
      console.error(`[ERROR] Error parsing search plan: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
      console.error(`[ERROR] Raw content: ${searchPlanContent}`);
    }
    
    // Fall back to default queries if anything goes wrong
    const defaultQueries = getDefaultSearchQueries(userInput);
    console.log(`[PLAN] Falling back to default search queries: ${JSON.stringify(defaultQueries)}`);
    return defaultQueries;
  } catch (error) {
    console.error(`[ERROR] Error generating search plan: ${error instanceof Error ? error.message : String(error)}`);
    const defaultQueries = getDefaultSearchQueries(userInput);
    console.log(`[PLAN] Falling back to default search queries: ${JSON.stringify(defaultQueries)}`);
    return defaultQueries;
  }
}

/**
 * Get default search queries if the search plan generation fails
 */
function getDefaultSearchQueries(userInput: string = ''): string[] {
  const currentYear = getCurrentYear();
  const currentMonth = getCurrentMonthName();
  
  return [
    `trending viral movements and cultural phenomena in ${currentMonth} ${currentYear} in the western world, including social media trends, entertainment, fashion, and lifestyle trends`,
    `cutting-edge technologies and trending GitHub repositories with the most stars in ${currentMonth} ${currentYear}, including new frameworks, libraries, and developer tools`,
    userInput ? `${userInput} trending apps and ideas in ${currentYear}` : `trending business and startup ideas gaining traction in ${currentMonth} ${currentYear}, with specific examples and market analysis`
  ];
}

/**
 * Generate follow-up queries using Claude to create more targeted searches based on initial results
 */
async function generateFollowUpQueries(initialResults: string[], userInput: string = ''): Promise<string[]> {
  console.log(`[FOLLOW-UP] Generating follow-up queries based on ${initialResults.length} search results`);
  
  try {
    // Get the OpenRouter API key
    const openrouterApiKey = process.env.OPENROUTER_API_KEY;
    
    if (!openrouterApiKey) {
      console.warn('[WARN] No OpenRouter API key found for follow-up query generation');
      const defaultQueries = getDefaultFollowUpQueries(initialResults);
      console.log(`[FOLLOW-UP] Using default follow-up queries: ${JSON.stringify(defaultQueries)}`);
      return defaultQueries;
    }
    
    const currentYear = getCurrentYear();
    
    // Create a condensed version of the initial results to feed into Claude
    const condensedResults = initialResults.join('\n\n').substring(0, 4000); // Truncate to avoid token limits
    
    // Create a prompt for Claude to generate follow-up queries
    const followUpPrompt = `
You are a search strategist tasked with analyzing search results and creating follow-up search queries to gather deeper, more specific information for app idea generation.

Here are the initial search results:
---
${condensedResults}
---

${userInput ? `USER CONTEXT: "${userInput}"` : 'No specific user requirements provided.'}

Your task is to create 3-5 follow-up search queries that will retrieve deeper, more specific information about the most promising trends, technologies, or market opportunities identified in the initial search results.

Identify key concepts, technologies, markets, or user needs that warrant deeper investigation based on their innovation potential, market size, or alignment with current trends.

Format your response as a JSON array of strings, each representing a single search query.
Example: ["query 1", "query 2", "query 3"]

Each follow-up query should be highly specific and target a particular aspect that deserves deeper exploration.
`;

    console.log(`[LLM INPUT] Claude follow-up prompt: "${followUpPrompt.substring(0, 150)}..."`);

    // Make API call to Claude
    console.log("[API] Calling Claude to generate follow-up queries...");
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
      const errorText = await response.text();
      console.error(`[ERROR] Claude API error: ${response.status} ${errorText}`);
      throw new Error(`Failed to generate follow-up queries: ${response.status}`);
    }

    const data = await response.json();
    const followUpContent = data.choices[0].message.content;
    console.log(`[LLM OUTPUT] Claude follow-up response: ${followUpContent}`);
    
    try {
      // Parse the JSON response
      const followUpQueries = JSON.parse(followUpContent);
      
      if (Array.isArray(followUpQueries) && followUpQueries.length > 0) {
        console.log(`[FOLLOW-UP] Generated ${followUpQueries.length} follow-up queries: ${JSON.stringify(followUpQueries)}`);
        return followUpQueries;
      } else {
        console.error(`[ERROR] Invalid follow-up queries format: ${followUpContent}`);
      }
    } catch (parseError) {
      console.error(`[ERROR] Error parsing follow-up queries: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
      console.error(`[ERROR] Raw content: ${followUpContent}`);
    }
    
    // Fall back to default queries if anything goes wrong
    const defaultQueries = getDefaultFollowUpQueries(initialResults);
    console.log(`[FOLLOW-UP] Falling back to default follow-up queries: ${JSON.stringify(defaultQueries)}`);
    return defaultQueries;
  } catch (error) {
    console.error(`[ERROR] Error generating follow-up queries: ${error instanceof Error ? error.message : String(error)}`);
    const defaultQueries = getDefaultFollowUpQueries(initialResults);
    console.log(`[FOLLOW-UP] Falling back to default follow-up queries: ${JSON.stringify(defaultQueries)}`);
    return defaultQueries;
  }
}

/**
 * Generate default follow-up queries based on keyword extraction if the Claude approach fails
 */
function getDefaultFollowUpQueries(initialResults: string[]): string[] {
  const currentYear = getCurrentYear();
  
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
  
  // Generate follow-up queries based on top keywords
  return topKeywords.map(keyword => 
    `detailed market analysis and user demographics for ${keyword} apps and services in ${currentYear}, including potential business models and monetization strategies`
  );
}

export async function POST(request: NextRequest) {
  try {
    console.log("[REQUEST] Random idea generation request received");
    
    // Get user input from request, if any
    const { prompt } = await request.json().catch(() => ({ prompt: '' }));
    
    console.log(`[INFO] Generating random app idea${prompt ? ` based on: "${prompt}"` : ''}`);
    
    // Generate tailored search queries based on user input
    const searchQueries = await generateSearchPlan(prompt);
    console.log(`[INFO] Generated ${searchQueries.length} search queries`);
    
    // Perform searches with Sonar Reasoning for each query
    console.log("[INFO] Executing initial search queries...");
    const searchResults = [];
    for (const query of searchQueries) {
      console.log(`[INFO] Processing search query: "${query.substring(0, 100)}..."`);
      
      try {
        const result = await searchWithSonarReasoning(query);
        searchResults.push(result);
        console.log(`[INFO] Search query completed, received ${result.length} chars`);
      } catch (error) {
        console.error(`[ERROR] Error in Sonar search: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    
    console.log(`[INFO] Completed ${searchResults.length} initial searches`);
    
    // Extract links from search results
    const websearchLinks: string[] = [];
    const linkRegex = /https?:\/\/[^\s)"\]]+/g;
    
    searchResults.forEach(result => {
      const matches = result.match(linkRegex);
      if (matches) {
        websearchLinks.push(...matches);
      }
    });
    
    console.log(`[INFO] Extracted ${websearchLinks.length} links from search results`);
    
    // Deduplicate links and filter out incomplete or broken URLs
    const filteredLinks = Array.from(new Set(websearchLinks))
      .filter(link => 
        link.includes('.') && 
        !link.endsWith('.') && 
        !link.includes('...')
      )
      .slice(0, 12);
    
    console.log(`[INFO] Filtered to ${filteredLinks.length} unique valid links`);

    // Generate follow-up queries based on initial results
    console.log("[INFO] Generating follow-up queries based on initial results...");
    const followUpQueries = await generateFollowUpQueries(searchResults, prompt);
    
    // Run follow-up queries to get deeper information
    console.log("[INFO] Executing follow-up queries for deeper context...");
    const followUpResults = [];
    for (const query of followUpQueries) {
      try {
        console.log(`[INFO] Processing follow-up query: "${query.substring(0, 60)}..."`);
        const result = await searchWithSonarReasoning(query);
        followUpResults.push(result);
        console.log(`[INFO] Follow-up query completed, received ${result.length} chars`);
      } catch (error) {
        console.error(`[ERROR] Error in follow-up search: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    
    console.log(`[INFO] Completed ${followUpResults.length} follow-up searches`);
    
    // Combine all search results to create a structured context
    const initialContext = searchResults.join('\n\n');
    const followUpContext = followUpResults.join('\n\n');
    
    const trendContext = `
## General Trends and Context
${initialContext}

## Market Analysis and User Demographics
${followUpContext}
    `.trim();
    
    console.log(`[INFO] Created structured context (${trendContext.length} chars)`);
    
    // LLM prompt template for generating app ideas with references
    const promptTemplate = `
You are a visionary app concept creator who deeply understands current trends, market dynamics, and viral potential as of ${getCurrentMonthName()} ${getCurrentYear()}. Your task is to craft a unique, viral-worthy app concept that combines current cultural trends with technological feasibility.

${trendContext ? '## Comprehensive Trend Analysis\nI\'ve conducted extensive research on current trends. Please carefully analyze this research to inform your idea:' : ''}
${trendContext || `Use your knowledge of current tech trends and viral phenomena as of ${getCurrentMonthName()} ${getCurrentYear()}.`}

${prompt ? `\n## User Interests and Requirements\n${prompt}\n` : ''}

## Relevant Market Resources
${filteredLinks.length > 0 ? filteredLinks.map(link => `- ${link}`).join('\n') : ''}

Based on the comprehensive research provided above, develop a compelling, differentiated app concept that satisfies these criteria:

1. Addresses a genuine user need identified in the trend analysis
2. Leverages a specific technological advantage or innovation
3. Has a clear path to user acquisition and potential virality
4. Demonstrates market timing awareness (why now is the perfect time for this)
5. Includes a short, memorable, distinctive name
6. Features a clear value proposition that can be explained in one sentence
7. Could feasibly be built with the specified tech stack

Your response should be structured as follows:

# **[APP NAME]: [Single-Line Tagline]**

> *[One-sentence value proposition]*

## Concept Overview
[2-3 paragraphs on the core concept, target audience, and market opportunity]

## Core Features
[4-6 bullet points on key features, with 1-2 sentences explaining each]

## User Experience
[Description of the app's interface, user flow, and key interactions]

## Technical Implementation
[High-level technical architecture and implementation considerations]

## Go-To-Market Strategy
[Brief notes on launch strategy, growth tactics, and potential virality mechanisms]

## Resources & Inspiration
[5-7 specific, highly relevant links that would help implement this app, with brief descriptions of why each resource is valuable]

Make your concept feel innovative yet achievable, culturally relevant to ${getCurrentMonthName()} ${getCurrentYear()}, and compelling enough that someone would want to build it immediately.
`;

    console.log(`[LLM INPUT] App idea prompt: "${promptTemplate.substring(0, 200)}..."`);
    
    // Generate idea directly using OpenRouter API
    const openrouterApiKey = process.env.OPENROUTER_API_KEY;
    
    if (!openrouterApiKey) {
      console.error("[ERROR] OpenRouter API key not configured on the server");
      return NextResponse.json(
        { error: 'OpenRouter API key not configured on the server.' },
        { status: 500 }
      );
    }

    // Call OpenRouter API directly
    console.log("[API] Calling Claude to generate app idea...");
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
          { role: 'user', content: promptTemplate }
        ],
        temperature: 0.85,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[ERROR] OpenRouter API error: ${response.status} ${errorText}`);
      return NextResponse.json(
        { error: `OpenRouter API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const randomIdea = data.choices[0].message.content;
    console.log(`[LLM OUTPUT] App idea generated (${randomIdea.length} chars)`);
    console.log(`[LLM OUTPUT] Sample: "${randomIdea.substring(0, 200)}..."`);
    
    // Extract a potential project name from the generated idea
    const headingMatch = randomIdea.match(/^#\s+([^:]+)/m) || 
                          randomIdea.match(/^#\s+\*\*([^*:]+)\*\*/m) ||
                          randomIdea.match(/^#\s+\*\*([^*:]+):/m);
    
    let extractedName = '';
    if (headingMatch && headingMatch[1]) {
      extractedName = headingMatch[1].trim();
      console.log(`[INFO] Extracted project name: "${extractedName}"`);
    } else {
      console.log("[WARN] Could not extract project name from generated idea");
    }
    
    // Prepare search results for response
    const structuredSearchResults = [
      { 
        category: "Cultural & Viral Trends", 
        content: trendContext.substring(0, 1000), 
        links: filteredLinks.slice(0, 4) 
      },
      { 
        category: "Technology Landscape", 
        content: "Based on current technological trends and capabilities.", 
        links: filteredLinks.slice(4, 8) 
      },
      { 
        category: "Market Opportunities", 
        content: "Analysis of viable market opportunities in this space.", 
        links: filteredLinks.slice(8) 
      }
    ];
    
    console.log("[INFO] Preparing response with idea and search results");
    
    // Return all the research data and the generated idea
    return NextResponse.json({
      idea: randomIdea.trim(),
      name: extractedName,
      searchResults: structuredSearchResults
    });
  } catch (error) {
    console.error(`[ERROR] Error generating random app idea: ${error instanceof Error ? error.message : String(error)}`);
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to generate a random app idea. Please try again later.' },
      { status: 500 }
    );
  }
} 