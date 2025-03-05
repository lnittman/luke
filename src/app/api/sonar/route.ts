import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getOpenRouterHeaders, getOpenRouterKey } from '@/lib/api-keys';
import { logInfo, logError, logWarn } from '@/lib/logger';
import { retryFetch } from '@/lib/api-utils';

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
 * Process the search response to extract structured content
 */
function processSearchResponse(responseText: string): { content: string } {
  logInfo(`Processing search response`, { 
    tag: 'SONAR', 
    data: { preview: responseText.substring(0, 150) + '...' }
  });
  
  try {
    // First try to parse as JSON
    let resources;
    try {
      resources = JSON.parse(responseText);
      logInfo(`Successfully parsed JSON response`, { 
        tag: 'SONAR', 
        data: { resourceCount: resources.length }
      });
    } catch (e) {
      // Try to extract JSON from markdown code blocks if parsing fails
      logWarn('JSON parse failed, trying to extract from response text', { tag: 'SONAR' });
      
      // Sometimes the response might be wrapped in markdown code blocks
      const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          resources = JSON.parse(jsonMatch[1]);
          logInfo(`Extracted JSON from code block`, { 
            tag: 'SONAR', 
            data: { resourceCount: resources.length }
          });
        } catch (e2) {
          logWarn('Failed to parse extracted JSON from code block', { tag: 'SONAR' });
        }
      }
    }
    
    // If we have successfully parsed resources
    if (resources && Array.isArray(resources) && resources.length > 0) {
      // Format them as markdown
      const resourcesMarkdown = resources.map(res => {
        const { name, description, url } = res;
        // Only include valid resources with name and url
        if (name && url) {
          return `- [${name}](${url}) - ${description || 'Resource for this project'}`;
        }
        return null;
      })
      .filter(Boolean)
      .join('\n');
      
      if (resourcesMarkdown) {
        logInfo(`Generated markdown resources`, { 
          tag: 'SONAR', 
          data: { itemCount: resourcesMarkdown.split('\n').length }
        });
        return { content: `## Resources\n\n${resourcesMarkdown}` };
      }
    }
    
    // If resources didn't parse or were empty, try to extract from the response as plain text
    // Look for URLs in the text
    const urlRegex = /https?:\/\/[^\s)"\]]+/g;
    const urls = responseText.match(urlRegex);
    
    if (urls && urls.length > 0) {
      logInfo(`Extracted URLs from response text`, { 
        tag: 'SONAR', 
        data: { urlCount: urls.length }
      });
      // Create a simple list of resources from the URLs
      const urlResources = urls.slice(0, 8).map(url => {
        // Try to extract a name from the URL
        const urlParts = url.replace(/https?:\/\//, '').split('/');
        const domain = urlParts[0];
        const path = urlParts.slice(1).join('/');
        const name = path ? `${domain} ${path.split('/')[0]}` : domain;
        
        return `- [${name}](${url}) - Resource for this project`;
      }).join('\n');
      
      return { content: `## Resources\n\n${urlResources}` };
    }
    
    // For GPT-4 responses, if we couldn't extract structured content, return the full response
    if (responseText.trim().length > 0) {
      // Format as markdown section if not already formatted
      const formattedContent = responseText.includes('#') ? 
        responseText : 
        `## AI Search Results\n\n${responseText}`;
      
      logInfo('Returning direct text response content', { tag: 'SONAR' });
      return { content: formattedContent };
    }
    
    // If we couldn't parse or extract anything useful
    logWarn('Could not extract usable content from response', { tag: 'SONAR' });
    return { content: `## Resources\n\n*No resources available*` };
    
  } catch (error) {
    logError(`Error processing search response`, { 
      tag: 'SONAR', 
      data: error instanceof Error ? error.message : String(error) 
    });
    return { content: `## Resources\n\n*Error processing resources*` };
  }
}

/**
 * API route that provides search results using GPT-4 through OpenRouter
 */
export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    
    if (!query) {
      logWarn('No search query provided', { tag: 'SONAR' });
      return NextResponse.json(
        { error: 'No search query provided' }, 
        { status: 400 }
      );
    }
    
    logInfo(`Received search request`, { 
      tag: 'SONAR', 
      data: { query: query.substring(0, 100) + '...' }
    });

    // Get OpenRouter API key
    const openrouterApiKey = getOpenRouterKey();
    
    if (!openrouterApiKey) {
      logError('No OpenRouter API key found or invalid format', { tag: 'SONAR' });
      return NextResponse.json(
        { error: 'Search API key not configured properly' },
        { status: 500 }
      );
    }
    
    // Prepare search request
    const currentYear = getCurrentYear();
    const currentMonth = getCurrentMonthName();
    
    // Add temporal context to the search
    const enhancedQuery = `You are a search assistant that helps find relevant information. 
Please provide a comprehensive answer to the following query:

${query}

Current date context: ${currentMonth} ${currentYear}

Format your response in markdown with clear sections and include relevant URLs when possible.`;
    
    // Call Sonar Reasoning through OpenRouter
    logInfo('Executing Sonar Reasoning query', { 
      tag: 'SONAR', 
      data: { query: query.substring(0, 100) + '...' }
    });
    
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-4',
        messages: [
          { role: 'user', content: enhancedQuery }
        ],
        temperature: 0.5,
        stream: false
      },
      {
        headers: getOpenRouterHeaders()
      }
    );

    // Check response status
    if (response.status !== 200) {
      logError(`Error from OpenRouter`, { 
        tag: 'SONAR', 
        data: { status: response.status }
      });
      return NextResponse.json(
        { error: 'Sonar Reasoning API error' },
        { status: response.status }
      );
    }

    // Process the response
    const responseData = response.data;
    const content = responseData.choices[0]?.message?.content;

    if (!content) {
      logError('No content in response from search service', { tag: 'SONAR' });
      return NextResponse.json(
        { error: 'No content in response from search service' },
        { status: 500 }
      );
    }

    logInfo('Sonar Reasoning search completed successfully', { tag: 'SONAR' });
    
    // Process and return the search response
    const processedContent = processSearchResponse(content);
    return NextResponse.json(processedContent);
  } catch (error: any) {
    logError(`Error with search service`, { 
      tag: 'SONAR', 
      data: error instanceof Error ? { message: error.message, stack: error.stack } : String(error)
    });
    
    // Handle specific error cases
    if (error.response?.status === 402) {
      return NextResponse.json(
        { error: 'Payment required for search service', content: '## Resources\n\n*Payment required for resources*' },
        { status: 402 }
      );
    }
    
    return NextResponse.json(
      { 
        error: `Error with search service: ${error.message}`, 
        content: '## Resources\n\n*Error retrieving resources*' 
      },
      { status: 500 }
    );
  }
} 