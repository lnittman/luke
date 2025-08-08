'use client';

import { useRouter } from 'next/navigation';
import { WaterAscii } from '@/components/WaterAscii';

export default function NotFound() {
  const router = useRouter();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgb(var(--background-start))',
      color: 'rgb(var(--text-primary))',
      fontFamily: 'monospace',
      padding: '2rem',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        maxWidth: '400px',
        width: '100%',
      }}>
        {/* Water ASCII Animation */}
        <WaterAscii />

        {/* 404 Text - Already in ASCII */}
        <p style={{
          color: 'rgb(var(--text-secondary))',
          fontSize: '0.875rem',
          textTransform: 'uppercase',
        }}>
          Page Not Found
        </p>

        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
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
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgb(var(--surface-1))';
            e.currentTarget.style.borderColor = 'rgb(var(--accent-1))';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = 'rgb(var(--border))';
          }}
        >
          ← HOME
        </button>
      </div>
    </div>
  );
} 