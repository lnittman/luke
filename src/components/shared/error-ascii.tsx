'use client'

import { type CSSProperties } from 'react'
import { AsciiEngine } from '@/lib/ascii'
import { generate404Frames, generateErrorFrames } from '@/lib/ascii/generators/404'

interface ErrorAsciiProps {
  className?: string
  style?: CSSProperties
  type?: '404' | 'error'
  errorCode?: string
  width?: number
  height?: number
  fps?: number
}

export function ErrorAscii({
  className = '',
  style,
  type = '404',
  errorCode = 'ERROR',
  width = 60,
  height = 20,
  fps = 8,
}: ErrorAsciiProps) {
  const frames = type === '404' 
    ? generate404Frames(width, height, 30)
    : generateErrorFrames(width, height, 40, errorCode)

  return (
    <AsciiEngine
      frames={frames}
      fps={fps}
      loop={true}
      autoPlay={true}
      className={className}
      style={{
        fontFamily: 'monospace',
        fontSize: '0.875rem',
        lineHeight: '1',
        color: 'rgb(var(--accent-1))',
        opacity: 0.9,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    />
  )
}