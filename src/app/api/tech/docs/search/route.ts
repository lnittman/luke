import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { exists } from 'fs';
import { promisify } from 'util';
import { logError } from '@/lib/logger';

const existsAsync = promisify(exists);
const TECH_DOCS_BASE_DIR = 'docs/tech';

interface SearchResult {
  technology: string;
  title: string;
  documentTitle: string;
  documentPath: string;
  excerpt: string;
  matchCount: number;
}

/**
 * Search across all tech documentation
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  console.log(`[TECH-SEARCH] Starting tech docs search`);
  
  try {
    const query = request.nextUrl.searchParams.get('q');
    
    if (!query || query.trim().length < 3) {
      console.log(`[TECH-SEARCH] Invalid search query: ${query}`);
      return NextResponse.json({
        error: 'Search query must be at least 3 characters'
      }, { status: 400 });
    }
    
    console.log(`[TECH-SEARCH] Searching for: "${query}" in tech documentation`);
    
    const baseDir = path.join(process.cwd(), TECH_DOCS_BASE_DIR);
    
    // Check if the directory exists
    if (!(await existsAsync(baseDir))) {
      console.log(`[TECH-SEARCH] Tech docs directory not found: ${baseDir}`);
      return NextResponse.json({
        results: [],
        count: 0,
        query
      });
    }
    
    // Get all technology directories
    const entries = await fs.readdir(baseDir, { withFileTypes: true });
    const techDirs = entries.filter(entry => entry.isDirectory());
    
    console.log(`[TECH-SEARCH] Found ${techDirs.length} technology directories to search`);
    
    const results: SearchResult[] = [];
    
    // Process each technology directory
    for (const techDir of techDirs) {
      const techName = techDir.name;
      const techPath = path.join(baseDir, techName);
      console.log(`[TECH-SEARCH] Searching in ${techName} documentation...`);
      
      try {
        // Get all markdown files in the tech directory
        const files = await fs.readdir(techPath);
        const markdownFiles = files.filter(file => file.endsWith('.md'));
        
        console.log(`[TECH-SEARCH] Found ${markdownFiles.length} markdown files in ${techName}`);
        
        // Search in each markdown file
        for (const file of markdownFiles) {
          const filePath = path.join(techPath, file);
          try {
            const content = await fs.readFile(filePath, 'utf-8');
            
            // Convert to lowercase for case-insensitive search
            const lowerContent = content.toLowerCase();
            const lowerQuery = query.toLowerCase();
            
            if (lowerContent.includes(lowerQuery)) {
              // Count occurrences
              const matchCount = (lowerContent.match(new RegExp(lowerQuery, 'g')) || []).length;
              
              // Extract a title from the file content
              let title = file.replace('.md', '');
              const titleMatch = content.match(/^#\s+(.+)$/m);
              if (titleMatch && titleMatch[1]) {
                title = titleMatch[1];
              }
              
              // Extract an excerpt around the first occurrence
              const index = lowerContent.indexOf(lowerQuery);
              const start = Math.max(0, index - 100);
              const end = Math.min(content.length, index + query.length + 100);
              let excerpt = content.substring(start, end);
              
              // Add ellipsis if we're not at the beginning or end
              if (start > 0) excerpt = '...' + excerpt;
              if (end < content.length) excerpt = excerpt + '...';
              
              // Add result to the list
              results.push({
                technology: techName,
                title,
                documentTitle: file.replace('.md', ''),
                documentPath: path.relative(process.cwd(), filePath),
                excerpt,
                matchCount
              });
              
              console.log(`[TECH-SEARCH] Found ${matchCount} matches in ${techName}/${file}`);
            }
          } catch (fileError) {
            console.error(`[TECH-SEARCH] Error reading file ${filePath}:`, fileError);
          }
        }
      } catch (dirError) {
        console.error(`[TECH-SEARCH] Error processing directory ${techPath}:`, dirError);
      }
    }
    
    // Sort results by match count (most matches first)
    results.sort((a, b) => b.matchCount - a.matchCount);
    
    const duration = Date.now() - startTime;
    console.log(`[TECH-SEARCH] Completed search in ${duration}ms. Found ${results.length} results.`);
    
    return NextResponse.json({
      results,
      count: results.length,
      query,
      duration
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[TECH-SEARCH] Error in search (${duration}ms):`, error);
    logError('Error searching tech docs', { tag: 'TECH-SEARCH', data: { error, query: request.nextUrl.searchParams.get('q') } });
    
    return NextResponse.json({
      error: 'Error searching documentation',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 