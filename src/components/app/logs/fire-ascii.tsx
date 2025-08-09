'use client'

import { useEffect, useRef } from 'react'
import fireData from './fire-data.json' with { type: 'json' }

interface FireAsciiProps {
  className?: string
}

export function FireAscii({ className = '' }: FireAsciiProps) {
  const ref = useRef<HTMLPreElement>(null)

  useEffect(() => {
    let index = 0

    const interval = setInterval(() => {
      if (!ref.current) return

      ref.current.textContent = fireData[index]
      index++

      // Loop back to start after going through all frames
      if (index >= fireData.length) {
        index = 0
      }
    }, 100) // Faster animation for fire effect

    return () => clearInterval(interval)
  }, [])

  return (
    <pre
      className={className}
      ref={ref}
      style={{
        fontFamily: 'monospace',
        fontSize: '0.875rem',
        lineHeight: '1.2',
        margin: 0,
        whiteSpace: 'pre',
        color: 'rgb(var(--accent-1))',
      }}
    >
      {fireData[0]}
    </pre>
  )
}
