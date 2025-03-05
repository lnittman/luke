/**
 * Generates a prompt for creating a command prompt plan
 */
export function generateCommandPromptPlanPrompt(
  projectName: string,
  projectDescription: string,
  techStack: any,
  researchContext: string
): string {
  return `
  You are an expert software engineering workflow architect.
  Given the following project details and tech stack, determine the essential command prompts
  that should be created to guide developers through common workflows for this project.
  
  PROJECT NAME: ${projectName}
  
  PROJECT DESCRIPTION: 
  ${projectDescription}
  
  TECH STACK:
  ${JSON.stringify(techStack, null, 2)}
  
  RESEARCH CONTEXT:
  ${researchContext.substring(0, 2000)}... (truncated)
  
  For each command prompt:
  1. Provide a filename (e.g., "database-migrations.md")
  2. Explain why this prompt is necessary for this project
  3. Outline the key sections and commands that should be included
  4. Note any tech stack-specific considerations
  
  Output your response as valid JSON in the following format:
  {
    "baseCommandPrompts": [
      {
        "filename": "setup.md",
        "rationale": "...",
        "sections": ["...", "..."],
        "techConsiderations": "..."
      },
      ...
    ],
    "projectSpecificPrompts": [
      {
        "filename": "custom-workflow.md",
        "rationale": "...",
        "sections": ["...", "..."],
        "techConsiderations": "..."
      },
      ...
    ]
  }
`;
}

/**
 * Generates a prompt for creating a specific command prompt file
 */
export function generateCommandPromptFilePrompt(
  projectName: string,
  projectDescription: string,
  techStack: any,
  commandPromptDetails: {
    filename: string;
    rationale: string;
    sections: string[];
    techConsiderations: string;
  }
): string {
  return `
  You are an expert software engineering workflow architect.
  Create a detailed command prompt file to guide developers through a specific workflow.
  The command prompt should be comprehensive, accurate, and follow best practices.
  
  PROJECT NAME: ${projectName}
  
  PROJECT DESCRIPTION: 
  ${projectDescription}
  
  TECH STACK:
  ${JSON.stringify(techStack, null, 2)}
  
  COMMAND PROMPT DETAILS:
  Filename: ${commandPromptDetails.filename}
  Rationale: ${commandPromptDetails.rationale}
  Sections to cover: ${commandPromptDetails.sections.join(', ')}
  Tech considerations: ${commandPromptDetails.techConsiderations}
  
  Guidelines for creating this command prompt:
  1. Start with a brief overview of what this command prompt is for
  2. Include a prerequisites section if applicable
  3. Structure the commands in a logical workflow sequence
  4. For each command, explain what it does and any parameters
  5. Include example output where helpful
  6. Add troubleshooting tips for common issues
  7. Use markdown formatting for better readability
  
  Return ONLY the content of the command prompt file in markdown format, no additional explanations.
`;
}

/**
 * Generates a prompt for creating a setup command prompt
 */
export function generateSetupCommandPrompt(
  projectName: string,
  projectDescription: string,
  techStack: any
): string {
  return `
  You are an expert software engineering workflow architect.
  Create a detailed setup command prompt to guide developers through setting up the project from scratch.
  
  PROJECT NAME: ${projectName}
  
  PROJECT DESCRIPTION: 
  ${projectDescription}
  
  TECH STACK:
  ${JSON.stringify(techStack, null, 2)}
  
  The setup command prompt should include:
  1. System requirements and prerequisites
  2. Repository cloning instructions
  3. Dependency installation commands
  4. Environment configuration steps
  5. Database setup (if applicable)
  6. Build/compilation instructions
  7. Verification steps to ensure setup was successful
  8. Troubleshooting tips for common setup issues
  
  Return ONLY the content of the setup command prompt in markdown format, no additional explanations.
  Use the filename "setup.md" at the top of the document.
`;
}

/**
 * Generates a prompt for creating a deployment command prompt
 */
export function generateDeploymentCommandPrompt(
  projectName: string,
  projectDescription: string,
  techStack: any
): string {
  return `
  You are an expert software engineering workflow architect.
  Create a detailed deployment command prompt to guide developers through deploying the project to production.
  
  PROJECT NAME: ${projectName}
  
  PROJECT DESCRIPTION: 
  ${projectDescription}
  
  TECH STACK:
  ${JSON.stringify(techStack, null, 2)}
  
  The deployment command prompt should include:
  1. Pre-deployment checklist
  2. Build/compilation steps for production
  3. Infrastructure provisioning commands (if applicable)
  4. Deployment commands for various environments (staging, production)
  5. Post-deployment verification steps
  6. Rollback procedures in case of deployment issues
  7. Monitoring and logging setup
  8. Troubleshooting tips for common deployment issues
  
  Return ONLY the content of the deployment command prompt in markdown format, no additional explanations.
  Use the filename "deployment.md" at the top of the document.
`;
} 