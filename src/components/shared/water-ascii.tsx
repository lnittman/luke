'use client'

import { type CSSProperties } from 'react'
import { AsciiEngine } from '@/lib/ascii-engine'
import { generateWaterFrames, generateOceanWavesFrames, generateRainFrames } from '@/lib/ascii-engine/generators/water'

interface WaterAsciiProps {
  className?: string
  style?: CSSProperties
  type?: 'water' | 'ocean' | 'rain'
  width?: number
  height?: number
  fps?: number
}

export function WaterAscii({
  className = '',
  style,
  type = 'water',
  width = 80,
  height = 30,
  fps = 8,
}: WaterAsciiProps) {
  // Generate frames based on type
  const frames = (() => {
    switch (type) {
      case 'ocean':
        return generateOceanWavesFrames(width, height, 40)
      case 'rain':
        return generateRainFrames(width, height, 30)
      default:
        return generateWaterFrames(width, height, 30)
    }
  })()

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
        lineHeight: '1.2',
        color: 'rgb(var(--accent-2))',
        opacity: 0.8,
        width: '100%',
        height: '100%',
        ...style,
      }}
    />
  )
}