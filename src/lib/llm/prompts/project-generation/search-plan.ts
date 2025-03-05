/**
 * Generates a search plan prompt for project generation
 */
export function generateProjectSearchPlanPrompt(
  prompt: string, 
  techStackType: string, 
  techContext: string = ''
): string {
  // Include initial tech context in the prompt
  const techContextSection = techContext 
    ? `\nUSE THIS TECH CONTEXT TO INFORM YOUR QUERIES:\n${techContext.substring(0, 2000)}\n`
    : '';
  
  return `
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
} 