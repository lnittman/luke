/**
 * Generates a prompt for project description generation
 */
export function generateProjectDescriptionPrompt(
  projectName: string,
  prompt: string,
  customTone?: string
): string {
  const tone = customTone || "concise and professional";
  
  return `
You are a technical writer who specializes in creating project descriptions.
Generate a short description (1-2 sentences) for the software project based on the name and user's description.
The description should be:
- ${tone}
- Clear and informative
- Focused on the project's purpose and value
- No more than 25 words

ONLY respond with the project description itself, nothing else. Do not include explanations, formatting, or any other text.

Project name: ${projectName}
User's description: ${prompt}
`;
} 