import { NextRequest, NextResponse } from 'next/server'
import { mastra } from '@/mastra'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { workflowId = 'daily-github-analysis', date, forceRegenerate } = body
    
    const workflow = mastra.getWorkflow(workflowId)
    if (!workflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      )
    }
    
    // Parse date or use yesterday
    const analysisDate = date ? new Date(date) : new Date(Date.now() - 24 * 60 * 60 * 1000)
    
    // Create and start workflow run
    const run = await workflow.createRunAsync()
    
    // Track execution progress
    const progressEvents: any[] = []
    const unwatch = run.watch((event) => {
      progressEvents.push({
        ...event,
        timestamp: new Date().toISOString(),
      })
    })
    
    // Start workflow execution
    const result = await run.start({
      inputData: {
        date: analysisDate,
        forceRegenerate: forceRegenerate || false,
      },
    })
    
    // Clean up watcher
    unwatch()
    
    // Return execution result
    return NextResponse.json({
      runId: run.runId,
      status: result.status,
      result: result.status === 'success' ? result.result : null,
      error: result.status === 'failed' ? result.error : null,
      suspended: result.status === 'suspended' ? result.suspended : null,
      progress: progressEvents,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error triggering workflow:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Get available workflows
export async function GET() {
  try {
    // Get all registered workflows
    const workflows = [
      {
        id: 'daily-github-analysis',
        name: 'Daily GitHub Analysis',
        description: 'Comprehensive daily GitHub activity analysis with multi-level insights',
      },
    ]
    
    return NextResponse.json({ workflows })
  } catch (error) {
    console.error('Error getting workflows:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}