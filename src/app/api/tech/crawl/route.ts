import { NextRequest, NextResponse } from 'next/server';
import { put, list, get } from '@vercel/blob';
import { readWebpage, searchDocumentation } from '@/lib/jina';

export async function POST(request: NextRequest) {
  try {
    const { url, techName, recursive = false, depth = 1 } = await request.json();
    
    if (!url || !techName) {
      return NextResponse.json({
        error: 'URL and technology name are required'
      }, { status: 400 });
    }
    
    // Normalize tech name
    const normalizedTechName = techName.toLowerCase().replace(/\s+/g, '-');
    
    // Process the URL using Jina API
    const mainPageResult = await readWebpage(url);
    
    if (!mainPageResult || !mainPageResult.data) {
      return NextResponse.json({
        error: 'Failed to read webpage content'
      }, { status: 500 });
    }
    
    // Extract content and links
    let markdown = `# ${techName} Documentation\n\nSource: ${url}\n\n`;
    markdown += mainPageResult.data.content || '';
    
    // If recursive is true, also crawl linked pages
    const visitedUrls = new Set([url]);
    let links = Object.values(mainPageResult.data.links || {});
    
    if (recursive && links.length > 0 && depth > 0) {
      // Filter links to include only those from the same domain
      const urlObj = new URL(url);
      const baseDomain = urlObj.hostname;
      
      // Only process a maximum of 5 additional pages to avoid excessive crawling
      const filteredLinks = links
        .filter((link: string) => {
          try {
            const linkObj = new URL(link);
            return linkObj.hostname === baseDomain && !visitedUrls.has(link);
          } catch (e) {
            return false;
          }
        })
        .slice(0, 5);
      
      // Process each link
      for (const link of filteredLinks) {
        try {
          visitedUrls.add(link);
          const subPageResult = await readWebpage(link);
          
          if (subPageResult && subPageResult.data && subPageResult.data.content) {
            markdown += `\n\n## From ${link}\n\n`;
            markdown += subPageResult.data.content;
          }
        } catch (err) {
          console.error(`Error crawling ${link}:`, err);
        }
      }
    }
    
    // Save to Vercel Blob
    const blob = await put(`tech-${normalizedTechName}.md`, markdown, {
      access: 'public',
      addRandomSuffix: false,
    });
    
    // Update the main tech.md file to include a reference
    try {
      // Get the current tech.md file if it exists
      let mainTechContent = '';
      try {
        const mainTechBlob = await get('tech.md');
        if (mainTechBlob) {
          mainTechContent = await mainTechBlob.text();
        }
      } catch (err) {
        console.log('No existing tech.md file found, creating new one');
      }
      
      // Check if this tech already exists in the main file
      const techRegex = new RegExp(`## ${techName}[\\s\\S]*?(?=##|$)`, 'i');
      const techExists = techRegex.test(mainTechContent);
      
      if (!techExists) {
        // Add the new tech to the main file
        const newEntry = `\n\n## ${techName}\n\n` +
          `- **Documentation**: [${techName} Docs](${url})\n` +
          `- **Internal Reference**: [Detailed Documentation](${blob.url})\n`;
        
        mainTechContent += newEntry;
        
        // Save updated main tech file
        await put('tech.md', mainTechContent, {
          access: 'public',
          addRandomSuffix: false,
        });
      }
    } catch (err) {
      console.error('Error updating main tech.md file:', err);
    }
    
    return NextResponse.json({
      url: blob.url,
      size: blob.size,
      links: links.length,
      visitedPages: visitedUrls.size
    });
    
  } catch (error) {
    console.error('Error crawling tech documentation:', error);
    return NextResponse.json({
      error: 'Failed to crawl tech documentation'
    }, { status: 500 });
  }
} 