import { createStep } from '@mastra/core/workflows'
import { z } from 'zod'
import { activityDetails, activityLogs, db } from '@/lib/db'
import type { GlobalAnalysis, RepoAnalysis, CommitAnalysis } from '../../types/analysis'

export const storeAnalysisStep = createStep({
  id: 'store-analysis',
  description: 'Store all analysis data in the database',
  inputSchema: z.object({
    globalAnalysis: z.any(), // GlobalAnalysis
    repoAnalyses: z.array(z.any()), // RepoAnalysis[]
    commitAnalyses: z.array(
      z.object({
        repository: z.string(),
        sha: z.string(),
        analysis: z.any(), // CommitAnalysis
      })
    ),
    date: z.date(),
  }),
  outputSchema: z.object({
    logId: z.string(),
    success: z.boolean(),
  }),
  execute: async ({ inputData }) => {
    const { globalAnalysis, repoAnalyses, commitAnalyses, date } = inputData

    try {
      // Store main activity log with enhanced metadata
      const [newLog] = await db
        .insert(activityLogs)
        .values({
          date: new Date(date),
          logType: 'global',
          repositoryId: null,
          title: globalAnalysis.title,
          summary: globalAnalysis.narrative,
          bullets: globalAnalysis.highlights,
          rawData: {
            globalAnalysis,
            repoAnalyses,
            commitAnalyses,
          },
          metadata: {
            ...globalAnalysis.metrics,
            suggestions: globalAnalysis.suggestions?.map((s: any) => ({
              id: s.id,
              title: s.title,
              category: s.category,
              priority: s.priority,
            })),
            repoSummaries: globalAnalysis.repoSummaries,
            crossRepoPatterns: globalAnalysis.crossRepoPatterns,
            technicalThemes: globalAnalysis.technicalThemes,
            codeQualityTrend: globalAnalysis.metrics.codeQualityTrend,
            productivityScore: globalAnalysis.metrics.productivityScore,
          },
          processed: true,
          analysisDepth: 'deep',
        })
        .returning()

      // Store detailed activity records
      const details = []
      
      // Store commit analyses as details
      for (const { repository, sha, analysis } of commitAnalyses) {
        details.push({
          logId: newLog.id,
          type: 'commit' as const,
          title: analysis.summary,
          description: JSON.stringify({
            impact: analysis.impact,
            category: analysis.category,
            technicalDetails: analysis.technicalDetails,
            codeQuality: analysis.codeQuality,
            patterns: analysis.patterns,
            potentialIssues: analysis.potentialIssues,
          }),
          url: `https://github.com/${repository}/commit/${sha}`,
          metadata: {
            repository,
            sha,
            analysis,
          },
        })
      }

      // Store repository analyses as details
      for (const repoAnalysis of repoAnalyses) {
        details.push({
          logId: newLog.id,
          type: 'repository' as const,
          title: `${repoAnalysis.repository}: ${repoAnalysis.summary.substring(0, 100)}...`,
          description: JSON.stringify({
            momentum: repoAnalysis.momentum,
            codeHealth: repoAnalysis.codeHealth,
            focusAreas: repoAnalysis.focusAreas,
            metrics: repoAnalysis.metrics,
          }),
          url: `https://github.com/${repoAnalysis.repository}`,
          metadata: repoAnalysis,
        })
      }

      // Store suggestions as separate details
      if (globalAnalysis.suggestions && Array.isArray(globalAnalysis.suggestions)) {
        for (const suggestion of globalAnalysis.suggestions) {
          details.push({
            logId: newLog.id,
            type: 'suggestion' as const,
            title: suggestion.title,
            description: suggestion.rationale,
            url: '', // No URL for suggestions
            metadata: {
              suggestion,
              prompt: suggestion.prompt,
              category: suggestion.category,
              priority: suggestion.priority,
              estimatedEffort: suggestion.estimatedEffort,
              dependencies: suggestion.dependencies,
              contextFiles: suggestion.contextFiles,
              relatedCommits: suggestion.relatedCommits,
            },
          })
        }
      }

      // Store all details
      if (details.length > 0) {
        await db.insert(activityDetails).values(details)
      }

      console.log(`Stored daily analysis with ${details.length} detail records`)
      return { logId: newLog.id, success: true }
    } catch (error) {
      console.error('Error storing analysis data:', error)
      return { logId: '', success: false }
    }
  },
})