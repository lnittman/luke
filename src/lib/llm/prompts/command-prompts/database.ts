/**
 * Generates a prompt for creating a database setup command prompt
 */
export function generateDatabaseSetupCommandPrompt(
  projectName: string,
  projectDescription: string,
  techStack: any
): string {
  return `
  You are an expert software engineering workflow architect.
  Create a detailed database setup command prompt to guide developers through setting up and managing the database for this project.
  
  PROJECT NAME: ${projectName}
  
  PROJECT DESCRIPTION: 
  ${projectDescription}
  
  TECH STACK:
  ${JSON.stringify(techStack, null, 2)}
  
  The database setup command prompt should include:
  1. Database installation and configuration
  2. Connection setup
  3. Schema creation
  4. Initial data seeding
  5. Migration commands
  6. Backup and restore procedures
  7. Database maintenance tasks
  8. Common database troubleshooting
  
  Return ONLY the content of the database setup command prompt in markdown format, no additional explanations.
  Use the filename "database-setup.md" at the top of the document.
`;
}

/**
 * Generates a prompt for creating a database migration command prompt
 */
export function generateDatabaseMigrationCommandPrompt(
  projectName: string,
  projectDescription: string,
  techStack: any
): string {
  return `
  You are an expert software engineering workflow architect.
  Create a detailed database migration command prompt to guide developers through managing database migrations for this project.
  
  PROJECT NAME: ${projectName}
  
  PROJECT DESCRIPTION: 
  ${projectDescription}
  
  TECH STACK:
  ${JSON.stringify(techStack, null, 2)}
  
  The database migration command prompt should include:
  1. Creating a new migration
  2. Running migrations
  3. Rolling back migrations
  4. Handling migration conflicts
  5. Database versioning approach
  6. Migration best practices
  7. Testing migrations
  8. Deployment considerations for migrations
  
  Return ONLY the content of the database migration command prompt in markdown format, no additional explanations.
  Use the filename "database-migrations.md" at the top of the document.
`;
}

/**
 * Generates a prompt for creating a database query command prompt
 */
export function generateDatabaseQueryCommandPrompt(
  projectName: string,
  projectDescription: string,
  techStack: any
): string {
  return `
  You are an expert software engineering workflow architect.
  Create a detailed database query command prompt to guide developers through writing and optimizing database queries for this project.
  
  PROJECT NAME: ${projectName}
  
  PROJECT DESCRIPTION: 
  ${projectDescription}
  
  TECH STACK:
  ${JSON.stringify(techStack, null, 2)}
  
  The database query command prompt should include:
  1. Connecting to the database
  2. Common query patterns for this project
  3. Query optimization techniques
  4. Index management
  5. Transaction handling
  6. Performance monitoring
  7. Query debugging
  8. ORM usage (if applicable)
  
  Return ONLY the content of the database query command prompt in markdown format, no additional explanations.
  Use the filename "database-queries.md" at the top of the document.
`;
} 