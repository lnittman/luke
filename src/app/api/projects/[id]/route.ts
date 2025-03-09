import { prisma } from '@/lib/db/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Ensure params is awaited before accessing properties
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Fetch the project from the database
    const project = await prisma.generatedProject.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        emoji: true,
        description: true,
        sourceUrl: true,
        overviewItems: true,
        coreItems: true,
        architectureItems: true,
        techItems: true,
        techItemsJson: true,
        createdAt: true,
        // Not including document content or user information
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Parse tech items with documentation URLs if available
    let techItems = project.techItems;
    
    if (project.techItemsJson) {
      try {
        const parsedItems = JSON.parse(project.techItemsJson);
        if (Array.isArray(parsedItems) && parsedItems.length > 0) {
          techItems = parsedItems;
        }
      } catch (e) {
        console.error(`Failed to parse techItemsJson for project ${project.id}:`, e);
        // Fallback to the string array if parsing fails
      }
    }
    
    // Format the project in the application's expected structure
    const formattedProject = {
      id: project.id,
      name: project.name,
      emoji: project.emoji,
      description: project.description,
      sourceUrl: project.sourceUrl,
      content: {
        overview: {
          title: 'overview',
          items: project.overviewItems
        },
        core: {
          title: 'core',
          items: project.coreItems
        },
        architecture: {
          title: 'architecture',
          items: project.architectureItems
        },
        tech: {
          title: 'tech',
          items: techItems
        }
      }
    };

    return NextResponse.json(formattedProject);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project. Please try again.' },
      { status: 500 }
    );
  }
} 