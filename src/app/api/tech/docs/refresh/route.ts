import { NextRequest, NextResponse } from 'next/server';
import { clearTechDocCache, fetchTechDocumentationDir } from '@/lib/jina/tech-docs';
import { logInfo, logError } from '@/lib/logger';

/**
 * Refreshes the tech documentation cache
 * If a tech name is provided, only refreshes that technology
 * Otherwise, clears the entire cache
 */
export async function POST(request: NextRequest) {
  try {
    const { techName, url } = await request.json();
    
    if (techName) {
      // Refresh specific technology
      logInfo(`Refreshing documentation for ${techName}`, { tag: 'TECH_DOCS_API' });
      
      try {
        const result = await fetchTechDocumentationDir(techName, url);
        return NextResponse.json({
          success: true,
          message: `Documentation for ${techName} refreshed successfully`,
          documentCount: result.relatedDocuments.length + 1 // main doc + related docs
        });
      } catch (error) {
        logError(`Failed to refresh documentation for ${techName}`, { tag: 'TECH_DOCS_API', data: error });
        return NextResponse.json({
          success: false,
          error: `Failed to refresh documentation for ${techName}`,
          message: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
      }
    } else {
      // Clear entire cache
      clearTechDocCache();
      return NextResponse.json({
        success: true,
        message: 'Tech documentation cache cleared successfully'
      });
    }
  } catch (error) {
    logError('Error in tech docs refresh endpoint:', { tag: 'TECH_DOCS_API', data: error });
    return NextResponse.json({
      success: false,
      error: 'Failed to process refresh request',
      message: error instanceof Error ? error.message : String(error)
    }, { status: 400 });
  }
} 