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
 * Process the search response from Sonar
 */
function processSearchResponse(responseText: string): { content: string } {
  console.log(`[SEARCH] Processing search response of ${responseText.length} chars`);
  
  try {
    // For now, just return the full content
    // In the future, we could extract key insights, links, etc.
    return {
      content: responseText
    };
  } catch (error) {
    console.error(`[SEARCH] Error processing search response: ${error}`);
    return {
      content: `Error processing response: ${responseText.substring(0, 200)}...`
    };
  }
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
      console.log(`[SEARCH] Tech context length: ${techContext?.length || 0} chars`);
      console.log(`[SEARCH] Tech stack provided: ${techStack ? 'yes' : 'no'}`);
      
      const searchStartTime = Date.now();
      
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
      for (let i = 0; i < queries.length; i++) {
        console.log(`[SEARCH] Query ${i+1}: ${queries[i].substring(0, 100)}...`);
      }
      
      // Get the OpenRouter API key from environment variable
      const openrouterApiKey = process.env.OPENROUTER_API_KEY;
      
      if (!openrouterApiKey) {
        console.error('[SEARCH] No OpenRouter API key found in environment variables');
        await writer.write(encoder.encode(JSON.stringify({
          category: 'Error',
          content: 'No OpenRouter API key found in environment variables',
        })));
        await writer.close();
        return response;
      }
      
      // Start processing queries one by one
      for (let i = 0; i < queries.length; i++) {
        const query = queries[i];
        const queryStartTime = Date.now();
        console.log(`[SEARCH] Processing query ${i+1}/${queries.length}: "${query.substring(0, 100)}..."`);
        
        try {
          // Send the query to the OpenRouter API using the Sonar model
          const sonarResponse = await axios.post(
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
          
          const responseTime = Date.now() - queryStartTime;
          
          // Process the response
          if (sonarResponse.data && 
              sonarResponse.data.choices && 
              sonarResponse.data.choices[0] && 
              sonarResponse.data.choices[0].message && 
              sonarResponse.data.choices[0].message.content) {
            
            const content = sonarResponse.data.choices[0].message.content;
            console.log(`[SEARCH] Sonar response received (${content.length} chars) in ${responseTime}ms`);
            console.log(`[SEARCH] Sample result: "${content.substring(0, 100)}..."`);
            
            // Extract useful info from the sonar response
            const processed = processSearchResponse(content);
            
            // Send the response back to the client
            await writer.write(encoder.encode(JSON.stringify({
              category: `Search ${i+1}`,
              content: processed.content,
              responseTime
            })));
          } else {
            console.error('[SEARCH] Unexpected response format from OpenRouter');
            await writer.write(encoder.encode(JSON.stringify({
              category: `Search Error ${i+1}`,
              content: 'Error: Unexpected response format',
              responseTime
            })));
          }
        } catch (error) {
          console.error(`[SEARCH] Error executing query ${i+1}:`, error);
          
          // Try to send error details back to client
          let errorMessage = 'Unknown error';
          if (error instanceof AxiosError) {
            errorMessage = error.response?.data?.error?.message || error.message;
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }
          
          await writer.write(encoder.encode(JSON.stringify({
            category: `Search Error ${i+1}`,
            content: `Error: ${errorMessage}`,
            responseTime: Date.now() - queryStartTime
          })));
        }
        
        // Add a small delay between queries to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Calculate and log the total search time
      const totalSearchTime = Date.now() - searchStartTime;
      console.log(`[SEARCH] Completed all searches in ${totalSearchTime}ms`);
      
      // Send a completion message
      await writer.write(encoder.encode(JSON.stringify({
        category: 'Complete',
        content: `Completed ${queries.length} searches in ${totalSearchTime}ms`,
        totalTime: totalSearchTime
      })));
      
      // Close the writer
      await writer.close();
    } catch (error) {
      // Handle errors
      console.error('[SEARCH] Error processing search request:', error);
      
      try {
        // Try to send error details back to client
        let errorMessage = 'Unknown error';
        if (error instanceof AxiosError) {
          errorMessage = error.response?.data?.error?.message || error.message;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        await writer.write(encoder.encode(JSON.stringify({
          category: 'Error',
          content: `Error: ${errorMessage}`
        })));
        await writer.close();
      } catch (finalError) {
        console.error('[SEARCH] Failed to send error response:', finalError);
      }
    }
  })();
  
  return response;
} 