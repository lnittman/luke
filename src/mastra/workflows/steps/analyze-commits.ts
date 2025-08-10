import { createStep } from '@mastra/core/workflows'
import { Octokit } from '@octokit/rest'
import { z } from 'zod'
import { commitAnalysisAgent } from '../../agents/commit-analysis'
import type { CommitAnalysis } from '../../types/analysis'

async function fetchCommitDiff(
  octokit: Octokit,
  owner: string,
  repo: string,
  sha: string
) {
  try {
    const { data: commit } = await octokit.repos.getCommit({
      owner,
      repo,
      ref: sha,
    })

    const files = commit.files?.map((file) => ({
      filename: file.filename,
      status: file.status,
      additions: file.additions,
      deletions: file.deletions,
      changes: file.changes,
      patch: file.patch,
      previous_filename: file.previous_filename,
    })) || []

    return {
      sha: commit.sha,
      message: commit.commit.message,
      author: commit.commit.author,
      committer: commit.commit.committer,
      stats: commit.stats,
      files,
      html_url: commit.html_url,
      parents: commit.parents.map((p) => p.sha),
    }
  } catch (error) {
    console.error(`Error fetching commit ${sha}:`, error)
    return null
  }
}

export const analyzeCommitsStep = createStep({
  id: 'analyze-commits',
  description: 'Analyze each commit with full code diffs',
  inputSchema: z.object({
    commits: z.array(
      z.object({
        repository: z.string(),
        owner: z.string(),
        name: z.string(),
        sha: z.string(),
        message: z.string(),
        url: z.string(),
        author: z.object({
          name: z.string().nullable(),
          email: z.string().nullable(),
          date: z.string().nullable(),
        }),
      })
    ),
    githubToken: z.string(),
  }),
  outputSchema: z.object({
    analyses: z.array(
      z.object({
        repository: z.string(),
        sha: z.string(),
        analysis: z.any(), // CommitAnalysis type
      })
    ),
  }),
  execute: async ({ inputData }) => {
    const { commits, githubToken } = inputData
    const octokit = new Octokit({ auth: githubToken })
    const analyses: Array<{
      repository: string
      sha: string
      analysis: any
    }> = []

    // Process commits in batches to respect rate limits
    const batchSize = 3
    
    for (let i = 0; i < commits.length; i += batchSize) {
      const batch = commits.slice(i, i + batchSize)
      
      await Promise.all(
        batch.map(async (commit) => {
          try {
            // Fetch full commit details including diffs
            const commitDetails = await fetchCommitDiff(
              octokit,
              commit.owner,
              commit.name,
              commit.sha
            )

            if (!commitDetails) return

            // Prepare diff context for analysis (limit to 15 files for token management)
            const diffContext = commitDetails.files
              .slice(0, 15)
              .map((file) => `
File: ${file.filename}
Status: ${file.status}
Changes: +${file.additions} -${file.deletions}
${file.patch ? `\nDiff:\n${file.patch.slice(0, 2000)}` : 'No diff available'}
              `.trim())
              .join('\n\n---\n\n')

            const analysisPrompt = `
Analyze this Git commit:

Repository: ${commit.repository}
SHA: ${commit.sha}
Message: ${commitDetails.message}
Author: ${commitDetails.author?.name} <${commitDetails.author?.email}>
Stats: ${commitDetails.stats?.total} changes (+${commitDetails.stats?.additions} -${commitDetails.stats?.deletions})
Files: ${commitDetails.files.length}

Code Changes:
${diffContext}

Provide comprehensive analysis following your instructions.
            `.trim()

            const result = await commitAnalysisAgent.generate([
              { role: 'user', content: analysisPrompt },
            ])

            analyses.push({
              repository: commit.repository,
              sha: commit.sha,
              analysis: result.object || JSON.parse(result.text || '{}'),
            })
          } catch (error) {
            console.error(`Error analyzing commit ${commit.sha}:`, error)
          }
        })
      )

      // Rate limit delay between batches
      if (i + batchSize < commits.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    return { analyses }
  },
})