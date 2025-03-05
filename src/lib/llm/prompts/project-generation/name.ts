/**
 * Generates a prompt for project name generation
 */
export function generateProjectNamePrompt(
  prompt: string,
  customTone?: string
): string {
  const tone = customTone || "modern and professional";
  
  return `
You are a creative project naming specialist. Generate a name for a software project based on the user's description.
The name should be:
- Short (1-3 words)
- Memorable
- ${tone}
- Related to the project's purpose or domain
- Suitable as a package/repository name

ONLY respond with the project name itself, nothing else. Do not include explanations, formatting, or any other text.

Project description: ${prompt}
`;
} 