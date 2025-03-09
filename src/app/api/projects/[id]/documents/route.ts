import { prisma } from '@/lib/db/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { loadInitTemplate, loadTechStackTemplates } from '@/lib/templates';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Fetch the project documents from the database
    const project = await prisma.generatedProject.findUnique({
      where: { id },
      select: {
        // New document structure
        indexDocument: true,
        designDocument: true,
        codeDocument: true,
        initDocument: true,
        techDocument: true,
        // Agentic workflow documents
        instructionsDocument: true,
        memoryIndexDocument: true,
        memoryBankDocument: true,
        promptArchitectDocument: true,
        promptDeveloperDocument: true,
        promptDesignerDocument: true,
        promptEnterpriseDocument: true,
        architectureSampleDocument: true,
        deploymentDocument: true,
        // Legacy document structure (for backward compatibility)
        comprehensiveDocument: true,
        implementationDocument: true,
        // Also select project data to generate fallback documentation if needed
        name: true,
        description: true,
        overviewItems: true,
        coreItems: true,
        architectureItems: true,
        techItems: true,
        techItemsJson: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Try to parse tech items JSON for tech stack determination
    let techStack = 'other';
    if (project.techItemsJson) {
      try {
        const techItems = JSON.parse(project.techItemsJson);
        if (Array.isArray(techItems) && techItems.length > 0) {
          // Try to determine the primary tech stack based on tech items
          const frameworks = techItems
            .map(item => typeof item === 'string' ? item.toLowerCase() : item.name.toLowerCase());
          
          if (frameworks.includes('next.js') || frameworks.includes('nextjs') || frameworks.includes('react')) {
            techStack = 'next';
          } else if (frameworks.includes('swiftui') || frameworks.includes('uikit') || frameworks.includes('swift')) {
            techStack = 'apple';
          } else if (frameworks.includes('node.js') || frameworks.includes('nodejs') || 
                   frameworks.includes('deno') || frameworks.includes('commander')) {
            techStack = 'cli';
          }
        }
      } catch (e) {
        console.error(`Failed to parse techItemsJson for project ${id}:`, e);
      }
    }
    
    // Load tech stack templates based on detected tech stack
    const templates = loadTechStackTemplates(techStack);

    // Initialize documents object with our new structure
    const documents = {
      index: '',
      design: '',
      code: '',
      init: ''
    };
    
    // First try to load documents from the new structure
    documents.index = project.indexDocument || '';
    documents.design = project.designDocument || '';
    documents.code = project.codeDocument || '';
    documents.init = project.initDocument || '';
    
    // If index document is missing, generate it from project data or use template
    if (!documents.index) {
      // Check if we have a legacy comprehensive document we can use
      if (project.comprehensiveDocument && 
          project.comprehensiveDocument !== "See comprehensive documentation") {
        documents.index = project.comprehensiveDocument;
      } else if (templates.indexTemplate) {
        documents.index = templates.indexTemplate;
      } else {
        // Generate a basic index document from the project data
        documents.index = `# ${project.name}

## Overview

${project.description}

${project.overviewItems.map((item: string) => `- ${item}`).join('\n')}

## Core Features

${project.coreItems.map((item: string) => `- ${item}`).join('\n')}

## Architecture

${project.architectureItems.map((item: string) => `- ${item}`).join('\n')}

## Tech Stack

${project.techItems.map((item: string) => `- ${item}`).join('\n')}`;
      }
    }
    
    // If design document is missing, use template or create a placeholder
    if (!documents.design) {
      if (templates.designTemplate) {
        documents.design = templates.designTemplate;
      } else {
        documents.design = `# ${project.name} Design

This document outlines the design principles and UI/UX guidelines for the ${project.name} project.

## Design Principles

- Modern, clean interface
- Intuitive user experience
- Accessible to all users
- Responsive across devices

## UI Components

${project.coreItems.map((item: string) => `- Component for: ${item}`).join('\n')}

## Styling Guidelines

To be developed based on project requirements.
`;
      }
    }
    
    // If code document is missing, use template, implementation document, or create a placeholder
    if (!documents.code) {
      if (templates.codeTemplate) {
        documents.code = templates.codeTemplate;
      } else if (project.implementationDocument && 
          project.implementationDocument !== "See full documentation") {
        documents.code = project.implementationDocument;
      } else {
        documents.code = `# ${project.name} Implementation

This document outlines the technical implementation details for the ${project.name} project.

## Project Structure

To be determined based on the selected technology stack.

## Core Components

${project.coreItems.map((item: string) => `### ${item}\n\nImplementation details for ${item}.\n`).join('\n')}

## Tech Stack

${project.techItems.map((item: string) => `- ${item}`).join('\n')}
`;
      }
    }
    
    // If init document is missing, load the template
    if (!documents.init) {
      documents.init = loadInitTemplate() || `# AI Development Guide

## Role and Objective
You are an expert development assistant tasked with implementing the ${project.name} project. Your objective is to work methodically through the entire implementation until completion, maintaining consistent context and memory throughout the process.

## Memory Management Protocol
- Begin by thoroughly reading the entire project document
- Create a mental model of the project architecture
- Before each edit, review relevant sections of the project document
- After each edit, update your understanding of project state
- Track implementation status of each component

## Development Workflow
- Start with project setup and configuration
- Implement core architecture and data models
- Build features in priority order
- Add tests and documentation
- Optimize and refine the implementation

## Communication Structure
- Provide regular progress updates
- Explain your implementation decisions
- Ask clarifying questions when needed
- Highlight potential issues or challenges

## Session Management
- At the start of each session, summarize current project state
- At the end of each session, note next steps and open issues
`;
    }

    // Return the documents with our new structure
    return NextResponse.json({ documents });
  } catch (error) {
    console.error('Error fetching project documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project documents' },
      { status: 500 }
    );
  }
} 