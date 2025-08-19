'use client'

import { useRouter } from 'next/navigation'
import { ErrorAscii } from '@/components/shared/error-ascii'

export default function NotFound() {
  const router = useRouter()

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
      {/* Centered ASCII with 404 inside */}
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
            type="404"
            width={80}
            height={25}
            fps={10}
          />
        </div>
      </div>

      {/* Back Button - positioned below the ASCII */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          marginTop: 'auto',
          paddingBottom: '3rem',
        }}
      >
        <button
          onClick={() => router.push('/')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transition = 'none'
            e.currentTarget.style.backgroundColor = 'rgb(var(--surface-1))'
            e.currentTarget.style.borderColor = 'rgb(var(--accent-1))'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transition = 'all 150ms ease-out'
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
            transition: 'all 150ms ease-out',
            textTransform: 'uppercase',
          }}
        >
          ← HOME
        </button>
      </div>
    </div>
  )
}