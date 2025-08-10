import { type NextRequest, NextResponse } from 'next/server'
import dailyGithubAnalysisWorkflow from '@/mastra/workflows/daily-github-analysis'

export const maxDuration = 60 // 60 seconds timeout for cron job

export async function GET(request: NextRequest) {
  // Verify this is a cron job request (in production, use a secret)
  const authHeader = request.headers.get('authorization')
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Generate log for yesterday (since this runs at midnight)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    console.log(
      'Starting daily log generation for',
      yesterday.toISOString().split('T')[0]
    )

    const run = await dailyGithubAnalysisWorkflow.createRunAsync()
    const result = await run.start({
      inputData: {
        date: yesterday,
        forceRegenerate: false,
      },
    })

    // Check if successful
    if (result.status === 'success' && result.result?.success) {
      console.log('Daily log generated successfully:', result.result.logId)
      return NextResponse.json({
        success: true,
        message: `Daily log created for ${yesterday.toISOString().split('T')[0]}`,
        logId: result.result.logId || '',
      })
    }
    console.log('Daily log generation skipped or failed')
    return NextResponse.json({
      success: false,
      message: 'Log generation skipped (disabled or no repos enabled)',
    })
  } catch (error) {
    console.error('Error in daily log cron job:', error)
    return NextResponse.json(
      {
        error: 'Failed to create daily log',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// Also support POST for manual triggering
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const date = body.date ? new Date(body.date) : new Date()
    const forceRegenerate = body.forceRegenerate

    console.log(
      'Manual daily log generation for',
      date.toISOString().split('T')[0]
    )

    const run = await dailyGithubAnalysisWorkflow.createRunAsync()
    const result = await run.start({
      inputData: {
        date,
        forceRegenerate,
      },
    })

    if (result.status === 'success' && result.result?.success) {
      console.log('Daily log generated successfully:', result.result.logId)
      return NextResponse.json({
        success: true,
        logId: result.result.logId || '',
        date: date.toISOString().split('T')[0],
      })
    }
    console.log('Daily log generation skipped or failed')
    return NextResponse.json({
      success: false,
      message: 'Log generation skipped or failed',
    })
  } catch (error) {
    console.error('Error in manual daily log generation:', error)
    return NextResponse.json(
      { error: 'Failed to generate daily log' },
      { status: 500 }
    )
  }
}
