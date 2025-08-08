'use client';

import { useRouter } from 'next/navigation';
import { AnimatedAscii, ASCII_PRESETS } from '@/components/AnimatedAscii';

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
        gap: '3rem',
        maxWidth: '400px',
        width: '100%',
      }}>
        {/* Animated ASCII */}
        <AnimatedAscii
          frames={ASCII_PRESETS.error404}
          interval={500}
          style={{
            fontSize: '1.5rem',
            color: 'rgb(var(--text-secondary))',
          }}
        />

        {/* 404 Text */}
        <div style={{
          textAlign: 'center',
        }}>
          <h1 style={{
            fontSize: '2rem',
            marginBottom: '1rem',
            fontWeight: 'normal',
          }}>
            404
          </h1>
          <p style={{
            color: 'rgb(var(--text-secondary))',
            fontSize: '0.875rem',
          }}>
            PAGE NOT FOUND
          </p>
        </div>

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