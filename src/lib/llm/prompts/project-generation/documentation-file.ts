/**
 * Generates a prompt for creating a specific documentation file
 */
export function generateDocumentationFilePrompt(
  projectName: string,
  projectDescription: string,
  techStack: any,
  architecture: any,
  features: any,
  documentPlan: any,
  filename: string
): string {
  // Find the specific document details from the plan
  const documentDetails = documentPlan.find((doc: any) => doc.filename === filename) || {
    purpose: "Documentation file",
    sections: []
  };

  return `
You are a technical writer specializing in software documentation.
Create the content for the file "${filename}" for the project "${projectName}".

Document purpose: ${documentDetails.purpose}

This document should follow these guidelines:
1. Be comprehensive yet concise
2. Use markdown formatting
3. Include code examples where appropriate
4. Be developer-focused and practical
5. Follow the section structure outlined below

Sections to include:
${documentDetails.sections.map((section: any) => 
  `## ${section.title}
${section.content}`
).join('\n\n')}

Project details:
- Name: ${projectName}
- Description: ${projectDescription}
- Technology stack: ${JSON.stringify(techStack, null, 2)}
- Architecture: ${JSON.stringify(architecture, null, 2)}
- Features: ${JSON.stringify(features, null, 2)}

ONLY respond with the markdown content for the documentation file, nothing else.
DO NOT include any explanations or any text outside of the actual documentation content.
`;
} 