import { NextRequest, NextResponse } from 'next/server';
import { get, head } from '@vercel/blob';

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const { name } = params;
    
    // Normalize tech name
    const techName = name.toLowerCase().replace(/\s+/g, '-');
    
    // Try to get the tech-specific documentation
    try {
      const blob = await get(`tech-${techName}.md`);
      
      if (blob) {
        return NextResponse.json({ content: blob.text });
      }
    } catch (err) {
      console.log(`No specific documentation found for ${techName}, falling back to tech.md`);
    }
    
    // Fallback to main tech.md file and filter for relevant content
    try {
      const mainTechDoc = await get('tech.md');
      
      if (mainTechDoc) {
        const content = await mainTechDoc.text();
        
        // Extract relevant section for this technology
        const techRegex = new RegExp(`## ${techName}[\\s\\S]*?(?=##|$)`, 'i');
        const match = content.match(techRegex);
        
        if (match) {
          return NextResponse.json({ content: match[0] });
        } else {
          return NextResponse.json({ 
            content: `No specific documentation found for ${techName}`,
            error: 'Tech not found'
          }, { status: 404 });
        }
      }
    } catch (err) {
      console.error('Error fetching tech.md:', err);
    }
    
    return NextResponse.json({
      error: `Documentation for ${techName} not found`
    }, { status: 404 });
  } catch (error) {
    console.error('Error fetching tech documentation:', error);
    return NextResponse.json({
      error: 'Failed to fetch tech documentation'
    }, { status: 500 });
  }
} 