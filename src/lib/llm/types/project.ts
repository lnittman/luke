/**
 * Tech Stack interface
 */
export interface TechStack {
  frameworks: string[];
  libraries: string[];
  apis: string[];
  tools: string[];
  documentationLinks: Record<string, string>;
}

/**
 * Project Content interface
 */
export interface ProjectContent {
  overview: string[];
  core: string[];
  architecture: string[];
  tech: Array<{ name: string; documentationUrl: string }>;
}

/**
 * Tech Documentation interface
 */
export interface TechDocumentation {
  index: string; // The main tech/index.md file (former tech.md)
  files: Record<string, string>; // Individual tech markdown files
}

/**
 * Project Documents interface
 */
export interface ProjectDocuments {
  index: string;
  design: string;
  code: string;
  init: string;
  tech: string;
  instructions: string;
  memoryIndex: string;
  memoryBank: string;
  promptArchitect: string;
  promptDeveloper: string;
  promptDesigner: string;
  promptEnterprise: string;
  architectureSample: string;
  deployment: string;
  techFiles?: Record<string, string>;
} 