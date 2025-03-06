import { streamText } from 'ai';
import { z } from 'zod';
import { DocItemExtended } from '@/components/projects/generator/interfaces';
import { ProjectGenerationResponse, TechStack } from '@/lib/llm';

// Define DocSource type since it's not exported from interfaces
export type DocSource = 'claude' | 'perplexity' | 'user';

/**
 * Document Type Schema
 */
export const DocumentTypeSchema = z.enum([
  'tech',
  'index',
  'design',
  'code',
  'init',
  'search',
  'implementation',
]);

export type DocumentType = z.infer<typeof DocumentTypeSchema>;

/**
 * Options for generating a document
 */
export interface GenerateDocumentOptions {
  projectName: string;
  projectDescription: string;
  techStack: TechStack | string;
  documentType: DocumentType;
  systemPrompt?: string;
  temperature?: number;
  shouldStream?: boolean;
}

/**
 * Streaming document generation result
 */
export interface DocumentGenerationResult {
  content: string;
  textStream?: ReadableStream<string>;
  type: DocumentType;
  title: string;
  source: DocSource;
}

/**
 * Default system prompt for document generation
 */
const DEFAULT_SYSTEM_PROMPT = `You are an expert technical writer creating comprehensive project documentation.
Focus on clarity, accuracy, and practical details.
Include code examples where appropriate and follow best practices for the given tech stack.
Make the documentation useful for developers who need to implement this project.`;

/**
 * Generate a document for a project using streaming
 */
export async function generateDocument(
  options: GenerateDocumentOptions
): Promise<DocumentGenerationResult> {
  const {
    projectName,
    projectDescription,
    techStack,
    documentType,
    systemPrompt = DEFAULT_SYSTEM_PROMPT,
    temperature = 0.5,
    shouldStream = true,
  } = options;

  // Get template for this document type
  const template = getTemplateForDocument(documentType, typeof techStack === 'string' ? techStack : 'Next.js');
  
  // Prepare tech stack string for prompt
  const techStackString = typeof techStack === 'string' 
    ? techStack 
    : JSON.stringify(techStack, null, 2);

  // Prepare document title
  const documentTitle = getDocumentTitle(documentType, projectName);
  
  // Stream document generation
  const response = await streamText({
    model: "claude-3-sonnet-20240229" as any, // Type assertion to fix model type issue
    messages: [
      { 
        role: "system", 
        content: systemPrompt
      },
      { 
        role: "user", 
        content: `
          ${template}
          
          Project Name: ${projectName}
          Project Description: ${projectDescription}
          Tech Stack: ${techStackString}
          Document Type: ${documentType}
          
          Generate comprehensive documentation following the template.
          Be thorough, practical, and focus on implementation details.
        `
      }
    ],
    temperature
  });
  
  // Return document generation result
  return {
    content: await response.text,
    textStream: shouldStream ? response.textStream : undefined,
    type: documentType,
    title: documentTitle,
    source: 'claude'
  };
}

/**
 * Generate a title for a document based on type and project name
 */
function getDocumentTitle(type: DocumentType, projectName: string): string {
  const titles: Record<DocumentType, string> = {
    index: `${projectName} Overview`,
    design: `${projectName} Design System`,
    tech: `${projectName} Technology Stack`,
    code: `${projectName} Implementation Guide`,
    init: `${projectName} Initialization Guide`,
    search: `${projectName} Research Results`,
    implementation: `${projectName} Implementation Details`,
  };
  
  return titles[type] || `${projectName} ${type.charAt(0).toUpperCase() + type.slice(1)}`;
}

/**
 * Generate multiple documents sequentially
 */
export async function generateDocuments(
  options: Omit<GenerateDocumentOptions, 'documentType'> & { 
    documentTypes: DocumentType[],
    onProgress?: (result: DocumentGenerationResult, index: number, total: number) => void
  }
): Promise<DocumentGenerationResult[]> {
  const { documentTypes, onProgress, ...restOptions } = options;
  const results: DocumentGenerationResult[] = [];
  
  for (let i = 0; i < documentTypes.length; i++) {
    const documentType = documentTypes[i];
    const result = await generateDocument({
      ...restOptions,
      documentType
    });
    
    results.push(result);
    
    if (onProgress) {
      onProgress(result, i + 1, documentTypes.length);
    }
  }
  
  return results;
}

/**
 * Get a template for a specific document type and tech stack
 */
function getTemplateForDocument(type: DocumentType, techStack: string): string {
  // For now, we'll use a placeholder approach
  // This should be expanded to use the actual templates from the project
  
  const baseTemplates: Record<DocumentType, string> = {
    index: `# {PROJECT_NAME} Overview
    
## Introduction
Provide a high-level overview of the project, its purpose, and key features.

## Features
List and describe the main features of the application.

## Target Users
Describe the intended users of this application.

## Architecture Overview
Briefly describe the high-level architecture.`,
    
    design: `# {PROJECT_NAME} Design System
    
## UI Components
Describe the key UI components and their design principles.

## User Flow
Detail the main user journeys through the application.

## Design Decisions
Explain key design decisions and their rationale.

## Responsive Design Strategy
Explain how the application handles different screen sizes.`,
    
    tech: `# {PROJECT_NAME} Technology Stack
    
## Frontend Technologies
List and describe the frontend technologies used.

## Backend Technologies
List and describe the backend technologies used.

## External APIs and Services
Detail any third-party services integrated.

## Development Tools
Describe the development environment and tools.`,
    
    code: `# {PROJECT_NAME} Implementation Guide
    
## Project Structure
Explain the organization of the codebase.

## Key Components
Detail the implementation of the most important components.

## Data Flow
Explain how data moves through the application.

## Integration Points
Describe how different parts of the system integrate.`,
    
    init: `# {PROJECT_NAME} Initialization Guide
    
## Prerequisites
List what's needed before starting development.

## Environment Setup
Step-by-step instructions for setting up the development environment.

## Installation
Commands to install dependencies and initialize the project.

## Configuration
Detail any configuration needed before starting development.`,
    
    search: `# {PROJECT_NAME} Research Results
    
## Key Findings
Summarize the main research findings.

## Resources
List useful resources, articles, and documentation.

## Technical Insights
Share technical insights relevant to the project.

## Recommendations
Provide recommendations based on the research.`,
    
    implementation: `# {PROJECT_NAME} Implementation Details
    
## Architecture Details
In-depth explanation of the system architecture.

## Component Breakdown
Detailed analysis of each major component.

## API Documentation
Document all API endpoints and their usage.

## Data Models
Define and explain all data models used in the project.`,
  };
  
  let template = baseTemplates[type] || baseTemplates.index;
  
  // Replace project name placeholder
  template = template.replace(/{PROJECT_NAME}/g, '{PROJECT_NAME}');
  
  return template;
} 