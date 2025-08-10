import { NextResponse } from 'next/server'
import { Octokit } from '@octokit/rest'
import { db, repositories } from '@/lib/db'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    // Use PAT from environment variable
    const githubToken = process.env.GITHUB_PAT || process.env.GITHUB_TOKEN
    
    if (!githubToken) {
      // Return empty repos if no token configured
      return NextResponse.json({ repos: [] })
    }

    const octokit = new Octokit({ auth: githubToken })

    // Fetch all repos for the authenticated user
    const { data: repos } = await octokit.repos.listForAuthenticatedUser({
      per_page: 100,
      sort: 'pushed',
      direction: 'desc',
      type: 'all', // Include all repos the user has access to
    })

    // Filter out private repos for UI display (but they'll still be in logs)
    const publicRepos = repos
      .filter(repo => !repo.private || process.env.NODE_ENV !== 'production')
      .map(repo => ({
        id: repo.id.toString(),
        name: repo.name,
        owner: repo.owner.login,
        fullName: repo.full_name,
        private: repo.private,
        language: repo.language,
        description: repo.description,
        pushedAt: repo.pushed_at,
      }))

    // Also store all repos in database for log generation (including private)
    for (const repo of repos) {
      const [existing] = await db
        .select()
        .from(repositories)
        .where(eq(repositories.repoId, repo.id.toString()))
        .limit(1)

      if (existing) {
        await db
          .update(repositories)
          .set({
            name: repo.name,
            owner: repo.owner.login,
            fullName: repo.full_name,
            description: repo.description,
            language: repo.language,
            isPrivate: repo.private,
            defaultBranch: repo.default_branch || 'main',
            metadata: {
              topics: repo.topics,
              homepage: repo.homepage,
              stargazers_count: repo.stargazers_count,
              watchers_count: repo.watchers_count,
              forks_count: repo.forks_count,
            },
            lastActivity: repo.pushed_at ? new Date(repo.pushed_at) : null,
            updatedAt: new Date(),
          })
          .where(eq(repositories.id, existing.id))
      } else {
        await db.insert(repositories).values({
          repoId: repo.id.toString(),
          name: repo.name,
          owner: repo.owner.login,
          fullName: repo.full_name,
          description: repo.description,
          language: repo.language,
          isPrivate: repo.private,
          defaultBranch: repo.default_branch || 'main',
          analysisEnabled: true, // Enable all repos by default
          metadata: {
            topics: repo.topics,
            homepage: repo.homepage,
            stargazers_count: repo.stargazers_count,
            watchers_count: repo.watchers_count,
            forks_count: repo.forks_count,
          },
          lastActivity: repo.pushed_at ? new Date(repo.pushed_at) : null,
        })
      }
    }

    return NextResponse.json({ repos: publicRepos })
  } catch (error) {
    console.error('Error fetching repos:', error)
    return NextResponse.json({ repos: [] })
  }
}