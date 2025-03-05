/**
 * Generates a prompt for project documentation plan generation
 */
export function generateDocumentationPlanPrompt(
  projectName: string,
  projectDescription: string,
  techStack: any,
  architecture: any,
  features: any
): string {
  return `
You are a technical documentation expert tasked with creating a documentation plan for a software project.

Create a comprehensive documentation plan that outlines all the technical documentation files needed for this project.
Focus on documentation that would help developers understand, build, and contribute to the project.

The documentation plan should include:
1. Core documentation files (README, Contributing, etc.)
2. Architecture documentation
3. API documentation
4. Technology-specific guides
5. Setup and deployment guides

Provide the response as a valid JSON array with the following structure:
[
  {
    "filename": "string", // e.g., "README.md", "CONTRIBUTING.md", "ARCHITECTURE.md"
    "purpose": "string", // Brief description of the document's purpose
    "sections": [
      {
        "title": "string", // Section title
        "content": "string" // Brief description of what this section should cover
      }
    ],
    "priority": "string" // "Essential", "Important", or "Optional"
  }
]

Project name: ${projectName}
Project description: ${projectDescription}
Technology stack: ${JSON.stringify(techStack, null, 2)}
Architecture: ${JSON.stringify(architecture, null, 2)}
Features: ${JSON.stringify(features, null, 2)}
`;
} 