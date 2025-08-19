import { createWorkflow, createStep } from '@mastra/core/workflows'
import { z } from 'zod'
import { Octokit } from '@octokit/rest'
import { globalAnalysisAgent } from '../agents/global-analysis'
import { globalAnalysisSchema } from '../types/analysis'
import { db } from '@/lib/db'
import { activityLogs } from '@/lib/db/schema'

// Step 1: Fetch all GitHub activity for the day
const fetchDailyActivity = createStep({
  id: 'fetch-daily-activity',
  description: 'Fetches all GitHub activity for a specific date',
  inputSchema: z.object({
    date: z.string().describe('Date in YYYY-MM-DD format'),
  }),
  outputSchema: z.object({
    commits: z.array(z.object({
      sha: z.string(),
      message: z.string(),
      repository: z.string(),
      timestamp: z.string(),
      author: z.string(),
      url: z.string(),
    })),
    pullRequests: z.array(z.object({
      number: z.number(),
      title: z.string(),
      repository: z.string(),
      state: z.string(),
      url: z.string(),
    })),
    issues: z.array(z.object({
      number: z.number(),
      title: z.string(),
      repository: z.string(),
      state: z.string(),
      url: z.string(),
    })),
    totalCommits: z.number(),
    totalRepos: z.number(),
    repositories: z.array(z.string()),
  }),
  execute: async ({ inputData }) => {
    const octokit = new Octokit({
      auth: process.env.GITHUB_PAT,
    })

    const dateObj = new Date(inputData.date)
    const startDate = new Date(dateObj)
    startDate.setUTCHours(0, 0, 0, 0)
    const endDate = new Date(dateObj)
    endDate.setUTCHours(23, 59, 59, 999)

    console.log('📅 Fetching GitHub activity', {
      date: inputData.date,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    })

    try {
      // Fetch user info
      const { data: user } = await octokit.users.getAuthenticated()
      const username = user.login

      // Fetch events (public activity)
      const events = []
      let page = 1
      let hasMore = true

      while (hasMore && page <= 3) {
        const { data } = await octokit.activity.listEventsForAuthenticatedUser({
          username,
          per_page: 100,
          page,
        })
        
        if (data.length === 0) {
          hasMore = false
        } else {
          events.push(...data)
          page++
        }
      }

      // Filter events for the target date
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.created_at!)
        return eventDate >= startDate && eventDate <= endDate
      })

      // Extract commits from push events
      const commits: any[] = []
      const repoSet = new Set<string>()
      
      dayEvents.forEach(event => {
        if (event.type === 'PushEvent' && event.payload) {
          const payload = event.payload as any
          const repoName = event.repo.name
          repoSet.add(repoName)
          
          if (payload.commits && Array.isArray(payload.commits)) {
            payload.commits.forEach((commit: any) => {
              commits.push({
                sha: commit.sha,
                message: commit.message,
                repository: repoName,
                timestamp: event.created_at!,
                author: commit.author?.name || username,
                url: `https://github.com/${repoName}/commit/${commit.sha}`,
              })
            })
          }
        }
      })

      // Extract PRs and Issues
      const pullRequests = dayEvents
        .filter(e => e.type === 'PullRequestEvent')
        .map(e => {
          const payload = e.payload as any
          return {
            number: payload.pull_request?.number || 0,
            title: payload.pull_request?.title || '',
            repository: e.repo.name,
            state: payload.action || 'unknown',
            url: payload.pull_request?.html_url || '',
          }
        })

      const issues = dayEvents
        .filter(e => e.type === 'IssuesEvent')
        .map(e => {
          const payload = e.payload as any
          return {
            number: payload.issue?.number || 0,
            title: payload.issue?.title || '',
            repository: e.repo.name,
            state: payload.action || 'unknown',
            url: payload.issue?.html_url || '',
          }
        })

      console.log('✅ Activity fetched successfully', {
        totalCommits: commits.length,
        totalRepos: repoSet.size,
        totalPRs: pullRequests.length,
        totalIssues: issues.length,
      })

      return {
        commits,
        pullRequests,
        issues,
        totalCommits: commits.length,
        totalRepos: repoSet.size,
        repositories: Array.from(repoSet),
      }
    } catch (error: any) {
      console.error('❌ Failed to fetch GitHub activity', { error: error.message })
      
      // Return empty data on error
      return {
        commits: [],
        pullRequests: [],
        issues: [],
        totalCommits: 0,
        totalRepos: 0,
        repositories: [],
      }
    }
  },
})

// Step 2: Generate comprehensive analysis with AI
const generateAnalysis = createStep({
  id: 'generate-analysis',
  description: 'Generates comprehensive analysis with AI including haiku',
  inputSchema: z.object({
    commits: z.array(z.object({
      sha: z.string(),
      message: z.string(),
      repository: z.string(),
      timestamp: z.string(),
      author: z.string(),
      url: z.string(),
    })),
    pullRequests: z.array(z.any()),
    issues: z.array(z.any()),
    totalCommits: z.number(),
    totalRepos: z.number(),
    repositories: z.array(z.string()),
    date: z.string(),
  }),
  outputSchema: globalAnalysisSchema,
  execute: async ({ inputData }) => {
    console.log('🤖 Generating AI analysis', {
      commits: inputData.totalCommits,
      repos: inputData.totalRepos,
    })

    // If no activity, create a placeholder
    if (inputData.totalCommits === 0) {
      return {
        date: inputData.date,
        title: 'A Day of Rest',
        haiku: 'No commits today\nThe codebase breathes quietly\nTomorrow brings change',
        narrative: 'No development activity was recorded for this date. Sometimes the most productive thing is to step back and let ideas percolate.',
        highlights: ['No commits recorded'],
        repoSummaries: [],
        crossRepoPatterns: [],
        technicalThemes: [],
        suggestions: [],
        metrics: {
          totalCommits: 0,
          totalRepos: 0,
          primaryLanguages: [],
          codeQualityTrend: 'stable' as const,
          productivityScore: 0,
        },
      }
    }

    try {
      // Prepare context for AI
      const context = {
        date: inputData.date,
        activity: {
          commits: inputData.commits.slice(0, 100), // Limit to prevent token overflow
          pullRequests: inputData.pullRequests,
          issues: inputData.issues,
        },
        stats: {
          totalCommits: inputData.totalCommits,
          totalRepos: inputData.totalRepos,
          repositories: inputData.repositories,
        },
      }

      // Generate analysis using the global analysis agent
      const response = await globalAnalysisAgent.generate(
        `Analyze this GitHub activity for ${inputData.date} and create a comprehensive daily log.
        
        IMPORTANT: You must include a haiku that captures the essence of the day's coding journey.
        
        Activity data:
        ${JSON.stringify(context, null, 2)}
        
        Create an engaging narrative about the development work, identify patterns across repositories,
        extract technical themes, and provide actionable suggestions for tomorrow.
        
        Remember to include the haiku field in your response!`,
        {
          output: globalAnalysisSchema,
        }
      )

      if (!response.object) {
        throw new Error('AI agent did not return structured output')
      }

      console.log('✅ AI analysis generated successfully')
      return response.object
    } catch (error: any) {
      console.error('⚠️ AI analysis failed, using fallback', { error: error.message })
      
      // Fallback analysis without AI
      const repoSummaries = inputData.repositories.map(repo => ({
        repository: repo,
        commitCount: inputData.commits.filter(c => c.repository === repo).length,
        mainFocus: 'General development',
        progress: 'Active development',
      }))

      return {
        date: inputData.date,
        title: `Development Activity - ${inputData.date}`,
        haiku: `${inputData.totalCommits} commits flow\nAcross ${inputData.totalRepos} repositories\nProgress continues`,
        narrative: `Worked across ${inputData.totalRepos} repositories with ${inputData.totalCommits} commits. The day showed consistent development activity across multiple projects.`,
        highlights: [
          `${inputData.totalCommits} commits across ${inputData.totalRepos} repositories`,
          ...inputData.repositories.slice(0, 5).map(r => `Active development in ${r}`),
        ],
        repoSummaries,
        crossRepoPatterns: ['Consistent development pace'],
        technicalThemes: ['Iterative improvements'],
        suggestions: [
          {
            id: '1',
            title: 'Review recent commits',
            category: 'refactor' as const,
            priority: 'medium' as const,
            estimatedEffort: 'hours' as const,
            rationale: 'Ensure code quality standards',
            dependencies: [],
            prompt: 'Review and refactor recent changes',
            contextFiles: [],
            relatedCommits: inputData.commits.slice(0, 5).map(c => c.sha),
          },
        ],
        metrics: {
          totalCommits: inputData.totalCommits,
          totalRepos: inputData.totalRepos,
          primaryLanguages: ['TypeScript', 'JavaScript'],
          codeQualityTrend: 'stable' as const,
          productivityScore: Math.min(10, Math.round(inputData.totalCommits / 3)),
        },
      }
    }
  },
})

// Step 3: Store in database with versioning
const storeAnalysis = createStep({
  id: 'store-analysis',
  description: 'Stores the analysis in the database with versioning support',
  inputSchema: globalAnalysisSchema,
  outputSchema: z.object({
    logId: z.string(),
    version: z.number(),
    stored: z.boolean(),
  }),
  execute: async ({ inputData }) => {
    console.log('💾 Storing analysis in database', { date: inputData.date })

    try {
      // Check for existing logs on this date to determine version
      const existingLogs = await db
        .select()
        .from(activityLogs)
        .where(sql`DATE(${activityLogs.date}) = ${inputData.date}`)
        .orderBy(desc(activityLogs.createdAt))

      const version = existingLogs.length + 1

      // Store the log
      const [newLog] = await db.insert(activityLogs).values({
        date: new Date(inputData.date),
        logType: 'global',
        title: inputData.title,
        summary: inputData.narrative,
        bullets: inputData.highlights,
        rawData: inputData as any,
        metadata: {
          totalCommits: inputData.metrics.totalCommits,
          totalRepos: inputData.metrics.totalRepos,
          languages: inputData.metrics.primaryLanguages,
          topProjects: inputData.repoSummaries.map(r => r.repository),
          crossRepoPatterns: inputData.crossRepoPatterns,
          technicalThemes: inputData.technicalThemes,
          codeQualityTrend: inputData.metrics.codeQualityTrend,
          productivityScore: inputData.metrics.productivityScore,
          repoSummaries: inputData.repoSummaries,
          suggestions: inputData.suggestions,
          haiku: inputData.haiku, // Store haiku in metadata
          version, // Store version number
        },
        processed: true,
        analysisDepth: 'deep',
      }).returning()

      console.log('✅ Analysis stored successfully', {
        logId: newLog.id,
        version,
      })

      return {
        logId: newLog.id,
        version,
        stored: true,
      }
    } catch (error: any) {
      console.error('❌ Failed to store analysis', { error: error.message })
      return {
        logId: '',
        version: 0,
        stored: false,
      }
    }
  },
})

// Import required for SQL
import { sql, desc } from 'drizzle-orm'

// Create the workflow
export const githubDailyAnalysisWorkflow = createWorkflow({
  id: 'github-daily-analysis',
  inputSchema: z.object({
    date: z.string().describe('Date in YYYY-MM-DD format'),
  }),
  outputSchema: z.object({
    logId: z.string(),
    version: z.number(),
    stored: z.boolean(),
  }),
})
  .then(fetchDailyActivity)
  .map({
    date: {
      schema: z.string(),
      fn: async ({ getInitData }) => getInitData().date,
    },
  })
  .then(generateAnalysis)
  .then(storeAnalysis)

githubDailyAnalysisWorkflow.commit()