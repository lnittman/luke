// Re-export main types, classes and functions

// Types
export * from './types';

// Providers
export * from './providers';

// Generators
export * from './generators';

// Helpers
export * from './helpers';

// Function to safely handle projectContent.tech.map().join() operations
export function safeTechJoin(tech: any[]): string {
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