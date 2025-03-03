import { NextRequest, NextResponse } from 'next/server';
import { put, get } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    const { suggestions, pruneRequests } = await request.json();
    
    // Get the current tech.md file
    let techMdContent = '';
    try {
      const techMdBlob = await get('tech.md');
      if (techMdBlob) {
        techMdContent = await techMdBlob.text();
      }
    } catch (err) {
      console.log('No existing tech.md file found, creating new one');
      techMdContent = '# Technology Stack Guide\n\nA comprehensive guide to technologies used across projects.\n\n';
    }
    
    // Process new suggestions
    if (suggestions && Array.isArray(suggestions)) {
      for (const suggestion of suggestions) {
        const { name, description, url, category } = suggestion;
        
        if (name && url) {
          // Check if this tech already exists
          const techRegex = new RegExp(`## ${name}[\\s\\S]*?(?=##|$)`, 'i');
          const techExists = techRegex.test(techMdContent);
          
          if (!techExists) {
            // Add the new tech
            const newEntry = `\n\n## ${name}\n\n` +
              (description ? `${description}\n\n` : '') +
              `- **Documentation**: [${name} Docs](${url})\n` +
              (category ? `- **Category**: ${category}\n` : '');
            
            techMdContent += newEntry;
          }
        }
      }
    }
    
    // Process pruning requests
    if (pruneRequests && Array.isArray(pruneRequests)) {
      for (const techName of pruneRequests) {
        if (typeof techName === 'string') {
          // Remove the tech section
          const techRegex = new RegExp(`\n\n## ${techName}[\\s\\S]*?(?=\n\n##|$)`, 'i');
          techMdContent = techMdContent.replace(techRegex, '');
        }
      }
    }
    
    // Save the updated tech.md file
    const blob = await put('tech.md', techMdContent, {
      access: 'public',
      addRandomSuffix: false,
    });
    
    return NextResponse.json({
      url: blob.url,
      size: blob.size,
      suggestions: suggestions?.length || 0,
      pruned: pruneRequests?.length || 0
    });
    
  } catch (error) {
    console.error('Error updating tech documentation:', error);
    return NextResponse.json({
      error: 'Failed to update tech documentation'
    }, { status: 500 });
  }
} 