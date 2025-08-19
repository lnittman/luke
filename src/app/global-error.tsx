'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'monospace',
            backgroundColor: '#f5f4f2',
            color: '#1a1816',
          }}
        >
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Something went wrong!</h2>
          <p style={{ marginBottom: '2rem', opacity: 0.7 }}>{error.message || 'An unexpected error occurred'}</p>
          <button
            onClick={() => reset()}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: 'transparent',
              border: '1px solid #d4d2cf',
              color: '#1a1816',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              cursor: 'pointer',
              textTransform: 'uppercase',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}