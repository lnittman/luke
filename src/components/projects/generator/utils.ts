import { TechStackOption } from './interfaces';
import { TECH_STACK_TEMPLATES } from './constants';
import { DocSource } from '@/lib/hooks/useDocumentManager';

/**
 * Extracts technologies from a markdown file
 * @param content Markdown content
 * @returns Array of technology names
 */
export const extractTechnologiesFromMarkdown = (content: string): string[] => {
  // Extract tech items from the tech section
  const techRegex = /## Tech(?:nology|nologies|nical Implementation|nical Considerations|)[\s\S]*?(?=## |$)/i;
  const techSection = content.match(techRegex);
  
  if (!techSection) return [];
  
  // Extract tech items from the tech section
  const techItemRegex = /[-*]\s+([A-Za-z0-9_\-\.]+)/g;
  const techItems: string[] = [];
  let match;
  
  while ((match = techItemRegex.exec(techSection[0])) !== null) {
    if (match[1] && !techItems.includes(match[1])) {
      techItems.push(match[1]);
    }
  }
  
  return techItems;
};

/**
 * Gets tech pills for a selected tech stack
 * @param stack The selected tech stack
 * @param techData Optional tech documentation data
 * @returns Array of tech objects with name and documentation URL
 */
export const getTechPillsForStack = (
  stack: TechStackOption,
  techData?: { techMd: string; relationships: Record<string, string[]> } | null
): { name: string; documentationUrl: string }[] => {
  // Start with the tech stack template
  const template = TECH_STACK_TEMPLATES[stack];
  
  // Map techs from the template to the format expected by TechPill
  const resultFromTemplate = [
    ...template.frameworks.map(name => ({ 
      name, 
      documentationUrl: template.documentationLinks[name] || '' 
    })),
    ...template.libraries.map(name => ({ 
      name, 
      documentationUrl: template.documentationLinks[name] || '' 
    })),
    ...template.apis.map(name => ({ 
      name, 
      documentationUrl: template.documentationLinks[name] || '' 
    })),
    ...template.tools.map(name => ({ 
      name, 
      documentationUrl: template.documentationLinks[name] || '' 
    }))
  ];
  
  // If we have techData, enhance the results with additional tech options
  if (techData?.techMd) {
    // Mapping of stack options to tech data keys
    const stackToDataKey: Record<TechStackOption, string> = {
      'Next.js': 'next',
      'Apple': 'apple',
      'CLI': 'cli',
      'Other': 'other'
    };
    
    // Use tech relationships from the new tech documentation system if available
    if (techData.relationships && Object.keys(techData.relationships).length > 0) {
      const stackKey = stackToDataKey[stack].toLowerCase();
      const relatedTechs = techData.relationships[stackKey] || [];
      
      // Add related techs that aren't already in the template
      const existingTechNames = new Set(resultFromTemplate.map(t => t.name.toLowerCase()));
      
      relatedTechs.forEach(tech => {
        if (!existingTechNames.has(tech.toLowerCase())) {
          resultFromTemplate.push({
            name: tech,
            documentationUrl: `https://www.google.com/search?q=${encodeURIComponent(tech)}+documentation`
          });
          existingTechNames.add(tech.toLowerCase());
        }
      });
    } else {
      // Extract tech items from the tech.md content as fallback
      const techMatches = techData.techMd.match(/["`']([a-zA-Z0-9\.\-\/]+)["`']/g) || [];
      const extractedTechs = techMatches
        .map(match => match.replace(/["`']/g, '').toLowerCase())
        .filter(tech => tech.length > 1 && !tech.includes('.com'));
      
      // Find unique technologies not already in the template
      const existingTechNames = new Set(resultFromTemplate.map(t => t.name.toLowerCase()));
      const uniqueTechs = Array.from(new Set(extractedTechs)).filter(
        tech => !existingTechNames.has(tech) && tech.length < 30
      );
      
      // Add unique techs to the result
      uniqueTechs.slice(0, 10).forEach(tech => {
        resultFromTemplate.push({
          name: tech,
          documentationUrl: `https://www.google.com/search?q=${encodeURIComponent(tech)}+documentation`
        });
      });
    }
  }
  
  return resultFromTemplate;
};

/**
 * Simulates sequential document generation with timed updates
 */
export const simulateSequentialDocumentGeneration = (
  documents: Record<string, string>,
  updateDocument: (docType: string, content: string, source: DocSource) => void
): void => {
  // Create a mapping of document types to sources
  const docSources: Record<string, DocSource> = {
    tech: 'perplexity',
    index: 'claude',
    design: 'claude',
    code: 'claude',
    init: 'claude'
  };

  // Define the order of document generation
  const docTypes = ['tech', 'index', 'design', 'code', 'init'];
  
  // Generate placeholder content for each document
  docTypes.forEach((docType, index) => {
    // Only process document types that exist in the documents object
    if (documents[docType]) {
      const source = docSources[docType] || 'claude';
      const title = docType.charAt(0).toUpperCase() + docType.slice(1);
      
      // Add generating placeholder first
      setTimeout(() => {
        updateDocument(docType, `# ${title}\n\nGenerating...`, source);
        
        // Then add the actual content after a delay
        setTimeout(() => {
          updateDocument(docType, documents[docType], source);
        }, 800);
      }, index * 1500); // Stagger the document generation
    }
  });
}; 