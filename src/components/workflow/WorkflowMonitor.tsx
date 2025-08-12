'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2, CheckCircle, XCircle, AlertCircle, PlayCircle, Clock } from 'lucide-react'

interface WorkflowEvent {
  type: string
  timestamp: string
  event?: any
  chunk?: any
  result?: any
  error?: string
  runId?: string
}

interface WorkflowStep {
  id: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  startTime?: string
  endTime?: string
  logs: string[]
  error?: string
}

export function WorkflowMonitor({ 
  workflowId = 'daily-github-analysis',
  date 
}: { 
  workflowId?: string
  date?: string 
}) {
  const [isRunning, setIsRunning] = useState(false)
  const [runId, setRunId] = useState<string | null>(null)
  const [events, setEvents] = useState<WorkflowEvent[]>([])
  const [steps, setSteps] = useState<Map<string, WorkflowStep>>(new Map())
  const [currentStep, setCurrentStep] = useState<string | null>(null)
  const [workflowStatus, setWorkflowStatus] = useState<'idle' | 'running' | 'completed' | 'failed'>('idle')

  const startWorkflow = useCallback(async () => {
    setIsRunning(true)
    setEvents([])
    setSteps(new Map())
    setCurrentStep(null)
    setWorkflowStatus('running')

    try {
      const params = new URLSearchParams({
        workflowId,
        ...(date && { date })
      })

      const eventSource = new EventSource(`/api/workflow/monitor?${params}`)

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data) as WorkflowEvent
        setEvents(prev => [...prev, data])

        // Update run ID
        if (data.runId && !runId) {
          setRunId(data.runId)
        }

        // Process different event types
        if (data.type === 'stream' && data.chunk) {
          const chunk = data.chunk
          
          // Handle step events
          if (chunk.type === 'step-start') {
            const stepId = chunk.payload?.id || 'unknown'
            setCurrentStep(stepId)
            setSteps(prev => {
              const newSteps = new Map(prev)
              newSteps.set(stepId, {
                id: stepId,
                status: 'running',
                startTime: data.timestamp,
                logs: [`🚀 Step started: ${stepId}`]
              })
              return newSteps
            })
          } else if (chunk.type === 'step-output') {
            const stepId = chunk.payload?.stepName || currentStep || 'unknown'
            setSteps(prev => {
              const newSteps = new Map(prev)
              const step = newSteps.get(stepId) || { id: stepId, status: 'running', logs: [] }
              step.logs.push(`📊 ${JSON.stringify(chunk.payload)}`)
              newSteps.set(stepId, step)
              return newSteps
            })
          } else if (chunk.type === 'step-result') {
            const stepId = chunk.payload?.stepName || chunk.payload?.id || currentStep || 'unknown'
            const status = chunk.payload?.status || 'completed'
            setSteps(prev => {
              const newSteps = new Map(prev)
              const step = newSteps.get(stepId) || { id: stepId, status: 'running', logs: [] }
              step.status = status === 'success' ? 'completed' : status === 'error' ? 'failed' : 'completed'
              step.endTime = data.timestamp
              step.logs.push(`✅ Step ${status}: ${stepId}`)
              newSteps.set(stepId, step)
              return newSteps
            })
          } else if (chunk.type === 'finish') {
            setWorkflowStatus('completed')
            setIsRunning(false)
          }
        } else if (data.type === 'watch' && data.event) {
          // Handle watch events for detailed step tracking
          const event = data.event
          if (event.payload?.currentStep) {
            const stepInfo = event.payload.currentStep
            const stepId = stepInfo.id || 'unknown'
            
            setSteps(prev => {
              const newSteps = new Map(prev)
              const step = newSteps.get(stepId) || { id: stepId, status: 'pending', logs: [] }
              
              // Update step status based on event
              if (stepInfo.status) {
                step.status = stepInfo.status === 'completed' ? 'completed' : 
                             stepInfo.status === 'failed' ? 'failed' : 
                             stepInfo.status === 'running' ? 'running' : 'pending'
              }
              
              // Add event details to logs
              step.logs.push(`📝 ${JSON.stringify(stepInfo)}`)
              newSteps.set(stepId, step)
              return newSteps
            })
          }
        } else if (data.type === 'complete') {
          setWorkflowStatus(data.status === 'success' ? 'completed' : 'failed')
          setIsRunning(false)
        } else if (data.type === 'error') {
          setWorkflowStatus('failed')
          setIsRunning(false)
        }
      }

      eventSource.onerror = (error) => {
        console.error('EventSource error:', error)
        eventSource.close()
        setIsRunning(false)
        if (workflowStatus === 'running') {
          setWorkflowStatus('failed')
        }
      }

      // Cleanup on unmount
      return () => {
        eventSource.close()
      }
    } catch (error) {
      console.error('Failed to start workflow:', error)
      setIsRunning(false)
      setWorkflowStatus('failed')
    }
  }, [workflowId, date, runId, currentStep, workflowStatus])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Loader2 className="h-4 w-4 animate-spin" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-gray-400" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
      case 'running':
        return 'default'
      case 'completed':
        return 'secondary'
      case 'failed':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const workflowSteps = [
    { id: 'check-existing-log', name: 'Check Existing Log' },
    { id: 'fetch-commits', name: 'Fetch Commits' },
    { id: 'prepare-commits', name: 'Prepare Commits' },
    { id: 'analyze-single-commit', name: 'Analyze Commits (Parallel)' },
    { id: 'collect-analyses', name: 'Collect Analyses' },
    { id: 'generate-global-analysis', name: 'Generate Global Analysis' },
    { id: 'store-analysis', name: 'Store Analysis' }
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Workflow Monitor</CardTitle>
            <div className="flex items-center gap-2">
              {runId && (
                <Badge variant="outline" className="font-mono text-xs">
                  {runId.slice(0, 8)}
                </Badge>
              )}
              <Badge variant={getStatusBadgeVariant(workflowStatus)}>
                {workflowStatus}
              </Badge>
              {!isRunning && workflowStatus === 'idle' && (
                <button
                  onClick={startWorkflow}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <PlayCircle className="h-4 w-4" />
                  Start Workflow
                </button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Workflow Steps Progress */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Workflow Steps</h3>
              <div className="space-y-1">
                {workflowSteps.map(stepDef => {
                  const step = steps.get(stepDef.id)
                  const status = step?.status || 'pending'
                  
                  return (
                    <div
                      key={stepDef.id}
                      className="flex items-center gap-2 p-2 rounded bg-gray-50 dark:bg-gray-800"
                    >
                      {getStatusIcon(status)}
                      <span className="flex-1 text-sm">{stepDef.name}</span>
                      {step?.startTime && (
                        <span className="text-xs text-gray-500">
                          {new Date(step.startTime).toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Event Log */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Event Log</h3>
              <ScrollArea className="h-64 rounded border">
                <div className="p-2 space-y-1">
                  {events.map((event, index) => (
                    <div
                      key={index}
                      className="text-xs font-mono p-1 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <span className="text-gray-500">
                        [{new Date(event.timestamp).toLocaleTimeString()}]
                      </span>{' '}
                      <span className="font-semibold">{event.type}:</span>{' '}
                      <span className="text-gray-700 dark:text-gray-300">
                        {event.chunk?.type || event.event?.type || 
                         (event.error ? `Error: ${event.error}` : 'Processing...')}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Current Step Logs */}
            {currentStep && steps.get(currentStep) && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">
                  Current Step: {currentStep}
                </h3>
                <ScrollArea className="h-32 rounded border">
                  <div className="p-2 space-y-1">
                    {steps.get(currentStep)?.logs.map((log, index) => (
                      <div key={index} className="text-xs font-mono">
                        {log}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}