import { NextRequest, NextResponse } from 'next/server';
import { createServerApiProvider } from '@/lib/llm/providers';
import { generateCommandPrompts } from '@/lib/llm/helpers/command-prompts';

/**
 * API route for generating command prompts for a project
 * POST /api/projects/commands
 */
export async function POST(request: NextRequest) {
  try {
    // Extract request data
    const { 
      projectName, 
      projectDescription, 
      techStack, 
      researchContext = '' 
    } = await request.json();
    
    // Validate required parameters
    if (!projectName || !projectDescription || !techStack) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Create provider
    const provider = createServerApiProvider();
    
    // Generate command prompts
    const commandPrompts = await generateCommandPrompts(
      provider,
      projectName,
      projectDescription,
      techStack,
      researchContext
    );
    
    // Return the generated command prompts
    return NextResponse.json({ commandPrompts });
  } catch (error) {
    console.error('Error generating command prompts:', error);
    return NextResponse.json(
      { error: 'Failed to generate command prompts' },
      { status: 500 }
    );
  }
} 