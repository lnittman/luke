import { z } from 'zod'

// Commit Analysis Schema
export const commitAnalysisSchema = z.object({
  commitSha: z.string(),
  summary: z.string().describe('1-2 sentence summary of what this commit achieves'),
  impact: z.enum(['minor', 'moderate', 'major']).describe('Impact level of changes'),
  category: z.enum([
    'feature',
    'bugfix',
    'refactor',
    'docs',
    'test',
    'style',
    'perf',
    'build',
    'ci',
    'chore',
  ]).describe('Type of change'),
  technicalDetails: z.array(z.string()).describe('Key technical changes and decisions'),
  filesAnalysis: z.array(
    z.object({
      path: z.string(),
      changeType: z.enum(['added', 'modified', 'deleted', 'renamed']),
      summary: z.string().describe('What changed in this file'),
      keyChanges: z.array(z.string()).describe('Specific important changes'),
    })
  ),
  dependencies: z.array(z.string()).describe('New or modified dependencies'),
  patterns: z.array(z.string()).describe('Design patterns or architectural decisions'),
  potentialIssues: z.array(z.string()).describe('Potential bugs, security issues, or technical debt'),
  codeQuality: z.object({
    score: z.number().min(1).max(10),
    strengths: z.array(z.string()),
    improvements: z.array(z.string()),
  }),
})

export type CommitAnalysis = z.infer<typeof commitAnalysisSchema>

// Repository Analysis Schema
export const repoAnalysisSchema = z.object({
  repository: z.string(),
  date: z.string(),
  summary: z.string().describe('Narrative summary of the day\'s progress'),
  keyProgress: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      commits: z.array(z.string()).describe('Related commit SHAs'),
    })
  ).describe('Major progress items achieved'),
  metrics: z.object({
    totalCommits: z.number(),
    linesAdded: z.number(),
    linesRemoved: z.number(),
    filesChanged: z.number(),
    primaryLanguages: z.array(z.string()),
  }),
  focusAreas: z.array(z.string()).describe('Main areas of focus'),
  technicalHighlights: z.array(z.string()).describe('Notable technical achievements'),
  momentum: z.enum(['accelerating', 'steady', 'slowing', 'blocked']),
  nextSteps: z.array(
    z.object({
      priority: z.enum(['critical', 'high', 'medium', 'low']),
      title: z.string(),
      rationale: z.string(),
    })
  ),
  codeHealth: z.object({
    trend: z.enum(['improving', 'stable', 'degrading']),
    concerns: z.array(z.string()),
    strengths: z.array(z.string()),
  }),
})

export type RepoAnalysis = z.infer<typeof repoAnalysisSchema>

// Suggestion Schema
export const suggestionSchema = z.object({
  id: z.string(),
  title: z.string().describe('Short, actionable title'),
  category: z.enum([
    'feature',
    'refactor',
    'optimization',
    'security',
    'testing',
    'documentation',
    'architecture',
    'deployment',
  ]),
  priority: z.enum(['critical', 'high', 'medium', 'low']),
  estimatedEffort: z.enum(['minutes', 'hours', 'days', 'weeks']),
  rationale: z.string().describe('Why this suggestion based on recent work'),
  dependencies: z.array(z.string()).describe('What needs to be in place first'),
  prompt: z.string().describe('Full markdown prompt for AI assistants'),
  contextFiles: z.array(z.string()).describe('Relevant files to include'),
  relatedCommits: z.array(z.string()).describe('Recent commits that relate'),
})

export type Suggestion = z.infer<typeof suggestionSchema>

// Global Analysis Schema
export const globalAnalysisSchema = z.object({
  date: z.string(),
  title: z.string().describe('Compelling title for the day\'s work'),
  narrative: z.string().describe('2-3 paragraph story of development'),
  highlights: z.array(z.string()).describe('5-10 key accomplishments'),
  repoSummaries: z.array(
    z.object({
      repository: z.string(),
      commitCount: z.number(),
      mainFocus: z.string(),
      progress: z.string(),
    })
  ),
  crossRepoPatterns: z.array(z.string()).describe('Patterns across repositories'),
  technicalThemes: z.array(z.string()).describe('Overarching technical themes'),
  suggestions: z.array(suggestionSchema).describe('Contextual next steps'),
  metrics: z.object({
    totalCommits: z.number(),
    totalRepos: z.number(),
    primaryLanguages: z.array(z.string()),
    codeQualityTrend: z.enum(['improving', 'stable', 'declining']),
    productivityScore: z.number().min(1).max(10),
  }),
})

export type GlobalAnalysis = z.infer<typeof globalAnalysisSchema>