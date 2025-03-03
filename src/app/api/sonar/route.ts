import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

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
 * Process the Perplexity response to extract structured content
 */
function processPerplexityResponse(responseText: string): { content: string } {
  console.log(`[SONAR] Processing Perplexity response: ${responseText.substring(0, 150)}...`);
  
  try {
    // Check if response is already valid JSON
    let resources;
    try {
      resources = JSON.parse(responseText);
      console.log(`[SONAR] Successfully parsed JSON response with ${resources.length} resources`);
    } catch (e) {
      // Try to extract JSON from markdown code blocks if parsing fails
      console.log('[SONAR] JSON parse failed, trying to extract from response text');
      
      // Sometimes the response might be wrapped in markdown code blocks
      const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          resources = JSON.parse(jsonMatch[1]);
          console.log(`[SONAR] Extracted JSON from code block with ${resources.length} resources`);
        } catch (e2) {
          console.warn('[SONAR] Failed to parse extracted JSON from code block');
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
        console.log(`[SONAR] Generated markdown resources with ${resourcesMarkdown.split('\n').length} items`);
        return { content: `## Resources\n\n${resourcesMarkdown}` };
      }
    }
    
    // If resources didn't parse or were empty, try to extract from the response as plain text
    // Look for URLs in the text
    const urlRegex = /https?:\/\/[^\s)"\]]+/g;
    const urls = responseText.match(urlRegex);
    
    if (urls && urls.length > 0) {
      console.log(`[SONAR] Extracted ${urls.length} URLs from response text`);
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
    
    // If we couldn't parse or extract anything useful
    console.warn('[SONAR] Could not extract usable resources from response');
    return { content: `## Resources\n\n*No resources available*` };
    
  } catch (error) {
    console.error(`[SONAR] Error processing Perplexity response: ${error instanceof Error ? error.message : String(error)}`);
    return { content: `## Resources\n\n*Error processing resources*` };
  }
}

/**
 * API route that provides search results using Perplexity Sonar Reasoning
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[SONAR] Received request to Sonar API');
    
    // Parse the request body
    const requestData = await request.json();
    const { query } = requestData;

    if (!query || typeof query !== 'string') {
      console.error('[SONAR] Invalid query provided');
      return NextResponse.json(
        { error: 'Invalid query. Please provide a text query.' },
        { status: 400 }
      );
    }

    // Get the OpenRouter API key from environment variable
    const openrouterApiKey = process.env.OPENROUTER_API_KEY;
    
    if (!openrouterApiKey) {
      console.error('[SONAR] No OpenRouter API key found in environment variables');
      return NextResponse.json(
        { error: 'OpenRouter API key not configured on the server.' },
        { status: 500 }
      );
    }
    
    console.log(`[SONAR] Searching with Sonar Reasoning: "${query.substring(0, 100)}..."`);
    
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'perplexity/sonar-reasoning',
        messages: [
          {
            role: 'system',
            content: `You are a research assistant that provides accurate, factual information about technologies, frameworks, libraries, and technical documentation. Focus on finding the most relevant and high-quality resources for the user's query.`
          },
          {
            role: 'user',
            content: `Research the following technical topic thoroughly and provide detailed information with relevant URLs to resources: ${query}. Focus on official documentation, popular tutorials, and community resources.

Provide the most specific, high-quality resources that directly address the query.

Return your response as a JSON array of objects. Each object should have:
- "name": The name of the specific resource or subtopic
- "description": A concise description 
- "url": A direct URL to the official documentation
- "type": The type of resource (e.g., "documentation", "tutorial", "guide")

Example format:
[
  {
    "name": "React Documentation",
    "description": "Official React documentation with guides and API references",
    "url": "https://react.dev/",
    "type": "documentation"
  },
  {
    "name": "Next.js Learn",
    "description": "Interactive Next.js tutorial for beginners",
    "url": "https://nextjs.org/learn",
    "type": "tutorial"
  }
]`
          }
        ],
        max_tokens: 2048,
        temperature: 0.7,
        response_format: { type: "text" } // Ensure we get text back, not a JSON object
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

    console.log(`[SONAR] Received response from Perplexity (${response.data.choices[0].message.content.length} chars)`);
    
    // Process the response to ensure we return properly formatted content
    const responseContent = response.data.choices[0].message.content;
    const processedResponse = processPerplexityResponse(responseContent);
    
    // Return the processed response
    return NextResponse.json(processedResponse);
  } catch (error: any) {
    console.error(`[SONAR] Error searching with Sonar Reasoning: ${error instanceof Error ? error.message : String(error)}`);
    
    // Handle specific error cases
    if (error.response?.status === 402) {
      return NextResponse.json(
        { error: 'Payment required for Perplexity Sonar Reasoning', content: '## Resources\n\n*Payment required for resources*' },
        { status: 402 }
      );
    }
    
    return NextResponse.json(
      { 
        error: `Error searching with Sonar Reasoning: ${error.message}`, 
        content: '## Resources\n\n*Error retrieving resources*' 
      },
      { status: 500 }
    );
  }
} 