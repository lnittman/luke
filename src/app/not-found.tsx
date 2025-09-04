import Link from 'next/link'

export default function NotFound() {

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
      {/* Minimal 404 text to avoid client-only component imports during prerender */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <pre style={{ fontFamily: 'monospace', fontSize: '1rem', color: 'rgb(var(--accent-1))' }}>
          404 — Not Found
        </pre>
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
        <Link
          href="/"
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: 'transparent',
            border: '1px solid rgb(var(--border))',
            color: 'rgb(var(--text-primary))',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            cursor: 'pointer',
            textTransform: 'uppercase',
          }}
        >
          ← HOME
        </Link>
      </div>
    </div>
  )
}
