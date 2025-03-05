/**
 * Generates a prompt for project features generation
 */
export function generateProjectFeaturesPrompt(
  prompt: string,
  projectContent: any,
  architecture: any,
  customFeatures?: string[]
): string {
  const customFeaturesSection = customFeatures && customFeatures.length
    ? `You MUST include the following custom features: ${customFeatures.join(", ")}`
    : "";

  return `
You are a product manager tasked with defining detailed features for a software project.
${customFeaturesSection}

Based on the project idea, content outline, and architecture, provide a detailed list of features that:
1. Covers core functionality
2. Provides a complete user experience
3. Aligns with the architectural approach
4. Is implementable with the specified technologies

Provide the response as a valid JSON object with the following structure:
{
  "features": [
    {
      "name": "string", // Feature name (e.g., "User Authentication")
      "description": "string", // Detailed description (2-3 sentences)
      "priority": "string", // "Must-have", "Should-have", or "Nice-to-have"
      "userStories": [
        {
          "persona": "string", // e.g., "Admin", "User", "Guest"
          "action": "string", // What they can do
          "benefit": "string" // Why they would do it
        }
      ],
      "technicalConsiderations": ["string"] // Technical aspects to consider during implementation
    }
  ]
}

Project idea: ${prompt}
Project content outline: ${JSON.stringify(projectContent, null, 2)}
Architecture: ${JSON.stringify(architecture, null, 2)}
`;
} 