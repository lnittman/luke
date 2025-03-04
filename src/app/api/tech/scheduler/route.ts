import { NextRequest, NextResponse } from 'next/server';
import { list, put } from '@vercel/blob';
import axios from 'axios';

export const maxDuration = 120; // 120 second timeout for tech registry updates

// Registry of known tech stacks to monitor
const MONITORED_TECH_STACKS = [
  'Next.js',
  'React',
  'Vue.js',
  'Angular',
  'Svelte',
  'Node.js',
  'Express',
  'Django',
  'Flask',
  'Laravel',
  'Ruby on Rails',
  'SwiftUI',
  'UIKit',
  'React Native',
  'Flutter',
  'Tauri',
  'Electron',
  'Spring Boot',
  'ASP.NET Core',
  'GraphQL',
  'Kubernetes',
  'Docker',
  'AWS',
  'Azure',
  'Google Cloud'
];

// Detection of framework relationships
const TECH_RELATIONSHIPS: Record<string, string[]> = {
  'Next.js': ['React', 'TypeScript', 'Node.js', 'Vercel'],
  'React': ['JavaScript', 'TypeScript', 'Webpack', 'Redux'],
  'Vue.js': ['JavaScript', 'TypeScript', 'Pinia', 'Vite'],
  'Angular': ['TypeScript', 'RxJS', 'Node.js', 'Webpack'],
  'Svelte': ['JavaScript', 'TypeScript', 'Vite', 'SvelteKit'],
  'Node.js': ['JavaScript', 'TypeScript', 'Express', 'npm'],
  'Express': ['Node.js', 'JavaScript', 'TypeScript', 'MongoDB'],
  'React Native': ['React', 'JavaScript', 'TypeScript', 'Expo'],
  'Flutter': ['Dart', 'Material Design', 'Firebase', 'Android Studio'],
  'SwiftUI': ['Swift', 'UIKit', 'Xcode', 'iOS'],
  'UIKit': ['Swift', 'Objective-C', 'Xcode', 'iOS'],
  'Tauri': ['Rust', 'JavaScript', 'TypeScript', 'WebView'],
  'Electron': ['JavaScript', 'TypeScript', 'Node.js', 'Chromium']
};

// Check update frequency - 7 days
const UPDATE_FREQUENCY_MS = 7 * 24 * 60 * 60 * 1000;

interface StackInfo {
  lastUpdated: string;
  nextScheduledUpdate?: string;
  relationships?: string[];
}

/**
 * Check if a tech stack needs updating
 */
function needsUpdate(stackInfo: StackInfo | undefined): boolean {
  if (!stackInfo || !stackInfo.lastUpdated) {
    return true;
  }
  
  const lastUpdated = new Date(stackInfo.lastUpdated).getTime();
  const ageMs = Date.now() - lastUpdated;
  
  return ageMs > UPDATE_FREQUENCY_MS;
}

/**
 * Scan the registry to identify tech stacks that need updates
 */
async function scanRegistry(): Promise<{
  techsToUpdate: string[];
  currentRegistry: Record<string, StackInfo>;
}> {
  // Get current registry data
  let currentRegistry: Record<string, StackInfo> = {};
  const techsToUpdate: string[] = [];
  
  try {
    // List all blobs
    const { blobs } = await list();
    
    // Find tech-*.md files
    for (const blob of blobs) {
      if (blob.pathname.startsWith('tech-') && blob.pathname.endsWith('.md')) {
        const techName = blob.pathname.replace('tech-', '').replace('.md', '');
        const uploadDate = new Date(blob.uploadedAt);
        
        // Add to registry
        currentRegistry[techName] = {
          lastUpdated: uploadDate.toISOString()
        };
        
        // Check if needs update
        if (needsUpdate(currentRegistry[techName])) {
          // Normalize tech name for comparison
          const normalizedTechName = techName.replace(/-/g, ' ');
          
          // Find matching tech in monitored list
          const matchingTech = MONITORED_TECH_STACKS.find(tech => 
            tech.toLowerCase() === normalizedTechName.toLowerCase());
          
          if (matchingTech) {
            techsToUpdate.push(matchingTech);
          }
        }
      }
    }
    
    // Add missing tech stacks that need to be created
    for (const tech of MONITORED_TECH_STACKS) {
      const normalizedTech = tech.toLowerCase().replace(/\s+/g, '-');
      
      if (!currentRegistry[normalizedTech]) {
        techsToUpdate.push(tech);
      }
    }
    
    return { techsToUpdate, currentRegistry };
  } catch (error) {
    console.error("Error scanning registry:", error);
    return { 
      techsToUpdate: MONITORED_TECH_STACKS.slice(0, 3), // Only update first 3 in case of error
      currentRegistry
    };
  }
}

/**
 * Update a single tech stack documentation
 */
async function updateTechStack(framework: string): Promise<boolean> {
  try {
    console.log(`[TECH SCHEDULER] Updating tech stack for: ${framework}`);
    
    // Make request to the generate endpoint
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    
    const response = await axios.post(
      `${baseUrl}/api/tech/generate`,
      { framework },
      { 
        headers: { 'Content-Type': 'application/json' },
        timeout: 60000  // 60 second timeout
      }
    );
    
    if (response.status === 200) {
      console.log(`[TECH SCHEDULER] Successfully updated ${framework}`);
      return true;
    } else {
      console.error(`[TECH SCHEDULER] Failed to update ${framework}: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error(`[TECH SCHEDULER] Error updating ${framework}:`, error);
    return false;
  }
}

/**
 * API route to schedule tech stack documentation updates
 */
export async function GET(request: NextRequest) {
  try {
    console.log('[TECH SCHEDULER] Received request to scan and update tech stacks');
    
    // Scan registry to find tech stacks that need updates
    const { techsToUpdate, currentRegistry } = await scanRegistry();
    
    console.log(`[TECH SCHEDULER] Found ${techsToUpdate.length} tech stacks needing updates`);
    
    if (techsToUpdate.length === 0) {
      return NextResponse.json({
        message: 'No tech stacks need updating at this time',
        nextScheduledScan: new Date(Date.now() + UPDATE_FREQUENCY_MS).toISOString()
      });
    }
    
    // Limit to 3 updates per run to avoid timeouts
    const techsToProcess = techsToUpdate.slice(0, 3);
    console.log(`[TECH SCHEDULER] Processing updates for: ${techsToProcess.join(', ')}`);
    
    // Update each tech stack sequentially
    const updateResults: Record<string, boolean> = {};
    for (const tech of techsToProcess) {
      updateResults[tech] = await updateTechStack(tech);
    }
    
    // Update registry with relationships
    for (const tech of techsToProcess) {
      if (updateResults[tech]) {
        const normalizedTech = tech.toLowerCase().replace(/\s+/g, '-');
        
        // Update relationships if available
        if (TECH_RELATIONSHIPS[tech]) {
          if (!currentRegistry[normalizedTech]) {
            currentRegistry[normalizedTech] = {
              lastUpdated: new Date().toISOString()
            };
          }
          
          currentRegistry[normalizedTech].relationships = TECH_RELATIONSHIPS[tech];
        }
      }
    }
    
    // Schedule next updates
    const remainingTechs = techsToUpdate.slice(3);
    const nextScheduledUpdate = remainingTechs.length > 0 
      ? 'Additional updates needed for: ' + remainingTechs.join(', ')
      : 'All tech stacks up to date';
    
    return NextResponse.json({
      message: `Processed ${techsToProcess.length} tech stack updates`,
      updated: updateResults,
      nextScheduledUpdate,
      registry: Object.keys(currentRegistry).length
    });
  } catch (error: any) {
    console.error(`[TECH SCHEDULER] Error in tech scheduler: ${error.message}`);
    return NextResponse.json(
      { error: `Error in tech scheduler: ${error.message}` },
      { status: 500 }
    );
  }
} 