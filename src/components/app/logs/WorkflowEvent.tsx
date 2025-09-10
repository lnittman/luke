'use client'

import React, { useState } from 'react'
import { CodeBlock } from './CodeBlock'

interface WorkflowEventProps {
  event: {
    _id: string
    timestamp: string
    type: string
    step?: string
    error?: any
    details?: any
  }
}

export function WorkflowEvent({ event }: WorkflowEventProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const hasDetails = event.error || event.details

  return (
    <div style={{
      borderBottom: '1px solid rgb(var(--border))',
    }}>
      <button
        onClick={() => hasDetails && setIsExpanded(!isExpanded)}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1rem',
          background: 'none',
          border: 'none',
          fontFamily: 'monospace',
          fontSize: '0.875rem',
          textAlign: 'left',
          cursor: hasDetails ? 'pointer' : 'default',
          color: 'rgb(var(--text-primary))',
          transition: 'none',
        }}
        onMouseEnter={(e) => {
          if (hasDetails) {
            e.currentTarget.style.backgroundColor = 'rgb(var(--surface-1) / 0.5)'
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
      >
        <span style={{
          color: 'rgb(var(--text-secondary))',
          minWidth: '150px',
          flexShrink: 0,
        }}>
          {new Date(event.timestamp).toLocaleTimeString()}
        </span>
        
        <span style={{
          minWidth: '140px',
          flexShrink: 0,
          color: event.error ? 'rgb(var(--accent-2))' : 'rgb(var(--text-primary))',
        }}>
          {event.type}{event.step ? `:${event.step}` : ''}
        </span>
        
        {hasDetails && (
          <span style={{
            flex: 1,
            color: 'rgb(var(--text-secondary))',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {event.error ? `Error: ${String(event.error).slice(0, 50)}...` : 
             event.details ? `${JSON.stringify(event.details).slice(0, 50)}...` : ''}
          </span>
        )}
        
        {hasDetails && (
          <span style={{
            color: 'rgb(var(--text-secondary))',
            marginLeft: 'auto',
          }}>
            {isExpanded ? '▾' : '▸'}
          </span>
        )}
      </button>
      
      {isExpanded && hasDetails && (
        <div style={{ 
          padding: '0 1rem 1rem 1rem',
          animation: 'fade-in 0.2s ease-out',
        }}>
          {event.error && (
            <div style={{ marginBottom: '0.5rem' }}>
              <div style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'rgba(var(--accent-2), 0.1)',
                border: '1px solid rgb(var(--accent-2))',
                borderLeft: '3px solid rgb(var(--accent-2))',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                color: 'rgb(var(--accent-2))',
              }}>
                Error: {String(event.error)}
              </div>
            </div>
          )}
          
          {event.details && (
            <CodeBlock 
              code={JSON.stringify(event.details, null, 2)} 
              language="json"
            />
          )}
        </div>
      )}
    </div>
  )
}