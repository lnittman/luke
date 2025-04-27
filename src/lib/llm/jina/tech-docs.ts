import { readDocumentation } from './index';
import path from 'path';
import fs from 'fs/promises';
import { exists } from 'fs';
import { promisify } from 'util';
import { logInfo, logError } from '../logger';

// Convert exists to promise-based
const existsAsync = promisify(exists);

/**
 * Tech document structure
 */
export interface TechDocument {
  content: string;
  url: string;
  title: string;
  lastUpdated: Date;
}

/**
 * Tech documentation directory structure
 */
export interface TechDocDirectory {
  mainDocument: TechDocument;
  relatedDocuments: TechDocument[];
  links: string[];
}

/**
 * Cache for tech documentation directories
 */
interface TechDocCache {
  [techName: string]: {
    timestamp: number;
    data: TechDocDirectory;
  }
}

// Cache expiration time (30 minutes)
const CACHE_EXPIRY = 30 * 60 * 1000;

// In-memory cache for tech documentation
const techDocDirectoryCache: TechDocCache = {};

/**
 * Base directory for storing tech documentation
 */
const TECH_DOCS_BASE_DIR = 'docs/tech';

/**
 * Ensures the tech documentation directory exists
 */
async function ensureTechDocsDirectory(techName: string): Promise<string> {
  // Create base tech docs directory if it doesn't exist
  const baseDir = path.join(process.cwd(), TECH_DOCS_BASE_DIR);
  
  try {
    await fs.mkdir(baseDir, { recursive: true });
  } catch (error) {
    logError(`Failed to create base tech docs directory: ${error}`, { tag: 'TECH_DOCS' });
  }
  
  // Create technology-specific directory if it doesn't exist
  const techDir = path.join(baseDir, techName.toLowerCase());
  
  try {
    await fs.mkdir(techDir, { recursive: true });
  } catch (error) {
    logError(`Failed to create tech directory for ${techName}: ${error}`, { tag: 'TECH_DOCS' });
  }
  
  return techDir;
}

/**
 * Extracts links from markdown content
 */
function extractLinksFromMarkdown(markdown: string): string[] {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links: string[] = [];
  let match;
  
  while ((match = linkRegex.exec(markdown)) !== null) {
    const url = match[2];
    
    // Only include absolute URLs
    if (url.startsWith('http')) {
      links.push(url);
    }
  }
  
  return links;
}

/**
 * Fetches documentation for a specific technology
 */
export async function fetchTechDocumentationDir(
  techName: string,
  documentationUrl?: string
): Promise<TechDocDirectory> {
  try {
    // Normalize tech name
    const normalizedTechName = techName.toLowerCase();
    
    // Check cache first
    const now = Date.now();
    const cachedDir = techDocDirectoryCache[normalizedTechName];
    
    if (cachedDir && (now - cachedDir.timestamp < CACHE_EXPIRY)) {
      logInfo(`Using cached tech documentation for ${techName}`, { tag: 'TECH_DOCS' });
      return cachedDir.data;
    }
    
    // Ensure directory exists
    const techDir = await ensureTechDocsDirectory(normalizedTechName);
    
    // Determine URL to fetch
    let url = documentationUrl;
    if (!url) {
      // Use a search-based approach if URL not provided
      url = `https://www.google.com/search?q=${encodeURIComponent(techName + ' documentation')}`;
    }
    
    // Fetch main documentation
    logInfo(`Fetching documentation for ${techName} from ${url}`, { tag: 'TECH_DOCS' });
    
    // Fetch main content
    const mainDocResult = await readDocumentation(url);
    const mainContent = mainDocResult.content || `# ${techName} Documentation\n\nNo documentation content found.`;
    
    // Extract title and links
    const titleMatch = mainContent.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : `${techName} Documentation`;
    const links = extractLinksFromMarkdown(mainContent);
    
    // Save main document
    const mainDocument: TechDocument = {
      content: mainContent,
      url,
      title,
      lastUpdated: new Date()
    };
    
    await saveMainDocument(techDir, mainDocument);
    
    // Fetch related documents (limit to 5 to avoid overloading)
    const relatedDocuments: TechDocument[] = [];
    const linksToProcess = links.slice(0, 5);
    
    for (const link of linksToProcess) {
      try {
        // Skip if link doesn't seem to be documentation
        if (!isLikelyDocumentation(link, techName)) {
          continue;
        }
        
        // Extract page name from URL for filename
        const pageName = getPageNameFromUrl(link);
        const existingFilePath = path.join(techDir, `${pageName}.md`);
        
        // Skip if we already have this document
        if (await existsAsync(existingFilePath)) {
          const existingContent = await fs.readFile(existingFilePath, 'utf-8');
          const titleMatch = existingContent.match(/^#\s+(.+)$/m);
          const title = titleMatch ? titleMatch[1] : pageName;
          
          relatedDocuments.push({
            content: existingContent,
            url: link,
            title,
            lastUpdated: new Date((await fs.stat(existingFilePath)).mtime)
          });
          
          continue;
        }
        
        // Fetch and save related document
        logInfo(`Fetching related document: ${link}`, { tag: 'TECH_DOCS' });
        const contentResult = await readDocumentation(link);
        
        // Extract title
        const docTitleMatch = contentResult.content?.match(/^#\s+(.+)$/m);
        const docTitle = docTitleMatch ? docTitleMatch[1] : pageName;
        
        const document: TechDocument = {
          content: contentResult.content || '',
          url: link,
          title: docTitle,
          lastUpdated: new Date()
        };
        
        await saveRelatedDocument(techDir, document, pageName);
        relatedDocuments.push(document);
      } catch (error) {
        logError(`Failed to fetch related document ${link}: ${error}`, { tag: 'TECH_DOCS' });
      }
    }
    
    // Create index file listing all documents
    await createIndexFile(techDir, techName, mainDocument, relatedDocuments);
    
    const result: TechDocDirectory = {
      mainDocument,
      relatedDocuments,
      links
    };
    
    // Store in cache
    techDocDirectoryCache[normalizedTechName] = {
      timestamp: now,
      data: result
    };
    
    return result;
  } catch (error) {
    logError(`Failed to fetch tech documentation for ${techName}: ${error}`, { tag: 'TECH_DOCS' });
    throw error;
  }
}

/**
 * Saves the main documentation file for a technology
 */
async function saveMainDocument(
  techDir: string,
  document: TechDocument
): Promise<void> {
  const filePath = path.join(techDir, 'index.md');
  
  try {
    await fs.writeFile(filePath, document.content, 'utf-8');
    logInfo(`Saved main document for ${path.basename(techDir)} at ${filePath}`, { tag: 'TECH_DOCS' });
  } catch (error) {
    logError(`Failed to save main document: ${error}`, { tag: 'TECH_DOCS' });
    throw error;
  }
}

/**
 * Saves a related documentation file
 */
async function saveRelatedDocument(
  techDir: string,
  document: TechDocument,
  pageName: string
): Promise<void> {
  const filePath = path.join(techDir, `${pageName}.md`);
  
  try {
    await fs.writeFile(filePath, document.content, 'utf-8');
    logInfo(`Saved related document at ${filePath}`, { tag: 'TECH_DOCS' });
  } catch (error) {
    logError(`Failed to save related document: ${error}`, { tag: 'TECH_DOCS' });
    throw error;
  }
}

/**
 * Creates an index file listing all documents for a technology
 */
async function createIndexFile(
  techDir: string,
  techName: string,
  mainDocument: TechDocument,
  relatedDocuments: TechDocument[]
): Promise<void> {
  const indexFilePath = path.join(techDir, '_index.md');
  
  // Build index content
  let indexContent = `# ${techName} Documentation Index\n\n`;
  indexContent += `Last updated: ${new Date().toISOString().split('T')[0]}\n\n`;
  
  // Main document
  indexContent += `## Main Documentation\n\n`;
  indexContent += `- [${mainDocument.title}](./index.md) - [Source](${mainDocument.url})\n\n`;
  
  // Related documents
  if (relatedDocuments.length > 0) {
    indexContent += `## Related Documentation\n\n`;
    
    for (const doc of relatedDocuments) {
      const filename = getPageNameFromUrl(doc.url) + '.md';
      indexContent += `- [${doc.title}](./${filename}) - [Source](${doc.url})\n`;
    }
  }
  
  try {
    await fs.writeFile(indexFilePath, indexContent, 'utf-8');
    logInfo(`Created index file at ${indexFilePath}`, { tag: 'TECH_DOCS' });
  } catch (error) {
    logError(`Failed to create index file: ${error}`, { tag: 'TECH_DOCS' });
    throw error;
  }
}

/**
 * Gets a technology documentation directory
 * Uses cache if available and not expired
 */
export async function getTechDocDirectory(techName: string): Promise<TechDocDirectory | null> {
  try {
    // Normalize tech name
    const normalizedTechName = techName.toLowerCase();
    
    // Check cache first
    const now = Date.now();
    const cachedDir = techDocDirectoryCache[normalizedTechName];
    
    if (cachedDir && (now - cachedDir.timestamp < CACHE_EXPIRY)) {
      logInfo(`Using cached tech documentation directory for ${techName}`, { tag: 'TECH_DOCS' });
      return cachedDir.data;
    }
    
    const techDir = path.join(process.cwd(), TECH_DOCS_BASE_DIR, normalizedTechName);
    
    // Check if directory exists
    if (!(await existsAsync(techDir))) {
      return null;
    }
    
    // Read index file
    const indexFilePath = path.join(techDir, 'index.md');
    if (!(await existsAsync(indexFilePath))) {
      return null;
    }
    
    const mainContent = await fs.readFile(indexFilePath, 'utf-8');
    const titleMatch = mainContent.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : `${techName} Documentation`;
    
    const mainDocument: TechDocument = {
      content: mainContent,
      url: '', // URL not stored
      title,
      lastUpdated: new Date((await fs.stat(indexFilePath)).mtime)
    };
    
    // Find related documents
    const relatedDocuments: TechDocument[] = [];
    const files = await fs.readdir(techDir);
    
    for (const file of files) {
      // Skip non-markdown files, index files, and main document
      if (!file.endsWith('.md') || file === 'index.md' || file === '_index.md') {
        continue;
      }
      
      const filePath = path.join(techDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const docTitleMatch = content.match(/^#\s+(.+)$/m);
      const docTitle = docTitleMatch ? docTitleMatch[1] : file.replace('.md', '');
      
      relatedDocuments.push({
        content,
        url: '', // URL not stored
        title: docTitle,
        lastUpdated: new Date((await fs.stat(filePath)).mtime)
      });
    }
    
    // Extract links from main document
    const links = extractLinksFromMarkdown(mainContent);
    
    const result: TechDocDirectory = {
      mainDocument,
      relatedDocuments,
      links
    };
    
    // Store in cache
    techDocDirectoryCache[normalizedTechName] = {
      timestamp: now,
      data: result
    };
    
    return result;
  } catch (error) {
    logError(`Failed to get tech doc directory for ${techName}: ${error}`, { tag: 'TECH_DOCS' });
    return null;
  }
}

/**
 * Extracts a page name from a URL for use in filenames
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

/**
 * Determines if a URL is likely to be documentation
 */
function isLikelyDocumentation(url: string, techName: string): boolean {
  // Convert tech name to lowercase for case-insensitive comparison
  const lowercaseTechName = techName.toLowerCase();
  const lowercaseUrl = url.toLowerCase();
  
  // Check if URL contains the tech name
  if (!lowercaseUrl.includes(lowercaseTechName)) {
    return false;
  }
  
  // Check for documentation-related keywords in the URL
  const docKeywords = ['docs', 'documentation', 'guide', 'tutorial', 'reference', 'api', 'manual'];
  if (docKeywords.some(keyword => lowercaseUrl.includes(keyword))) {
    return true;
  }
  
  // Exclude URLs that are likely not documentation
  const excludeKeywords = ['blog', 'forum', 'community', 'twitter', 'youtube', 'video', 'pricing', 'download'];
  if (excludeKeywords.some(keyword => lowercaseUrl.includes(keyword))) {
    return false;
  }
  
  // Default to true if URL contains tech name and doesn't match exclusions
  return true;
}

/**
 * Clears the tech documentation cache
 */
export function clearTechDocCache(): void {
  Object.keys(techDocDirectoryCache).forEach(key => {
    delete techDocDirectoryCache[key];
  });
  logInfo('Cleared tech documentation cache', { tag: 'TECH_DOCS' });
} 