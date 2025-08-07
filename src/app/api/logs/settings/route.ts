import { NextRequest, NextResponse } from 'next/server';
import { 
  db, 
  repositories, 
  analysisRules, 
  userPreferences 
} from '@/lib/db';
import { eq, and } from 'drizzle-orm';

// GET settings
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({
      repositories: [],
      rules: {},
      preferences: {
        defaultAnalysisDepth: 'deep',
        focusAreas: ['architecture', 'performance', 'security', 'code-quality'],
        aiVerbosity: 'detailed',
      },
    });
  }

  try {
    const username = process.env.GITHUB_USERNAME || 'lnittman';
    
    // Get user preferences
    const [prefs] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, username))
      .limit(1);
    
    // Get all repositories
    const repos = await db
      .select()
      .from(repositories)
      .orderBy(repositories.fullName);
    
    // Get all rules grouped by repository
    const allRules = await db
      .select()
      .from(analysisRules)
      .orderBy(analysisRules.priority);
    
    // Group rules by repository
    const rulesMap: Record<string, any[]> = {};
    for (const rule of allRules) {
      if (!rulesMap[rule.repositoryId]) {
        rulesMap[rule.repositoryId] = [];
      }
      rulesMap[rule.repositoryId].push(rule);
    }
    
    return NextResponse.json({
      repositories: repos,
      rules: rulesMap,
      preferences: prefs || {
        defaultAnalysisDepth: 'deep',
        focusAreas: ['architecture', 'performance', 'security', 'code-quality'],
        aiVerbosity: 'detailed',
      },
    });
  } catch (error) {
    console.error('Error loading settings:', error);
    return NextResponse.json(
      { error: 'Failed to load settings' },
      { status: 500 }
    );
  }
}

// POST save settings
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ success: true });
  }

  try {
    const { repositories: repos, rules, preferences } = await request.json();
    const username = process.env.GITHUB_USERNAME || 'lnittman';
    
    // Save user preferences
    if (preferences) {
      const existing = await db
        .select()
        .from(userPreferences)
        .where(eq(userPreferences.userId, username))
        .limit(1);
      
      if (existing.length > 0) {
        await db
          .update(userPreferences)
          .set({
            ...preferences,
            updatedAt: new Date(),
          })
          .where(eq(userPreferences.userId, username));
      } else {
        await db
          .insert(userPreferences)
          .values({
            userId: username,
            ...preferences,
          });
      }
    }
    
    // Update repositories
    if (repos) {
      for (const repo of repos) {
        if (repo.id.startsWith('temp-')) {
          // Skip temporary repos - they should be added via the repository endpoint
          continue;
        }
        
        await db
          .update(repositories)
          .set({
            analysisEnabled: repo.analysisEnabled,
            analysisDepth: repo.analysisDepth,
            updatedAt: new Date(),
          })
          .where(eq(repositories.id, repo.id));
      }
    }
    
    // Update rules
    if (rules) {
      for (const [repoId, repoRules] of Object.entries(rules)) {
        // Delete existing rules for this repo
        await db
          .delete(analysisRules)
          .where(eq(analysisRules.repositoryId, repoId));
        
        // Insert new rules
        if (Array.isArray(repoRules) && repoRules.length > 0) {
          const validRules = (repoRules as any[]).filter(r => r.ruleContent?.trim());
          
          if (validRules.length > 0) {
            await db
              .insert(analysisRules)
              .values(validRules.map(rule => ({
                repositoryId: repoId,
                name: rule.name,
                description: rule.description,
                enabled: rule.enabled,
                priority: rule.priority,
                ruleType: rule.ruleType,
                ruleContent: rule.ruleContent,
                applyTo: rule.applyTo,
                metadata: rule.metadata,
              })));
          }
        }
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}