import { LLMProvider } from '../types';
import { 
  generateCommandPromptPlanPrompt,
  generateCommandPromptFilePrompt,
  generateSetupCommandPrompt,
  generateDeploymentCommandPrompt,
  generateTestingCommandPrompt,
  generateDebuggingCommandPrompt,
  generateDatabaseSetupCommandPrompt,
  generateDatabaseMigrationCommandPrompt
} from '../prompts/command-prompts';

/**
 * Command prompt generation result
 */
export interface CommandPromptResult {
  [key: string]: string;
}

/**
 * Command prompt plan
 */
export interface CommandPromptPlan {
  baseCommandPrompts: Array<{
    filename: string;
    rationale: string;
    sections: string[];
    techConsiderations: string;
  }>;
  projectSpecificPrompts: Array<{
    filename: string;
    rationale: string;
    sections: string[];
    techConsiderations: string;
  }>;
}

/**
 * Generates command prompts for a project based on its details
 */
export async function generateCommandPrompts(
  provider: LLMProvider,
  projectName: string,
  projectDescription: string,
  techStack: any,
  researchContext: string
): Promise<CommandPromptResult> {
  try {
    // 1. Generate the command prompt plan
    const planPrompt = generateCommandPromptPlanPrompt(
      projectName,
      projectDescription,
      techStack,
      researchContext
    );
    
    const plan = await provider.generateStructured<CommandPromptPlan>(planPrompt, {
      model: 'anthropic/claude-3.7-sonnet',
      temperature: 0.7,
    });
    
    // 2. Generate common command prompts
    const setupPrompt = await provider.generate(
      generateSetupCommandPrompt(projectName, projectDescription, techStack),
      { model: 'anthropic/claude-3.7-sonnet' }
    );
    
    const deploymentPrompt = await provider.generate(
      generateDeploymentCommandPrompt(projectName, projectDescription, techStack),
      { model: 'anthropic/claude-3.7-sonnet' }
    );
    
    const testingPrompt = await provider.generate(
      generateTestingCommandPrompt(projectName, projectDescription, techStack),
      { model: 'anthropic/claude-3.7-sonnet' }
    );
    
    const result: CommandPromptResult = {
      'setup.md': setupPrompt,
      'deployment.md': deploymentPrompt,
      'testing.md': testingPrompt,
    };
    
    // 3. Generate database-related prompts if needed
    const needsDatabase = doesProjectNeedDatabase(techStack, projectDescription);
    if (needsDatabase) {
      const databaseSetupPrompt = await provider.generate(
        generateDatabaseSetupCommandPrompt(projectName, projectDescription, techStack),
        { model: 'anthropic/claude-3.7-sonnet' }
      );
      
      const databaseMigrationPrompt = await provider.generate(
        generateDatabaseMigrationCommandPrompt(projectName, projectDescription, techStack),
        { model: 'anthropic/claude-3.7-sonnet' }
      );
      
      result['database-setup.md'] = databaseSetupPrompt;
      result['database-migrations.md'] = databaseMigrationPrompt;
    }
    
    // 4. Generate project-specific command prompts from the plan
    const specificPromptPromises = plan.projectSpecificPrompts.map(async (promptDetail) => {
      const promptContent = await provider.generate(
        generateCommandPromptFilePrompt(projectName, projectDescription, techStack, promptDetail),
        { model: 'anthropic/claude-3.7-sonnet' }
      );
      
      return { filename: promptDetail.filename, content: promptContent };
    });
    
    const specificPrompts = await Promise.all(specificPromptPromises);
    specificPrompts.forEach((prompt) => {
      result[prompt.filename] = prompt.content;
    });
    
    return result;
  } catch (error) {
    console.error('Error generating command prompts:', error);
    throw new Error('Failed to generate command prompts');
  }
}

/**
 * Determines if a project needs database-related command prompts
 */
function doesProjectNeedDatabase(techStack: any, projectDescription: string): boolean {
  // Check tech stack for database technologies
  const techStackString = JSON.stringify(techStack).toLowerCase();
  const dbTechnologies = [
    'sql', 'mysql', 'postgresql', 'postgres', 'mongodb', 'mongo',
    'database', 'dynamodb', 'firebase', 'supabase', 'prisma',
    'sequelize', 'typeorm', 'mongoose', 'redis', 'cassandra'
  ];
  
  const hasDatabaseTech = dbTechnologies.some(tech => techStackString.includes(tech));
  
  // Check project description for database-related terms
  const descriptionLower = projectDescription.toLowerCase();
  const dbTerms = [
    'database', 'data store', 'persistence', 'storage', 'crud', 
    'records', 'queries', 'data model', 'schema', 'entity'
  ];
  
  const hasDatabaseTerms = dbTerms.some(term => descriptionLower.includes(term));
  
  return hasDatabaseTech || hasDatabaseTerms;
} 