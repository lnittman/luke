import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { logError } from '@/lib/logger';

const TECH_DOCS_BASE_DIR = 'docs/tech';

/**
 * Lists all available tech documentation
 */
export async function GET(request: NextRequest) {
  try {
    const baseDir = path.join(process.cwd(), TECH_DOCS_BASE_DIR);
    
    // Check if the directory exists
    try {
      await fs.access(baseDir);
    } catch (error) {
      // Directory doesn't exist yet
      return NextResponse.json({ technologies: [] });
    }
    
    // Get all subdirectories
    const entries = await fs.readdir(baseDir, { withFileTypes: true });
    const techDirs = entries.filter(entry => entry.isDirectory());
    
    // Process each directory to get basic info
    const technologies = await Promise.all(
      techDirs.map(async (dir) => {
        const techName = dir.name;
        const techDir = path.join(baseDir, techName);
        
        // Check for index.md file
        const indexPath = path.join(techDir, 'index.md');
        let title = techName;
        let lastUpdated = null;
        
        try {
          const stats = await fs.stat(indexPath);
          const content = await fs.readFile(indexPath, 'utf-8');
          
          // Extract title from markdown
          const titleMatch = content.match(/^#\s+(.+)$/m);
          if (titleMatch) {
            title = titleMatch[1];
          }
          
          lastUpdated = stats.mtime;
        } catch (error) {
          // Index file not found or couldn't be read
        }
        
        // Count related documents
        try {
          const files = await fs.readdir(techDir);
          const documentCount = files.filter(file => 
            file.endsWith('.md') && file !== 'index.md' && file !== '_index.md'
          ).length;
          
          return {
            name: techName,
            title,
            documentCount,
            lastUpdated
          };
        } catch (error) {
          return {
            name: techName,
            title,
            documentCount: 0,
            lastUpdated
          };
        }
      })
    );
    
    return NextResponse.json({ 
      technologies,
      count: technologies.length
    });
  } catch (error) {
    logError('Error listing tech documentation:', { tag: 'API', data: error });
    return NextResponse.json({ 
      error: 'Failed to list tech documentation'
    }, { status: 500 });
  }
} 