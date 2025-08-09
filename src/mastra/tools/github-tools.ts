import { createTool } from '@mastra/core/tools'
import { Octokit } from '@octokit/rest'
import { z } from 'zod'

const octokit = new Octokit({
  auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
})

export const fetchUserActivityTool = createTool({
  id: 'fetch-user-activity',
  description: 'Fetch GitHub activity for a user on a specific date',
  inputSchema: z.object({
    username: z.string().describe('GitHub username'),
    date: z.string().describe('Date in YYYY-MM-DD format'),
  }),
  outputSchema: z.object({
    commits: z.array(z.any()),
    pullRequests: z.array(z.any()),
    issues: z.array(z.any()),
    reviews: z.array(z.any()),
    events: z.array(z.any()),
  }),
  execute: async ({ context }) => {
    const { username, date } = context
    const startDate = new Date(date)
    startDate.setHours(0, 0, 0, 0)
    const endDate = new Date(date)
    endDate.setHours(23, 59, 59, 999)

    try {
      // Fetch user events
      const { data: events } = await octokit.activity.listPublicEventsForUser({
        username,
        per_page: 100,
      })

      // Filter events by date
      const filteredEvents = events.filter((event) => {
        const eventDate = new Date(event.created_at!)
        return eventDate >= startDate && eventDate <= endDate
      })

      // Extract different types of activities
      const commits = filteredEvents
        .filter((e) => e.type === 'PushEvent')
        .flatMap((e) => (e.payload as any).commits || [])

      const pullRequests = filteredEvents
        .filter((e) => e.type === 'PullRequestEvent')
        .map((e) => (e.payload as any).pull_request)

      const issues = filteredEvents
        .filter((e) => e.type === 'IssuesEvent')
        .map((e) => (e.payload as any).issue)

      const reviews = filteredEvents
        .filter((e) => e.type === 'PullRequestReviewEvent')
        .map((e) => (e.payload as any).review)

      return {
        commits,
        pullRequests,
        issues,
        reviews,
        events: filteredEvents,
      }
    } catch (error) {
      console.error('Error fetching GitHub activity:', error)
      return {
        commits: [],
        pullRequests: [],
        issues: [],
        reviews: [],
        events: [],
      }
    }
  },
})

export const fetchCommitDetailsTool = createTool({
  id: 'fetch-commit-details',
  description: 'Fetch detailed information about a commit',
  inputSchema: z.object({
    owner: z.string().describe('Repository owner'),
    repo: z.string().describe('Repository name'),
    sha: z.string().describe('Commit SHA'),
  }),
  outputSchema: z.object({
    message: z.string(),
    files: z.array(z.any()),
    stats: z.any(),
  }),
  execute: async ({ context }) => {
    const { owner, repo, sha } = context
    try {
      const { data: commit } = await octokit.repos.getCommit({
        owner,
        repo,
        ref: sha,
      })

      return {
        message: commit.commit.message,
        files: commit.files || [],
        stats: commit.stats || {},
      }
    } catch (error) {
      console.error('Error fetching commit details:', error)
      return {
        message: '',
        files: [],
        stats: {},
      }
    }
  },
})

export const fetchRepoInfoTool = createTool({
  id: 'fetch-repo-info',
  description: 'Fetch information about a repository',
  inputSchema: z.object({
    owner: z.string().describe('Repository owner'),
    repo: z.string().describe('Repository name'),
  }),
  outputSchema: z.object({
    name: z.string(),
    description: z.string().nullable(),
    language: z.string().nullable(),
    topics: z.array(z.string()),
    stars: z.number(),
  }),
  execute: async ({ context }) => {
    const { owner, repo } = context
    try {
      const { data } = await octokit.repos.get({
        owner,
        repo,
      })

      return {
        name: data.name,
        description: data.description,
        language: data.language,
        topics: data.topics || [],
        stars: data.stargazers_count,
      }
    } catch (error) {
      console.error('Error fetching repo info:', error)
      return {
        name: repo,
        description: null,
        language: null,
        topics: [],
        stars: 0,
      }
    }
  },
})
