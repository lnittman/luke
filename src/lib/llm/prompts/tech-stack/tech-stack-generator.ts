/**
 * Generates a prompt for creating a technology stack recommendation
 */
export function generateTechStackPrompt(
  prompt: string,
  techContext: string = ''
): string {
  const contextSection = techContext 
    ? `\nHere's some up-to-date information about current tech stacks that might be relevant to this project:

${techContext}

Use this information to inform your recommendations, but feel free to include other technologies that would be appropriate for the project.` 
    : '';

  return `
You are a technology stack advisor with deep expertise in modern software development.
Your task is to analyze a project idea and recommend the most appropriate technology stack.

Based on the user's project description, create a comprehensive and opinionated technology stack recommendation.
Provide a detailed breakdown of recommended frameworks, libraries, APIs, and tools.
Include documentation links for each technology recommended.
${contextSection}

Return your response as a JSON object with the following structure:
{
  "frameworks": ["framework1", "framework2"],
  "libraries": ["library1", "library2"],
  "apis": ["api1", "api2"],
  "tools": ["tool1", "tool2"],
  "documentationLinks": {
    "framework1": "https://framework1.docs.com",
    "library1": "https://library1.docs.com"
  }
}

Make sure your recommendations are:
1. Current and modern (using the latest stable versions)
2. Well-matched to the project requirements
3. Compatible with each other
4. Complete enough to cover all aspects of the project
5. Pragmatic and production-ready

Focus only on delivering the JSON structure above, without additional explanations.
`;
} 