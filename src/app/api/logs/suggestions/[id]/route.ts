import { eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { activityDetails, db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'Suggestion ID is required' }, { status: 400 })
    }

    // Fetch the suggestion detail
    const [suggestion] = await db
      .select()
      .from(activityDetails)
      .where(eq(activityDetails.id, id))
      .limit(1)

    if (!suggestion || suggestion.type !== 'suggestion') {
      return NextResponse.json({ error: 'Suggestion not found' }, { status: 404 })
    }

    return NextResponse.json(suggestion)
  } catch (error) {
    console.error('Error fetching suggestion:', error)
    return NextResponse.json(
      { error: 'Failed to fetch suggestion' },
      { status: 500 }
    )
  }
}