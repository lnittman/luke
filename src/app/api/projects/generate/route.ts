import { NextRequest, NextResponse } from 'next/server';
import { createServerApiProvider } from '@/lib/llm/providers';
import { generateCommandPrompts } from '@/lib/llm/helpers/command-prompts';
import { ProjectGenerator } from '@/lib/llm/generators/project-generator';
import { gatherProjectContext } from '@/lib/llm/helpers/context';

/**
 * API route for generating a project
 * POST /api/projects/generate
 */
export async function POST(request: NextRequest) {
  try {
    // Extract request data
    const requestData = await request.json();
    const { 
      prompt, 
      projectName: providedProjectName,
      selectedTechStackType,
      techStack: providedTechStack
    } = requestData;
    
    // Validate required parameters
    if (!prompt) {
      return NextResponse.json(
        { error: 'Missing required parameter: prompt' },
        { status: 400 }
      );
    }
    
    // Create provider and generator
    const provider = createServerApiProvider();
    const projectGenerator = new ProjectGenerator(provider);
    
    // Generate or use provided project name
    const projectName = providedProjectName || 
      await projectGenerator.generateProjectName(prompt);
    
    // Generate or use provided tech stack
    const techStack = providedTechStack || 
      await projectGenerator.generateTechStack(prompt);
    
    // Gather project context from research
    const { context: projectResearchContext, links: researchLinks } = 
      await gatherProjectContext(prompt, selectedTechStackType, techStack);
    
    // Generate project content
    const projectContent = await projectGenerator.generateProjectContent(prompt, techStack);
    
    // Generate project architecture
    const architecture = await projectGenerator.generateProjectArchitecture(
      prompt, 
      techStack, 
      projectContent
    );
    
    // Generate project features
    const features = await projectGenerator.generateProjectFeatures(
      prompt, 
      projectContent, 
      architecture
    );
    
    // Generate project documentation
    const documents = await projectGenerator.generateProjectDocumentation(
      selectedTechStackType,
      {
        name: projectName,
        description: prompt,
        techStack,
        architecture,
        features,
        content: projectContent,
        research: projectResearchContext
      }
    );
    
    // Generate command prompts
    const commandPrompts = await generateCommandPrompts(
      provider,
      projectName,
      prompt,
      techStack,
      projectResearchContext
    );
    
    // Combine results
    const generationResponse = {
      project: {
        id: new Date().getTime().toString(),
        name: projectName,
        description: prompt,
        techStack,
        createdAt: new Date().toISOString(),
        researchLinks
      },
      documents: {
        ...documents,
        ...commandPrompts
      }
    };
    
    // Return the generated project
    return NextResponse.json(generationResponse);
  } catch (error) {
    console.error('Error generating project:', error);
    return NextResponse.json(
      { error: 'Failed to generate project' },
      { status: 500 }
    );
  }
} 