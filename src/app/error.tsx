'use client'

import { useEffect } from 'react'
import { ErrorAscii } from '@/components/shared/error-ascii'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(var(--background-start))',
        color: 'rgb(var(--text-primary))',
        fontFamily: 'monospace',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Centered ASCII with ERROR inside */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '600px',
            height: '300px',
          }}
        >
          <ErrorAscii 
            type="error"
            errorCode="ERROR"
            width={80}
            height={25}
            fps={10}
          />
        </div>
      </div>

      {/* Error message and reset button */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          marginTop: 'auto',
          paddingBottom: '3rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <p
          style={{
            fontSize: '0.875rem',
            color: 'rgb(var(--text-secondary))',
            maxWidth: '400px',
            textAlign: 'center',
          }}
        >
          {error.message || 'Something went wrong'}
        </p>
        <button
          onClick={reset}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgb(var(--surface-1))'
            e.currentTarget.style.borderColor = 'rgb(var(--accent-1))'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.borderColor = 'rgb(var(--border))'
          }}
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: 'transparent',
            border: '1px solid rgb(var(--border))',
            color: 'rgb(var(--text-primary))',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            textTransform: 'uppercase',
          }}
        >
          ↻ TRY AGAIN
        </button>
      </div>
    </div>
  )
}