import { prisma } from '@/lib/db/prisma';
import { NextRequest, NextResponse } from 'next/server';

interface ProjectContent {
  id: string;
  name: string;
  emoji: string;
  description: string;
  sourceUrl: string;
  overviewItems: string[];
  coreItems: string[];
  architectureItems: string[];
  techItems: string[];
  techItemsJson?: string | null;
  createdAt: Date;
}

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);
    
    // Get projects from database
    const projects = await prisma.generatedProject.findMany({
      take: Math.min(limit, 100), // Cap at 100 for performance
      skip: offset,
      orderBy: {
        createdAt: 'desc'
      },
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
        // Not including document content to keep response size small
        // Not including user information for privacy
      }
    });
    
    // Get total count of projects
    const totalCount = await prisma.generatedProject.count();
    
    // Transform projects into the application's expected format
    const formattedProjects = projects.map((project: ProjectContent) => {
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
      
      return {
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
    });
    
    return NextResponse.json({
      projects: formattedProjects,
      pagination: {
        total: totalCount,
        offset,
        limit,
      }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects. Please try again.' },
      { status: 500 }
    );
  }
} 