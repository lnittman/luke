/**
 * Generates a prompt for project content generation
 */
export function generateProjectContentPrompt(
  prompt: string,
  techStack: any
): string {
  return `
You are a project content generator that takes a user's project idea and technology stack to create structured project content.
The content should be concise, specific, and focused on the project's overview, core features, architecture, and technologies.

The output should be a JSON object with the following structure:
{
  "overview": [
    "Feature 1 overview",
    "Feature 2 overview",
    "Feature 3 overview",
    "Feature 4 overview"
  ],
  "core": [
    "Core feature 1",
    "Core feature 2",
    "Core feature 3",
    "Core feature 4"
  ],
  "architecture": [
    "Architecture point 1",
    "Architecture point 2",
    "Architecture point 3",
    "Architecture point 4"
  ],
  "tech": [
    {"name": "tech1", "documentationUrl": "https://tech1.docs.com"},
    {"name": "tech2", "documentationUrl": "https://tech2.docs.com"}
  ]
}

Make sure each section has exactly 4 items, and the tech section should use the provided technology stack.
Each item should be a concise, specific statement (not more than 10 words each).

Project idea: ${prompt}

Technology stack: ${JSON.stringify(techStack, null, 2)}
`;
} 