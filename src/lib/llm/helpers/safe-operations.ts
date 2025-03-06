/**
 * Helper function to safely join array elements or handle non-array values
 */
export function safeJoin(value: any, separator: string = ", "): string {
  if (Array.isArray(value)) {
    return value.join(separator);
  } else if (value && typeof value === 'object') {
    return JSON.stringify(value);
  } else if (value !== undefined && value !== null) {
    return String(value);
  }
  return '';
}

/**
 * Function to safely handle projectContent.tech.map().join() operations
 */
export function safeTechJoin(tech: any): string {
  if (!tech) {
    return '';
  }
  
  if (!Array.isArray(tech)) {
    if (tech && typeof tech === 'object') {
      return JSON.stringify(tech);
    }
    return String(tech || '');
  }
  
  return tech.map(t => {
    if (typeof t === 'string') {
      return t;
    } else if (t && typeof t === 'object' && 'name' in t) {
      return t.name;
    }
    return String(t);
  }).join(", ");
}

/**
 * Safely access a property from an object with optional default value
 */
export function safeGet(obj: any, path: string, defaultValue: any = ''): any {
  if (!obj || typeof obj !== 'object') {
    return defaultValue;
  }
  
  const parts = path.split('.');
  let current = obj;
  
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return defaultValue;
    }
    current = current[part];
  }
  
  return current !== undefined && current !== null ? current : defaultValue;
}

/**
 * Ensure content has the expected structure for ProjectContent
 */
export function formatProjectContent(projectContent: any): any {
  if (!projectContent) {
    return {
      overview: [],
      core: [],
      architecture: [],
      tech: []
    };
  }
  
  // Log the original structure for debugging
  console.log('Original projectContent structure:', JSON.stringify(projectContent, null, 2));
  
  // Create a properly structured object
  const formatted = {
    overview: ensureArray(safeGet(projectContent, 'overview', [])),
    core: ensureArray(safeGet(projectContent, 'core', [])),
    architecture: ensureArray(safeGet(projectContent, 'architecture', [])),
    tech: ensureTechArray(safeGet(projectContent, 'tech', []))
  };
  
  // Log the formatted structure for debugging
  console.log('Formatted projectContent structure:', JSON.stringify(formatted, null, 2));
  
  return formatted;
}

/**
 * Ensure a value is an array even if it's a single item or undefined
 */
function ensureArray(value: any): any[] {
  if (Array.isArray(value)) {
    return value;
  } else if (value === undefined || value === null) {
    return [];
  } else {
    return [value];
  }
}

/**
 * Ensure the tech array has the correct structure
 */
function ensureTechArray(value: any): any[] {
  if (!value) {
    return [];
  }
  
  if (Array.isArray(value)) {
    return value.map(item => {
      if (typeof item === 'string') {
        return { name: item, documentationUrl: '' };
      } else if (item && typeof item === 'object') {
        return {
          name: item.name || 'Unknown Tech',
          documentationUrl: item.documentationUrl || item.url || ''
        };
      }
      return { name: String(item), documentationUrl: '' };
    });
  } else if (typeof value === 'object') {
    return [{ name: value.name || 'Unknown Tech', documentationUrl: value.documentationUrl || value.url || '' }];
  } else if (typeof value === 'string') {
    return [{ name: value, documentationUrl: '' }];
  }
  
  return [];
}

/**
 * Safely initialize and format TechStack object
 */
export function formatTechStack(techStack: any): any {
  if (!techStack) {
    return {
      frameworks: [],
      libraries: [],
      apis: [],
      tools: [],
      documentationLinks: {}
    };
  }
  
  // Log the original structure for debugging
  console.log('Original techStack structure:', JSON.stringify(techStack, null, 2));
  
  // Create a properly structured object
  const formatted = {
    frameworks: ensureArray(safeGet(techStack, 'frameworks', [])),
    libraries: ensureArray(safeGet(techStack, 'libraries', [])),
    apis: ensureArray(safeGet(techStack, 'apis', [])),
    tools: ensureArray(safeGet(techStack, 'tools', [])),
    documentationLinks: safeGet(techStack, 'documentationLinks', {})
  };
  
  // Ensure documentationLinks is always an object
  if (typeof formatted.documentationLinks !== 'object' || Array.isArray(formatted.documentationLinks)) {
    formatted.documentationLinks = {};
  }
  
  // Log the formatted structure for debugging
  console.log('Formatted techStack structure:', JSON.stringify(formatted, null, 2));
  
  return formatted;
} 