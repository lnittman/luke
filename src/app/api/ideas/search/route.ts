import { NextRequest } from 'next/server';
import axios, { AxiosError } from 'axios';

export const maxDuration = 30; // 30 second timeout for search

// Function to get current year (hardcoded to 2025 for now)
function getCurrentYear(): number {
  return 2025;
}

// Function to get current month name (hardcoded to March for now)
function getCurrentMonthName(): string {
  return "March";
}

/**
 * API route that streams search results back to the client as they come in
 * This allows for a more interactive experience with real-time updates
 */
export async function POST(request: NextRequest) {
  // Create a streaming response
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  
  // Start the response
  const response = new Response(stream.readable, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
  
  // Process the request in the background
  (async () => {
    try {
      // Parse the request body
      const { 
        techStack, 
        techContext, 
        userInput,
        enhancementMode = 'generate'
      } = await request.json();
      
      // Get current year for relevant queries
      const currentYear = getCurrentYear();
      const currentMonth = getCurrentMonthName();
      
      console.log(`[SEARCH] Processing search with mode: ${enhancementMode}, input: ${userInput?.substring(0, 50) || 'none'}`);
      
      // Create context strings
      const userContext = userInput?.trim() 
        ? `Based on user input: ${userInput}` 
        : '';
      
      // Create search queries based on enhancement mode and user input
      let queries: string[] = [];
      
      switch (enhancementMode) {
        case 'expand':
          // For short inputs that need expansion, focus on the specific concept
          queries = [
            `${userInput} app concept details, features, and similar successful apps in ${currentMonth} ${currentYear}`,
            `cutting-edge technologies and frameworks for building ${userInput} apps in ${currentMonth} ${currentYear}`,
            `market analysis and user demographics for ${userInput} apps and services in ${currentYear}`
          ];
          break;
          
        case 'refine':
          // For longer inputs that need refinement, focus on improving the existing concept
          queries = [
            `best practices and design patterns for ${userInput.split(' ').slice(0, 3).join(' ')} apps in ${currentMonth} ${currentYear}`,
            `technical implementation strategies for ${userInput.split(' ').slice(0, 3).join(' ')} applications using modern frameworks`,
            `market positioning and competitive analysis for ${userInput.split(' ').slice(0, 3).join(' ')} products in ${currentYear}`
          ];
          break;
          
        case 'generate':
        default:
          // For generating from scratch, use broader trend research
          queries = [
            `trending viral movements and cultural phenomena in ${currentMonth} ${currentYear} in the western world, including social media trends, celebrity news, entertainment, fashion, and lifestyle trends`,
            `cutting-edge technologies and trending GitHub repositories with the most stars in ${currentMonth} ${currentYear}, including new frameworks, libraries, and developer tools`,
            userContext ? `${userContext} trending apps and ideas in ${currentYear}` : `trending business and startup ideas gaining traction in ${currentMonth} ${currentYear}, with specific examples and market analysis`
          ];
          break;
      }
      
      console.log(`[SEARCH] Generated ${queries.length} search queries for mode: ${enhancementMode}`);
      
      // Get the OpenRouter API key from environment variable
      const openrouterApiKey = process.env.OPENROUTER_API_KEY;
      
      if (!openrouterApiKey) {
        console.error('[SEARCH] No OpenRouter API key found in environment variables');
        await writer.write(encoder.encode(JSON.stringify({
          category: 'Error',
          content: 'No OpenRouter API key found in environment variables',
          links: []
        })));
        await writer.close();
        return;
      }
      
      // Process each query in sequence (not parallel, to stream results)
      for (let i = 0; i < queries.length; i++) {
        const query = queries[i];
        let categoryName = '';
        
        // Set category name based on enhancement mode and query index
        if (enhancementMode === 'expand') {
          if (i === 0) categoryName = 'Concept Exploration';
          else if (i === 1) categoryName = 'Technical Implementation';
          else categoryName = 'Market Analysis';
        } else if (enhancementMode === 'refine') {
          if (i === 0) categoryName = 'Design Best Practices';
          else if (i === 1) categoryName = 'Technical Architecture';
          else categoryName = 'Market Positioning';
        } else {
          if (i === 0) categoryName = 'Cultural & Viral Trends';
          else if (i === 1) categoryName = 'Technology Trends';
          else categoryName = 'Startup & Business Trends';
        }
        
        try {
          console.log(`[SEARCH] Searching with Sonar Reasoning: ${query.substring(0, 100)}...`);
          
          const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
              model: 'perplexity/sonar-reasoning',
              messages: [
                {
                  role: 'system',
                  content: `You are a research assistant that provides accurate, factual information about the latest global trends, viral phenomena, and cutting-edge technologies as of ${getCurrentMonthName()} ${getCurrentYear()}. Focus on cultural, social, and technological movements that are currently trending in the western world. Include relevant links to your sources and provide comprehensive, detailed information.`
                },
                {
                  role: 'user',
                  content: `Research the following topic thoroughly and provide detailed information with multiple relevant URLs to sources: ${query}. Focus on the most current information available as of ${getCurrentMonthName()} ${getCurrentYear()}. Include specific examples, statistics if available, and explanations of why these trends matter.`
                }
              ],
              max_tokens: 2048,
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
          
          console.log(`[SEARCH] Sonar Reasoning search completed successfully for "${categoryName}"`);
          
          // Extract links from the response content
          const content = response.data.choices[0].message.content;
          const linkRegex = /https?:\/\/[^\s)"\]]+/g;
          const links = content.match(linkRegex) || [];
          
          console.log(`[SEARCH] Extracted ${links.length} links from search results`);
          
          // Stream the result back to the client
          await writer.write(encoder.encode(JSON.stringify({
            category: categoryName,
            content: content.slice(0, 500) + '...', // Send a preview of the content
            links: links.slice(0, 10) // Send up to 10 links
          })));
          
        } catch (error) {
          console.error(`[ERROR] Error searching with Sonar Reasoning for "${categoryName}": ${error instanceof Error ? error.message : 'Unknown error'}`);
          
          // Stream error information
          await writer.write(encoder.encode(JSON.stringify({
            category: categoryName,
            content: `Error searching for trends: ${error instanceof Error ? error.message : 'Unknown error'}`,
            links: []
          })));
        }
      }
      
      // Close the stream when all searches are complete
      await writer.close();
      
    } catch (error) {
      console.error(`[ERROR] Error in search streaming: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      try {
        // Stream error information
        await writer.write(encoder.encode(JSON.stringify({
          category: 'Error',
          content: `An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`,
          links: []
        })));
        await writer.close();
      } catch (writeError) {
        console.error(`[ERROR] Error writing to stream: ${writeError instanceof Error ? writeError.message : 'Unknown error'}`);
      }
    }
  })();
  
  return response;
} 