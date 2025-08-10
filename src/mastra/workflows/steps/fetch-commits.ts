import { createStep } from '@mastra/core/workflows'
import { Octokit } from '@octokit/rest'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db, repositories } from '@/lib/db'

export const fetchCommitsStep = createStep({
  id: 'fetch-commits',
  description: 'Fetch all commits for enabled repositories',
  inputSchema: z.object({
    date: z.date(),
    githubToken: z.string(),
  }),
  outputSchema: z.object({
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
  }),
  execute: async ({ inputData }) => {
    const { date, githubToken } = inputData
    const octokit = new Octokit({ auth: githubToken })

    // Get enabled repositories
    const enabledRepos = await db
      .select()
      .from(repositories)
      .where(
        and(
          eq(repositories.scope, 'github'),
          eq(repositories.analysisEnabled, true)
        )
      )

    if (enabledRepos.length === 0) {
      console.log('No repositories enabled for analysis')
      return { commits: [] }
    }

    // Set date range for the day
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const allCommits = []

    for (const repo of enabledRepos) {
      try {
        const { data: commits } = await octokit.repos.listCommits({
          owner: repo.owner,
          repo: repo.name,
          since: startOfDay.toISOString(),
          until: endOfDay.toISOString(),
        })

        for (const commit of commits) {
          allCommits.push({
            repository: repo.fullName,
            owner: repo.owner,
            name: repo.name,
            sha: commit.sha,
            message: commit.commit.message,
            url: commit.html_url,
            author: {
              name: commit.commit.author?.name || null,
              email: commit.commit.author?.email || null,
              date: commit.commit.author?.date || null,
            },
          })
        }
      } catch (error) {
        console.error(`Error fetching commits for ${repo.fullName}:`, error)
      }
    }

    console.log(`Found ${allCommits.length} commits across ${enabledRepos.length} repositories`)
    return { commits: allCommits }
  },
})