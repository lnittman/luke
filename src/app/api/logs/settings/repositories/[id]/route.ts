import { eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { analysisRules, db, repositories } from '@/lib/db'

// Delete a repository
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Delete associated rules first (cascade should handle this, but being explicit)
    await db.delete(analysisRules).where(eq(analysisRules.repositoryId, id))

    // Delete the repository
    await db.delete(repositories).where(eq(repositories.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting repository:', error)
    return NextResponse.json(
      { error: 'Failed to delete repository' },
      { status: 500 }
    )
  }
}
