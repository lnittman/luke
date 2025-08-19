import { NextRequest, NextResponse } from 'next/server'
import { mastra } from '@/mastra'

export const maxDuration = 60 // 60 seconds for hobby plan

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get date parameter or use yesterday
    const searchParams = request.nextUrl.searchParams
    const dateParam = searchParams.get('date')
    
    const targetDate = dateParam 
      ? new Date(dateParam)
      : new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
    
    const dateString = targetDate.toISOString().split('T')[0]
    
    console.log(`🚀 Starting daily GitHub analysis for ${dateString}`)

    // Execute the workflow
    const workflow = mastra.getWorkflow('github-daily-analysis')
    const run = await workflow.createRunAsync()
    const result = await run.start({
      inputData: { date: dateString },
    })

    console.log('✅ Daily analysis completed', result)

    return NextResponse.json({
      success: true,
      date: dateString,
      result,
    })
  } catch (error: any) {
    console.error('❌ Daily analysis failed:', error)
    return NextResponse.json(
      { 
        error: 'Analysis failed', 
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}

// Allow manual trigger via POST for testing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const date = body.date || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    
    console.log(`🚀 Manual trigger: Starting daily GitHub analysis for ${date}`)

    // Execute the workflow
    const workflow = mastra.getWorkflow('github-daily-analysis')
    const run = await workflow.createRunAsync()
    const result = await run.start({
      inputData: { date },
    })

    console.log('✅ Daily analysis completed', result)

    return NextResponse.json({
      success: true,
      date,
      result,
    })
  } catch (error: any) {
    console.error('❌ Daily analysis failed:', error)
    return NextResponse.json(
      { 
        error: 'Analysis failed', 
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}