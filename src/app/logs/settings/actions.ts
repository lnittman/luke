'use server'

import { Octokit } from '@octokit/rest'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { db, repositories, userPreferences } from '@/lib/db'

interface GitHubRepo {
  id: string
  owner: string
  name: string
  fullName: string
  description: string | null
  language: string | null
  private: boolean
  defaultBranch: string
  pushedAt: string | null
}

export async function connectGitHub(accessToken: string) {
  try {
    const octokit = new Octokit({ auth: accessToken })

    // Verify token and get user
    const { data: user } = await octokit.users.getAuthenticated()

    // Store token in user preferences (encrypted in production)
    const [existingPref] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, 'default'))
      .limit(1)

    if (existingPref) {
      await db
        .update(userPreferences)
        .set({
          metadata: {
            ...((existingPref.metadata as any) || {}),
            githubToken: accessToken,
            githubUser: user.login,
          },
          updatedAt: new Date(),
        })
        .where(eq(userPreferences.id, existingPref.id))
    } else {
      await db.insert(userPreferences).values({
        userId: 'default',
        metadata: {
          githubToken: accessToken,
          githubUser: user.login,
        },
      })
    }

    revalidatePath('/logs/settings')
    return { success: true, username: user.login }
  } catch (error) {
    console.error('GitHub connection error:', error)
    return { success: false, error: 'Failed to connect GitHub' }
  }
}

export async function fetchGitHubRepos() {
  try {
    // Get stored GitHub token
    const [userPref] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, 'default'))
      .limit(1)

    const githubToken = (userPref?.metadata as any)?.githubToken
    if (!githubToken) {
      return { success: false, error: 'GitHub not connected', repos: [] }
    }

    const octokit = new Octokit({ auth: githubToken })

    // Fetch all user repos
    const { data: repos } = await octokit.repos.listForAuthenticatedUser({
      per_page: 100,
      sort: 'pushed',
      direction: 'desc',
    })

    // Transform and store repos in database
    const githubRepos: GitHubRepo[] = repos.map((repo) => ({
      id: repo.id.toString(),
      owner: repo.owner.login,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      language: repo.language,
      private: repo.private,
      defaultBranch: repo.default_branch || 'main',
      pushedAt: repo.pushed_at,
    }))

    // Upsert repositories
    for (const repo of githubRepos) {
      const [existing] = await db
        .select()
        .from(repositories)
        .where(eq(repositories.repoId, repo.id))
        .limit(1)

      if (existing) {
        await db
          .update(repositories)
          .set({
            description: repo.description,
            language: repo.language,
            isPrivate: repo.private,
            defaultBranch: repo.defaultBranch,
            lastActivity: repo.pushedAt ? new Date(repo.pushedAt) : null,
            updatedAt: new Date(),
          })
          .where(eq(repositories.id, existing.id))
      } else {
        await db.insert(repositories).values({
          repoId: repo.id,
          owner: repo.owner,
          name: repo.name,
          fullName: repo.fullName,
          description: repo.description,
          language: repo.language,
          scope: 'github',
          isPrivate: repo.private,
          defaultBranch: repo.defaultBranch,
          analysisEnabled: false, // Disabled by default
          lastActivity: repo.pushedAt ? new Date(repo.pushedAt) : null,
        })
      }
    }

    // Get all repos with their enabled status
    const allRepos = await db
      .select()
      .from(repositories)
      .where(eq(repositories.scope, 'github'))

    revalidatePath('/logs/settings')
    return { success: true, repos: allRepos }
  } catch (error) {
    console.error('Error fetching repos:', error)
    return { success: false, error: 'Failed to fetch repositories', repos: [] }
  }
}

export async function toggleRepository(repoId: string, enabled: boolean) {
  try {
    await db
      .update(repositories)
      .set({
        analysisEnabled: enabled,
        updatedAt: new Date(),
      })
      .where(eq(repositories.repoId, repoId))

    revalidatePath('/logs/settings')
    return { success: true }
  } catch (error) {
    console.error('Error toggling repository:', error)
    return { success: false, error: 'Failed to update repository' }
  }
}

export async function toggleGlobalLogs(enabled: boolean) {
  try {
    const [existingPref] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, 'default'))
      .limit(1)

    if (existingPref) {
      await db
        .update(userPreferences)
        .set({
          globalLogsEnabled: enabled,
          updatedAt: new Date(),
        })
        .where(eq(userPreferences.id, existingPref.id))
    } else {
      await db.insert(userPreferences).values({
        userId: 'default',
        globalLogsEnabled: enabled,
      })
    }

    revalidatePath('/logs/settings')
    return { success: true }
  } catch (error) {
    console.error('Error updating global logs setting:', error)
    return { success: false, error: 'Failed to update settings' }
  }
}

export async function getSettings() {
  try {
    const [userPref] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, 'default'))
      .limit(1)

    const repos = await db
      .select()
      .from(repositories)
      .where(eq(repositories.scope, 'github'))

    return {
      globalLogsEnabled: userPref?.globalLogsEnabled ?? true,
      githubConnected: !!(userPref?.metadata as any)?.githubToken,
      githubUser: (userPref?.metadata as any)?.githubUser,
      repositories: repos,
    }
  } catch (error) {
    console.error('Error getting settings:', error)
    return {
      globalLogsEnabled: true,
      githubConnected: false,
      githubUser: null,
      repositories: [],
    }
  }
}
