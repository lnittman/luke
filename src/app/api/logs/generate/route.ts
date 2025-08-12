import { NextRequest, NextResponse } from 'next/server'
import { dailyGithubAnalysisWorkflow } from '@/mastra/workflows/daily-github-analysis'
import { db, activityLogs } from '@/lib/db'
import { eq, and, desc } from 'drizzle-orm'

// Disable timeout for this route - logs MUST be generated
export const maxDuration = 300 // 5 minutes max for Vercel, but locally unlimited
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const body = await request.json().catch(() => ({}))
    const { date, forceRegenerate } = body
    
    // Parse date or use yesterday
    const analysisDate = date ? new Date(date) : new Date(Date.now() - 24 * 60 * 60 * 1000)
    const dateStr = analysisDate.toISOString().split('T')[0]
    
    console.log('🚀 Starting daily GitHub analysis for:', dateStr)
    
    // Check for existing logs for this date to determine version
    const existingLogs = await db
      .select()
      .from(activityLogs)
      .where(
        and(
          eq(activityLogs.date, analysisDate),
          eq(activityLogs.logType, 'global')
        )
      )
      .orderBy(desc(activityLogs.createdAt))
    
    const version = existingLogs.length + 1
    console.log(`📊 This will be version ${version} for ${dateStr}`)
    
    // Create and start workflow run
    const run = await dailyGithubAnalysisWorkflow.createRunAsync()
    
    // Track execution progress
    const progressEvents: any[] = []
    const unwatch = run.watch((event) => {
      const eventLog = {
        type: event.type,
        timestamp: new Date().toISOString(),
        stepId: event.payload?.currentStep?.id,
        status: event.payload?.workflowState?.status || event.payload?.currentStep?.status,
      }
      console.log('📍 Progress:', eventLog)
      progressEvents.push(eventLog)
    })
    
    try {
      // Start workflow execution - NO TIMEOUT
      console.log('⚙️ Starting workflow execution (no timeout)...')
      const stream = run.streamVNext({
        inputData: {
          date: analysisDate,
          forceRegenerate: forceRegenerate || false,
        },
      })
      
      // Process stream to completion
      let lastEvent = null
      for await (const chunk of stream) {
        lastEvent = chunk
        // Log important events
        if (chunk.type === 'step-start') {
          console.log(`▶️ Step started: ${chunk.payload?.stepName}`)
        } else if (chunk.type === 'step-result') {
          console.log(`✅ Step completed: ${chunk.payload?.stepName}`)
        } else if (chunk.type === 'error') {
          console.error(`❌ Error in workflow:`, chunk.payload)
        }
      }
      
      // Get final result - this waits for completion
      const result = await stream.result
      const status = await stream.status
      const usage = await stream.usage
      
      // Clean up watcher
      unwatch()
      
      const executionTime = Math.round((Date.now() - startTime) / 1000)
      console.log(`🎉 Workflow completed in ${executionTime}s with status: ${status}`)
      
      // Verify log was created
      const newLog = await db
        .select()
        .from(activityLogs)
        .where(
          and(
            eq(activityLogs.date, analysisDate),
            eq(activityLogs.logType, 'global')
          )
        )
        .orderBy(desc(activityLogs.createdAt))
        .limit(1)
      
      const logCreated = newLog.length > 0 && newLog[0].createdAt > new Date(startTime)
      
      // Return execution result
      return NextResponse.json({
        success: status === 'success' || status === 'completed',
        runId: run.runId,
        status,
        date: dateStr,
        version,
        logCreated,
        logId: newLog[0]?.id,
        executionTime: `${executionTime}s`,
        result: result?.logId || result,
        usage,
        progressSummary: {
          totalSteps: progressEvents.length,
          steps: progressEvents.slice(-5), // Last 5 events
        },
        timestamp: new Date().toISOString(),
      })
    } catch (workflowError) {
      // Even if workflow fails, try to create a basic log entry
      console.error('⚠️ Workflow failed, attempting to create fallback log:', workflowError)
      
      const [fallbackLog] = await db
        .insert(activityLogs)
        .values({
          date: analysisDate,
          logType: 'global',
          title: `GitHub Activity - ${dateStr} (v${version} - Error)`,
          summary: 'Workflow execution failed. This is a fallback log entry.',
          bullets: ['Workflow error occurred', 'Check logs for details'],
          rawData: {
            error: workflowError instanceof Error ? workflowError.message : 'Unknown error',
            version,
            timestamp: new Date().toISOString(),
          },
          metadata: {
            version,
            status: 'error',
            executionTime: Math.round((Date.now() - startTime) / 1000),
          },
          processed: false,
          analysisDepth: 'shallow',
        })
        .returning()
      
      return NextResponse.json({
        success: false,
        status: 'error_with_fallback',
        date: dateStr,
        version,
        logCreated: true,
        logId: fallbackLog.id,
        error: workflowError instanceof Error ? workflowError.message : 'Unknown error',
        executionTime: `${Math.round((Date.now() - startTime) / 1000)}s`,
        timestamp: new Date().toISOString(),
      })
    }
  } catch (error) {
    console.error('❌ Fatal error in log generation:', error)
    
    // Last resort - return error but indicate the system tried
    return NextResponse.json(
      { 
        success: false,
        status: 'fatal_error',
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        executionTime: `${Math.round((Date.now() - startTime) / 1000)}s`,
        message: 'Fatal error occurred. Manual intervention may be required.',
      },
      { status: 500 }
    )
  }
}