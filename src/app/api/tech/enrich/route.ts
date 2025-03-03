import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

export const maxDuration = 30; // 30 second timeout

/**
 * API route for enriching technology documentation
 * This route uses Perplexity's Sonar Reasoning to find cutting-edge best practices
 * and documentation links for a specific technology stack
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { 
      techStack,       // The tech stack name or array of tech names
      techItems,       // Specific tech items to enrich
      detailedInfo     // Whether to include detailed descriptions
    } = await request.json();
    
    // Get the OpenRouter API key from environment variable
    const openrouterApiKey = process.env.OPENROUTER_API_KEY;
    
    if (!openrouterApiKey) {
      return NextResponse.json(
        { error: 'No OpenRouter API key found in environment variables' },
        { status: 500 }
      );
    }
    
    // Format the tech items for the prompt
    const techNames = Array.isArray(techItems) ? techItems : 
                     Array.isArray(techStack) ? techStack : 
                     [techStack];
    
    // Filter out empty or invalid tech names
    const validTechNames = techNames
      .filter(Boolean)
      .map(item => typeof item === 'string' ? item : item.name || '')
      .filter(name => name.length > 0);
    
    if (validTechNames.length === 0) {
      return NextResponse.json(
        { error: 'No valid technology names provided' },
        { status: 400 }
      );
    }
    
    // Join tech names for the prompt
    const techItemsStr = validTechNames.join(', ');
    const includeDescriptions = detailedInfo === true;
    
    // Use Perplexity via OpenRouter to get current documentation links
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'perplexity/sonar-reasoning',
        messages: [
          {
            role: 'system',
            content: `You are a technical documentation specialist who provides the most current and official documentation links for software technologies, libraries, frameworks, and tools. You also know about cutting-edge best practices and implementation patterns.

Your task is to find the official documentation URLs, GitHub repositories, and other authoritative sources for each technology requested. ${includeDescriptions ? 'Additionally, provide a brief description of each technology and highlight any current best practices.' : ''}`
          },
          {
            role: 'user',
            content: `Please provide the most current and official documentation links for the following technologies: ${techItemsStr}.

For each technology, provide:
1. The exact name of the technology (correcting any typos or casing issues)
2. The primary official documentation URL
3. A secondary resource URL (like GitHub repo, tutorials site, etc.) if available
${includeDescriptions ? '4. A brief description (1-2 sentences)\n5. A current best practice tip for using this technology' : ''}

Format your response as a valid JSON array of objects, with the following structure:
\`\`\`json
[
  {
    "name": "Technology Name",
    "documentationUrl": "https://primary-docs-url.com",
    "githubUrl": "https://github.com/org/repo" ${includeDescriptions ? ',\n    "description": "Brief description of the technology",\n    "bestPractice": "Current best practice tip"' : ''}
  }
]
\`\`\`

Return ONLY the JSON array without any wrapping text or explanation.`
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
          'X-Title': 'Luke Tech Documentation Enrichment'
        }
      }
    );
    
    // Parse the response content
    const content = response.data.choices[0].message.content;
    
    try {
      // Try to parse the JSON response
      let techDocs;
      
      // Attempt to find and extract JSON from the response if it contains markdown code blocks
      const jsonRegex = /```(?:json)?([^`]+)```/;
      const jsonMatch = content.match(jsonRegex);
      
      if (jsonMatch && jsonMatch[1]) {
        // Found JSON in code block, extract and parse it
        techDocs = JSON.parse(jsonMatch[1].trim());
      } else {
        // Try to parse the raw content as JSON
        try {
          // First try direct JSON parsing
          techDocs = JSON.parse(content);
        } catch (error: any) {
          const parseError = error as Error;
          console.log("First JSON parse attempt failed:", parseError.message);
          
          // Try to extract JSON from markdown code blocks
          const markdownMatch = content.match(/```(?:json)?\n([\s\S]*?)\n```/);
          if (markdownMatch && markdownMatch[1]) {
            try {
              techDocs = JSON.parse(markdownMatch[1]);
              console.log("Successfully parsed JSON from markdown code block");
            } catch (error: any) {
              const secondParseError = error as Error;
              console.log("Second JSON parse attempt failed:", secondParseError.message);
              
              // Try more aggressive extraction - find first { and last }
              const startIdx = content.indexOf('[');
              const endIdx = content.lastIndexOf(']');
              
              if (startIdx >= 0 && endIdx > startIdx) {
                const potentialJson = content.substring(startIdx, endIdx + 1);
                try {
                  techDocs = JSON.parse(potentialJson);
                  console.log("Successfully parsed JSON using array extraction");
                } catch (error: any) {
                  const thirdParseError = error as Error;
                  console.log("Third JSON parse attempt failed:", thirdParseError.message);
                  return NextResponse.json(
                    { error: `Failed to parse tech documentation JSON: ${thirdParseError.message}` },
                    { status: 400 }
                  );
                }
              } else {
                return NextResponse.json(
                  { error: `Failed to parse tech documentation JSON: ${secondParseError.message}` },
                  { status: 400 }
                );
              }
            }
          } else {
            return NextResponse.json(
              { error: `Failed to parse tech documentation JSON: ${parseError.message}` },
              { status: 400 }
            );
          }
        }
      }
      
      // Validate the structure of the response
      if (!Array.isArray(techDocs)) {
        return NextResponse.json(
          { error: 'Invalid tech documentation format. Expected an array.' },
          { status: 400 }
        );
      }
      
      // Filter out any invalid entries
      const validTechDocs = techDocs.filter(item => 
        item && 
        typeof item === 'object' && 
        item.name && 
        typeof item.name === 'string' && 
        item.documentationUrl && 
        typeof item.documentationUrl === 'string'
      );
      
      return NextResponse.json({
        technologies: validTechDocs
      });
      
    } catch (parseError) {
      console.error('Error parsing tech documentation JSON:', parseError);
      
      // Return the raw content for debugging
      return NextResponse.json(
        { 
          error: `Failed to parse response as JSON: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`,
          rawContent: content
        },
        { status: 500 }
      );
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
    
    return NextResponse.json(
      { error: `Failed to enrich tech documentation: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
} 