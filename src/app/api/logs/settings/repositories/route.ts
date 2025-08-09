import { Octokit } from '@octokit/rest'
import { and, eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { db, repositories } from '@/lib/db'

const octokit = new Octokit({
  auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
})

// Add a new repository
export async function POST(request: NextRequest) {
  try {
    const { owner, name } = await request.json()

    if (!(owner && name)) {
      return NextResponse.json(
        { error: 'Owner and name are required' },
        { status: 400 }
      )
    }

    // Fetch repository information from GitHub
    const { data: repoData } = await octokit.repos.get({
      owner,
      repo: name,
    })

    // Check if repository already exists
    const existing = await db
      .select()
      .from(repositories)
      .where(and(eq(repositories.owner, owner), eq(repositories.name, name)))
      .limit(1)

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Repository already exists' },
        { status: 400 }
      )
    }

    // Insert new repository
    const [newRepo] = await db
      .insert(repositories)
      .values({
        owner,
        name,
        fullName: repoData.full_name,
        description: repoData.description,
        language: repoData.language,
        defaultBranch: repoData.default_branch,
        isPrivate: repoData.private,
        analysisEnabled: true,
        analysisDepth: 'deep',
        stars: repoData.stargazers_count,
        topics: repoData.topics || [],
        metadata: {
          htmlUrl: repoData.html_url,
          createdAt: repoData.created_at,
          updatedAt: repoData.updated_at,
          size: repoData.size,
          openIssues: repoData.open_issues_count,
        },
      })
      .returning()

    return NextResponse.json(newRepo)
  } catch (error) {
    console.error('Error adding repository:', error)
    return NextResponse.json(
      { error: 'Failed to add repository' },
      { status: 500 }
    )
  }
}
