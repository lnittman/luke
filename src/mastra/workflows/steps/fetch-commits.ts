import { createStep } from '@mastra/core/workflows'
import { Octokit } from '@octokit/rest'
import { z } from 'zod'

export const fetchCommitsStep = createStep({
  id: 'fetch-commits',
  description: 'Fetch all commits from user activity for a given day',
  inputSchema: z.object({
    date: z.union([z.date(), z.string()]),
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
  execute: async ({ inputData, mastra }) => {
    const logger = mastra?.getLogger()
    const { date, githubToken } = inputData
    const octokit = new Octokit({ auth: githubToken })
    
    // Handle date input (can be Date or string from nested workflow)
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const dateStr = dateObj.toISOString().split('T')[0]
    
    logger?.info('🚀 Starting: Fetching GitHub activity for user', { 
      date: dateStr
    })

    try {
      // Get authenticated user
      const { data: user } = await octokit.users.getAuthenticated()
      logger?.info(`👤 Fetching activity for user: ${user.login}`)

      // Fetch user events (includes pushes, PRs, issues, etc.)
      // GitHub Events API returns last 300 events from past 90 days
      const events = []
      let page = 1
      let hasMore = true
      
      while (hasMore && page <= 10) { // Max 10 pages = 1000 events
        const { data: pageEvents } = await octokit.activity.listEventsForAuthenticatedUser({
          username: user.login,
          per_page: 100,
          page
        })
        
        if (pageEvents.length === 0) {
          hasMore = false
        } else {
          events.push(...pageEvents)
          page++
        }
      }

      logger?.info(`📊 Found ${events.length} total events for ${user.login}`)

      // Filter for push events on the target date
      const targetDayStart = new Date(dateObj)
      targetDayStart.setHours(0, 0, 0, 0)
      const targetDayEnd = new Date(dateObj)
      targetDayEnd.setHours(23, 59, 59, 999)

      const pushEvents = events.filter(event => {
        if (event.type !== 'PushEvent') return false
        const eventDate = new Date(event.created_at!)
        return eventDate >= targetDayStart && eventDate <= targetDayEnd
      })

      logger?.info(`🎯 Found ${pushEvents.length} push events on ${dateStr}`)

      // Extract commits from push events
      const allCommits = []
      const reposSeen = new Set<string>()

      for (const event of pushEvents) {
        const payload = event.payload as any
        const repo = event.repo
        
        if (!payload.commits || !repo) continue
        
        reposSeen.add(repo.name)
        
        // For each commit in the push event
        for (const commit of payload.commits) {
          // Parse repo name (format: "owner/name")
          const [owner, name] = repo.name.split('/')
          
          allCommits.push({
            repository: repo.name,
            owner,
            name,
            sha: commit.sha,
            message: commit.message,
            url: `https://github.com/${repo.name}/commit/${commit.sha}`,
            author: {
              name: commit.author?.name || null,
              email: commit.author?.email || null,
              date: event.created_at || null,
            },
          })
        }
      }

      // Also check for commits via search API for better coverage
      // This catches commits that might not show in events
      try {
        const searchDate = dateObj.toISOString().split('T')[0]
        const { data: searchResults } = await octokit.search.commits({
          q: `author:${user.login} committer-date:${searchDate}`,
          per_page: 100,
          sort: 'committer-date',
          order: 'desc'
        })

        logger?.info(`🔍 Search API found ${searchResults.items.length} additional commits`)

        for (const item of searchResults.items) {
          // Check if we already have this commit
          if (!allCommits.find(c => c.sha === item.sha)) {
            const repoUrl = item.repository?.full_name || item.html_url.split('/commit/')[0].replace('https://github.com/', '')
            const [owner, name] = repoUrl.split('/')
            
            reposSeen.add(repoUrl)
            
            allCommits.push({
              repository: repoUrl,
              owner,
              name,
              sha: item.sha,
              message: item.commit.message,
              url: item.html_url,
              author: {
                name: item.commit.author?.name || null,
                email: item.commit.author?.email || null,
                date: item.commit.author?.date || null,
              },
            })
          }
        }
      } catch (searchError: any) {
        logger?.warn(`⚠️ Search API failed, continuing with events data: ${searchError.message}`)
      }

      logger?.info(`📈 Fetch complete summary:`, {
        date: dateStr,
        totalCommits: allCommits.length,
        uniqueRepos: reposSeen.size,
        repos: Array.from(reposSeen)
      })
      
      return { commits: allCommits }
    } catch (error: any) {
      logger?.error(`❌ Error fetching GitHub activity: ${error.message}`)
      return { commits: [] }
    }
  },
})