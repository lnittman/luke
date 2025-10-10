import { z } from "zod";

export const globalAnalysisSchema = z.object({
  date: z.string(),
  title: z.string(),
  haiku: z.string().optional(),
  narrative: z.string(),
  highlights: z.array(z.string()),
  repoSummaries: z.array(
    z.object({
      repository: z.string(),
      commitCount: z.number(),
      mainFocus: z.string(),
      progress: z.string(),
    })
  ),
  crossRepoPatterns: z.array(z.string()),
  technicalThemes: z.array(z.string()),
  suggestions: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      category: z.string(),
      priority: z.string(),
    })
  ).optional().default([]),
  metrics: z.object({
    totalCommits: z.number(),
    totalRepos: z.number(),
    primaryLanguages: z.array(z.string()),
    codeQualityTrend: z.enum(["improving", "stable", "declining"]),
    productivityScore: z.number(),
  }),
});

export type GlobalAnalysis = z.infer<typeof globalAnalysisSchema>;

export const commitAnalysisSchema = z.object({
  commitSha: z.string(),
  summary: z.string(),
  impact: z.enum(["minor", "moderate", "major"]),
  category: z.enum(["feature", "bugfix", "refactor", "docs", "test", "style", "perf", "build", "ci", "chore"]),
  technicalDetails: z.array(z.string()),
  filesAnalysis: z.array(
    z.object({ path: z.string(), changeType: z.enum(["added", "modified", "deleted", "renamed"]), summary: z.string(), keyChanges: z.array(z.string()) })
  ),
  dependencies: z.array(z.string()),
  patterns: z.array(z.string()),
  potentialIssues: z.array(z.string()),
  codeQuality: z.object({ score: z.number(), strengths: z.array(z.string()), improvements: z.array(z.string()) }),
});

export const repoAnalysisSchema = z.object({
  repository: z.string(),
  date: z.string(),
  summary: z.string(),
  keyProgress: z.array(z.object({ title: z.string(), description: z.string(), commits: z.array(z.string()) })),
  metrics: z.object({ totalCommits: z.number(), linesAdded: z.number(), linesRemoved: z.number(), filesChanged: z.number(), primaryLanguages: z.array(z.string()) }),
  focusAreas: z.array(z.string()),
  technicalHighlights: z.array(z.string()),
  momentum: z.enum(["accelerating", "steady", "slowing", "blocked"]),
  nextSteps: z.array(z.object({ priority: z.enum(["critical", "high", "medium", "low"]), title: z.string(), rationale: z.string() })),
  codeHealth: z.object({ trend: z.enum(["improving", "stable", "degrading"]), concerns: z.array(z.string()), strengths: z.array(z.string()) }),
});
