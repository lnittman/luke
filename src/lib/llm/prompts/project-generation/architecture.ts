/**
 * Generates a prompt for project architecture generation
 */
export function generateProjectArchitecturePrompt(
  prompt: string,
  techStack: any,
  projectContent: any,
  customArchitecture?: string
): string {
  const architectureConstraint = customArchitecture
    ? `You MUST use the following architectural approach: ${customArchitecture}`
    : "Choose the most appropriate architecture based on the project requirements and technology stack.";

  return `
You are an expert software architect tasked with designing a software architecture for a project.
${architectureConstraint}

Based on the project idea, content outline, and technology stack, provide a detailed architecture that includes:

1. High-level architecture overview (pattern/approach used and why)
2. Component breakdown (frontend, backend, services, etc.)
3. Data flow between components
4. Key technologies for each component
5. Security considerations
6. Scalability approach

Provide the response as a valid JSON object with the following structure:
{
  "pattern": "string", // e.g., "Microservices", "MVC", "CQRS", etc.
  "components": [
    {
      "name": "string", // Component name
      "type": "string", // e.g., "Frontend", "Backend", "Service", "Database"
      "description": "string", // Brief description
      "technologies": ["string"], // Technologies used
      "responsibilities": ["string"] // Key responsibilities
    }
  ],
  "dataFlow": [
    {
      "from": "string", // Source component name
      "to": "string", // Destination component name
      "description": "string", // What data flows and why
      "protocol": "string" // e.g., "HTTP", "WebSocket", "gRPC"
    }
  ],
  "security": ["string"], // Key security considerations
  "scalability": ["string"] // Scalability approaches
}

Project idea: ${prompt}
Technology stack: ${JSON.stringify(techStack, null, 2)}
Project content outline: ${JSON.stringify(projectContent, null, 2)}
`;
} 