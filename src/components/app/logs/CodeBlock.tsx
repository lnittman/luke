'use client'

import React, { useState } from 'react'
import { toast } from 'sonner'

interface CodeBlockProps {
  code: string
  language?: string
  className?: string
}

export function CodeBlock({ code, language = 'json', className = '' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast.success('Copied to clipboard', {
        style: {
          background: 'rgb(var(--surface-1))',
          border: '1px solid rgb(var(--border))',
          borderLeft: '2px solid rgb(var(--accent-1))',
          borderRadius: '0',
          fontFamily: 'monospace',
        },
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy', {
        style: {
          background: 'rgb(var(--surface-1))',
          border: '1px solid rgb(var(--border))',
          borderLeft: '2px solid rgb(var(--accent-2))',
          borderRadius: '0',
          fontFamily: 'monospace',
        },
      })
    }
  }

  return (
    <div className={`relative group ${className}`} style={{
      border: '1px solid rgb(var(--border))',
      backgroundColor: 'rgb(var(--surface-1))',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5rem 1rem',
        borderBottom: '1px solid rgb(var(--border))',
      }}>
        <span style={{
          fontFamily: 'monospace',
          fontSize: '0.75rem',
          color: 'rgb(var(--text-secondary))',
          textTransform: 'uppercase',
        }}>
          {language}
        </span>
        <button
          onClick={handleCopy}
          style={{
            padding: '0.25rem 0.5rem',
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            color: copied ? 'rgb(var(--accent-1))' : 'rgb(var(--text-secondary))',
            border: '1px solid rgb(var(--border))',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            transition: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgb(var(--surface-2))'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          {copied ? 'copied!' : 'copy'}
        </button>
      </div>
      <pre style={{
        padding: '1rem',
        margin: 0,
        overflow: 'auto',
        maxHeight: '400px',
      }}>
        <code style={{
          fontFamily: 'monospace',
          fontSize: '0.875rem',
          color: 'rgb(var(--text-primary))',
          lineHeight: '1.5',
        }}>
          {code}
        </code>
      </pre>
    </div>
  )
}