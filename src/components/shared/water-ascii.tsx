'use client'

import { type CSSProperties, useEffect, useState } from 'react'
import { AsciiEngine } from '@/lib/ascii-engine'
import { generateWaterFrames, generateOceanWavesFrames, generateRainFrames } from '@/lib/ascii-engine/generators/water'
import { generateMatrixRainFrames } from '@/lib/ascii-engine/generators/matrix'

interface WaterAsciiProps {
  className?: string
  style?: CSSProperties
  type?: 'water' | 'ocean' | 'rain' | 'matrix'
  width?: number
  height?: number
  fps?: number
  fillContainer?: boolean
}

export function WaterAscii({
  className = '',
  style,
  type = 'water',
  width = 80,
  height = 30,
  fps = 8,
  fillContainer = false,
}: WaterAsciiProps) {
  const [containerSize, setContainerSize] = useState({ width, height })
  
  useEffect(() => {
    if (!fillContainer) return
    
    const calculateSize = () => {
      // Calculate based on font size to fill container
      const fontSize = parseInt(style?.fontSize as string || '10px')
      const lineHeight = parseInt(style?.lineHeight as string || '12px')
      const charWidth = fontSize * 0.6 // Approximate monospace char width
      
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      
      const cols = Math.floor(viewportWidth / charWidth)
      const rows = Math.floor(viewportHeight / lineHeight)
      
      setContainerSize({ width: cols, height: rows })
    }
    
    calculateSize()
    window.addEventListener('resize', calculateSize)
    return () => window.removeEventListener('resize', calculateSize)
  }, [fillContainer, style?.fontSize, style?.lineHeight])
  
  const finalWidth = fillContainer ? containerSize.width : width
  const finalHeight = fillContainer ? containerSize.height : height
  
  // Generate frames based on type
  const frames = (() => {
    switch (type) {
      case 'matrix':
        return generateMatrixRainFrames(finalWidth, finalHeight, 60)
      case 'ocean':
        return generateOceanWavesFrames(finalWidth, finalHeight, 40)
      case 'rain':
        return generateRainFrames(finalWidth, finalHeight, 30)
      default:
        return generateWaterFrames(finalWidth, finalHeight, 30)
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