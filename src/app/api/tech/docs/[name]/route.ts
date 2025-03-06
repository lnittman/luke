import { NextRequest, NextResponse } from 'next/server';
import { getTechDocDirectory } from '@/lib/jina/tech-docs';
import path from 'path';
import fs from 'fs/promises';
import { exists } from 'fs';
import { promisify } from 'util';

const existsAsync = promisify(exists);

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const { name } = params;
    const searchParams = request.nextUrl.searchParams;
    const documentPath = searchParams.get('doc');
    
    // Normalize tech name
    const techName = name.toLowerCase().replace(/\s+/g, '-');
    
    // Get the tech directory
    const techDir = await getTechDocDirectory(techName);
    
    if (!techDir) {
      return NextResponse.json({
        error: `Documentation for ${techName} not found`
      }, { status: 404 });
    }
    
    // If a specific document is requested
    if (documentPath) {
      // Find the document in related documents
      const document = techDir.relatedDocuments.find(doc => {
        const docPath = getPageNameFromUrl(doc.url);
        return docPath === documentPath;
      });
      
      if (document) {
        return NextResponse.json({ 
          content: document.content,
          title: document.title,
          url: document.url,
          lastUpdated: document.lastUpdated
        });
      } else {
        return NextResponse.json({ 
          error: `Document ${documentPath} not found for ${techName}`
        }, { status: 404 });
      }
    }
    
    // Return main document details if no specific document requested
    return NextResponse.json({
      content: techDir.mainDocument.content,
      title: techDir.mainDocument.title,
      url: techDir.mainDocument.url,
      lastUpdated: techDir.mainDocument.lastUpdated,
      relatedDocuments: techDir.relatedDocuments.map(doc => ({
        title: doc.title,
        path: getPageNameFromUrl(doc.url),
        url: doc.url,
        lastUpdated: doc.lastUpdated
      }))
    });
  } catch (error) {
    console.error('Error fetching tech documentation:', error);
    return NextResponse.json({
      error: 'Failed to fetch tech documentation'
    }, { status: 500 });
  }
}

/**
 * Helper function to extract page name from URL
 * Duplicated from tech-docs.ts to avoid circular imports
 */
function getPageNameFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    // Remove trailing slash if present
    const cleanPath = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
    
    // Get the last segment of the path
    const segments = cleanPath.split('/').filter(Boolean);
    let pageName = segments.length > 0 ? segments[segments.length - 1] : 'page';
    
    // Remove file extension if present
    pageName = pageName.replace(/\.[^/.]+$/, '');
    
    // Sanitize filename
    pageName = pageName
      .replace(/[^a-z0-9-_]/gi, '-')
      .replace(/-+/g, '-')
      .toLowerCase();
    
    return pageName || 'page';
  } catch (error) {
    // Fallback for invalid URLs
    return 'page-' + Math.floor(Math.random() * 1000);
  }
} 