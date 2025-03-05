/**
 * Generates a prompt for project emoji selection
 */
export function generateProjectEmojiPrompt(
  projectName: string,
  projectDescription: string
): string {
  return `
You are tasked with selecting the most appropriate emoji to represent a software project.
Choose a single emoji that best symbolizes the project's purpose, domain, or main functionality.

The emoji should be:
- Relevant to the project's purpose
- Professional and appropriate
- Not overly specific or obscure
- A single Unicode emoji character

ONLY respond with the chosen emoji itself, nothing else. Do not include explanations, formatting, or any other text.

Project name: ${projectName}
Project description: ${projectDescription}
`;
} 