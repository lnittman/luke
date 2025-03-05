/**
 * Generates a prompt for creating a testing command prompt
 */
export function generateTestingCommandPrompt(
  projectName: string,
  projectDescription: string,
  techStack: any
): string {
  return `
  You are an expert software engineering workflow architect.
  Create a detailed testing command prompt to guide developers through testing the project.
  
  PROJECT NAME: ${projectName}
  
  PROJECT DESCRIPTION: 
  ${projectDescription}
  
  TECH STACK:
  ${JSON.stringify(techStack, null, 2)}
  
  The testing command prompt should include:
  1. Overview of the testing strategy
  2. Setting up the testing environment
  3. Running unit tests
  4. Running integration tests
  5. Running end-to-end tests
  6. Testing specific features
  7. Test coverage reporting
  8. Continuous integration testing
  9. Troubleshooting common testing issues
  
  Return ONLY the content of the testing command prompt in markdown format, no additional explanations.
  Use the filename "testing.md" at the top of the document.
`;
}

/**
 * Generates a prompt for creating a debugging command prompt
 */
export function generateDebuggingCommandPrompt(
  projectName: string,
  projectDescription: string,
  techStack: any
): string {
  return `
  You are an expert software engineering workflow architect.
  Create a detailed debugging command prompt to guide developers through debugging common issues in the project.
  
  PROJECT NAME: ${projectName}
  
  PROJECT DESCRIPTION: 
  ${projectDescription}
  
  TECH STACK:
  ${JSON.stringify(techStack, null, 2)}
  
  The debugging command prompt should include:
  1. Setting up debugging tools for this tech stack
  2. Common error types and their solutions
  3. Debugging specific components
  4. Using logging effectively
  5. Performance debugging
  6. Memory leak detection
  7. Remote debugging (if applicable)
  8. Advanced debugging techniques specific to this tech stack
  
  Return ONLY the content of the debugging command prompt in markdown format, no additional explanations.
  Use the filename "debugging.md" at the top of the document.
`;
}

/**
 * Generates a prompt for creating a performance testing command prompt
 */
export function generatePerformanceTestingCommandPrompt(
  projectName: string,
  projectDescription: string,
  techStack: any
): string {
  return `
  You are an expert software engineering workflow architect.
  Create a detailed performance testing command prompt to guide developers through performance testing the project.
  
  PROJECT NAME: ${projectName}
  
  PROJECT DESCRIPTION: 
  ${projectDescription}
  
  TECH STACK:
  ${JSON.stringify(techStack, null, 2)}
  
  The performance testing command prompt should include:
  1. Setting up performance testing tools
  2. Defining performance benchmarks
  3. Load testing commands
  4. Stress testing commands
  5. Endurance testing commands
  6. Performance profiling
  7. Identifying bottlenecks
  8. Optimizing performance based on test results
  9. Performance monitoring in production
  
  Return ONLY the content of the performance testing command prompt in markdown format, no additional explanations.
  Use the filename "performance-testing.md" at the top of the document.
`;
} 