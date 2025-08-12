import { NextRequest } from 'next/server'
import { mastra } from '@/mastra'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const workflowId = searchParams.get('workflowId')
  const runId = searchParams.get('runId')
  
  if (!workflowId) {
    return new Response('Workflow ID is required', { status: 400 })
  }
  
  try {
    const workflow = mastra.getWorkflow(workflowId)
    if (!workflow) {
      return new Response('Workflow not found', { status: 404 })
    }
    
    // Create SSE response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // If runId provided, try to get existing run
          // Otherwise create new run for monitoring
          const run = runId 
            ? await workflow.createRunAsync({ runId })
            : await workflow.createRunAsync()
          
          // Set up watch for real-time updates
          const unwatch = run.watch((event) => {
            const data = JSON.stringify({
              type: 'watch',
              runId: run.runId,
              event,
              timestamp: new Date().toISOString(),
            })
            controller.enqueue(encoder.encode(`data: ${data}\n\n`))
          })
          
          // If no runId provided, start the workflow
          if (!runId) {
            // Get date from query params or use yesterday
            const dateParam = searchParams.get('date')
            const date = dateParam ? new Date(dateParam) : new Date(Date.now() - 24 * 60 * 60 * 1000)
            const forceRegenerate = searchParams.get('force') === 'true'
            
            // Start workflow with streaming
            const streamResult = run.streamVNext({
              inputData: { date, forceRegenerate },
            })
            
            // Stream all events
            for await (const chunk of streamResult) {
              const data = JSON.stringify({
                type: 'stream',
                runId: run.runId,
                chunk,
                timestamp: new Date().toISOString(),
              })
              controller.enqueue(encoder.encode(`data: ${data}\n\n`))
            }
            
            // Get final result
            const result = await streamResult.result
            const usage = await streamResult.usage
            const status = await streamResult.status
            
            const finalData = JSON.stringify({
              type: 'complete',
              runId: run.runId,
              result,
              usage,
              status,
              timestamp: new Date().toISOString(),
            })
            controller.enqueue(encoder.encode(`data: ${finalData}\n\n`))
          }
          
          // Clean up watcher
          unwatch()
          controller.close()
        } catch (error) {
          console.error('Stream error:', error)
          const errorData = JSON.stringify({
            type: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
          })
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`))
          controller.close()
        }
      },
    })
    
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Error monitoring workflow:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

// Get workflow run status
export async function POST(request: NextRequest) {
  try {
    const { workflowId, runId } = await request.json()
    
    if (!workflowId || !runId) {
      return new Response('Workflow ID and Run ID are required', { status: 400 })
    }
    
    const workflow = mastra.getWorkflow(workflowId)
    if (!workflow) {
      return new Response('Workflow not found', { status: 404 })
    }
    
    // Resume an existing run
    const run = await workflow.createRunAsync({ runId })
    
    // Get current state by watching briefly
    let currentState: any = null
    const unwatch = run.watch((event) => {
      currentState = event
    })
    
    // Wait a moment to capture state
    await new Promise(resolve => setTimeout(resolve, 100))
    unwatch()
    
    return new Response(
      JSON.stringify({
        runId,
        workflowId,
        state: currentState,
        timestamp: new Date().toISOString(),
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Error getting workflow status:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}