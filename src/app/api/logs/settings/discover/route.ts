import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';

const execAsync = promisify(exec);

interface DiscoveredRepo {
  id: string;
  owner: string;
  name: string;
  fullName: string;
  description: string | null;
  language: string | null;
  path: string;
  enabled: boolean;
  scope: 'local' | 'github';
  lastActivity?: string;
  commitCount?: number;
}

async function getGitInfo(repoPath: string): Promise<Partial<DiscoveredRepo> | null> {
  try {
    // Get remote origin URL
    const { stdout: remoteUrl } = await execAsync('git remote get-url origin', { cwd: repoPath });
    
    // Parse GitHub URL
    const match = remoteUrl.trim().match(/github\.com[:/]([^/]+)\/(.+?)(\.git)?$/);
    if (!match) return null;
    
    const owner = match[1];
    const name = match[2];
    
    // Get last commit date
    const { stdout: lastCommit } = await execAsync(
      'git log -1 --format=%cd --date=relative',
      { cwd: repoPath }
    );
    
    // Get commit count in last 30 days
    const { stdout: commitCount } = await execAsync(
      'git rev-list --count --since="30 days ago" HEAD',
      { cwd: repoPath }
    );
    
    // Get primary language (most common file extension)
    const { stdout: languages } = await execAsync(
      'git ls-files | sed -n "s/.*\\.//p" | sort | uniq -c | sort -rn | head -1',
      { cwd: repoPath }
    );
    
    const langMatch = languages.trim().match(/\d+\s+(\w+)/);
    const primaryLang = langMatch ? langMatch[1].toUpperCase() : null;
    
    return {
      owner,
      name,
      fullName: `${owner}/${name}`,
      lastActivity: lastCommit.trim(),
      commitCount: parseInt(commitCount.trim()) || 0,
      language: primaryLang,
      scope: 'github' as const,
    };
  } catch (error) {
    return null;
  }
}

async function discoverLocalRepositories(): Promise<DiscoveredRepo[]> {
  const repos: DiscoveredRepo[] = [];
  
  // Common paths to search for repositories
  const searchPaths = [
    path.join(process.env.HOME || '', 'Developer'),
    path.join(process.env.HOME || '', 'Projects'),
    path.join(process.env.HOME || '', 'Code'),
    path.join(process.env.HOME || '', 'dev'),
    path.join(process.env.HOME || '', 'work'),
    // Current project's parent directory
    path.join(process.cwd(), '..'),
  ];
  
  for (const searchPath of searchPaths) {
    try {
      const exists = await fs.access(searchPath).then(() => true).catch(() => false);
      if (!exists) continue;
      
      const entries = await fs.readdir(searchPath, { withFileTypes: true });
      
      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        
        const fullPath = path.join(searchPath, entry.name);
        
        // Check if it's a git repository
        const gitPath = path.join(fullPath, '.git');
        const isGitRepo = await fs.access(gitPath).then(() => true).catch(() => false);
        
        if (isGitRepo) {
          const gitInfo = await getGitInfo(fullPath);
          
          if (gitInfo && gitInfo.fullName) {
            // Generate a stable ID based on the path
            const id = Buffer.from(fullPath).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
            
            repos.push({
              id,
              owner: gitInfo.owner || 'local',
              name: gitInfo.name || entry.name,
              fullName: gitInfo.fullName || `local/${entry.name}`,
              description: null,
              language: gitInfo.language || null,
              path: fullPath,
              enabled: false, // Default to disabled
              scope: gitInfo.scope || 'local',
              lastActivity: gitInfo.lastActivity,
              commitCount: gitInfo.commitCount,
            });
          }
        }
      }
    } catch (error) {
      console.error(`Error scanning ${searchPath}:`, error);
    }
  }
  
  // Sort by activity and commit count
  repos.sort((a, b) => {
    if (a.commitCount && b.commitCount) {
      return b.commitCount - a.commitCount;
    }
    return 0;
  });
  
  return repos;
}

export async function POST() {
  try {
    const repositories = await discoverLocalRepositories();
    
    // Auto-enable repositories with recent activity
    const reposWithSettings = repositories.map(repo => ({
      ...repo,
      enabled: (repo.commitCount && repo.commitCount > 5) || false
    }));
    
    return NextResponse.json({ 
      repositories: reposWithSettings,
      totalFound: repositories.length,
      autoEnabled: reposWithSettings.filter(r => r.enabled).length
    });
  } catch (error) {
    console.error('Error discovering repositories:', error);
    return NextResponse.json(
      { error: 'Failed to discover repositories' },
      { status: 500 }
    );
  }
}