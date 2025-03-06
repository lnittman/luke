import { NextRequest, NextResponse } from 'next/server';
import { fetchTechDocumentationDir } from '@/lib/jina/tech-docs';
import { logInfo, logError } from '@/lib/logger';
import path from 'path';
import fs from 'fs/promises';
import { exists } from 'fs';
import { promisify } from 'util';

const existsAsync = promisify(exists);

/**
 * Migrates tech documentation from old flat structure to new directory-based structure
 */
export async function POST(request: NextRequest) {
  try {
    // Define technology names to migrate
    const techNames = [
      'next', 'react', 'node', 'typescript', 'javascript', 
      'express', 'jest', 'tailwind', 'prisma', 'vercel',
      'apple', 'cli', 'python', 'django', 'aws', 'azure',
      'graphql', 'mongodb', 'postgresql', 'mysql'
    ];
    
    // Get any additional tech names from the request
    try {
      const { additionalTechs = [] } = await request.json();
      if (Array.isArray(additionalTechs)) {
        techNames.push(...additionalTechs);
      }
    } catch (e) {
      // Ignore parsing errors and continue with default list
    }
    
    // Remove duplicates
    const uniqueTechNamesSet = new Set(techNames.map(name => name.toLowerCase()));
    const uniqueTechNames = Array.from(uniqueTechNamesSet);
    
    logInfo(`Found ${uniqueTechNames.length} technologies to migrate`, { tag: 'TECH_DOCS_MIGRATE' });
    
    const results: {
      technology: string;
      status: 'success' | 'failed';
      message: string;
    }[] = [];
    
    // Process each technology (limit to 5 at a time)
    const batchSize = 5;
    for (let i = 0; i < uniqueTechNames.length; i += batchSize) {
      const batch = uniqueTechNames.slice(i, i + batchSize);
      const batchPromises = batch.map(async (techName) => {
        try {
          // Check if we already have this technology in the new structure
          const techDir = path.join(process.cwd(), 'docs/tech', techName);
          const indexPath = path.join(techDir, 'index.md');
          
          if (await existsAsync(indexPath)) {
            return {
              technology: techName,
              status: 'success' as const,
              message: 'Already exists in new structure'
            };
          }
          
          // Try to fetch new documentation
          await fetchTechDocumentationDir(techName);
          
          return {
            technology: techName,
            status: 'success' as const,
            message: 'Fetched fresh documentation'
          };
        } catch (error) {
          logError(`Failed to migrate ${techName}:`, { tag: 'TECH_DOCS_MIGRATE', data: error });
          return {
            technology: techName,
            status: 'failed' as const,
            message: error instanceof Error ? error.message : String(error)
          };
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Add a small delay between batches
      if (i + batchSize < uniqueTechNames.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return NextResponse.json({
      success: true,
      processed: results.length,
      successful: results.filter(r => r.status === 'success').length,
      failed: results.filter(r => r.status === 'failed').length,
      results
    });
  } catch (error) {
    logError('Error in tech docs migration endpoint:', { tag: 'TECH_DOCS_MIGRATE', data: error });
    return NextResponse.json({
      success: false,
      error: 'Failed to process migration request',
      message: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 