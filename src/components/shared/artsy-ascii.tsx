'use client'

import { type CSSProperties, useEffect, useState } from 'react'
import { AsciiEngine } from '@/lib/ascii-engine'
import { generateMatrixRainFrames } from '@/lib/ascii-engine/generators/matrix'
import { generateDataFlowFrames, generatePulseFrames, generateWaveFrames } from '@/lib/ascii-engine/generators/wave'
import { generateIntenseFlameFrames } from '@/lib/ascii-engine/generators/flame'
import { generateErrorFrames } from '@/lib/ascii-engine/generators/404'

interface ArtsyAsciiProps {
  className?: string
  style?: CSSProperties
  type?: 'matrix' | 'dataflow' | 'pulse' | 'wave' | 'flame' | 'glitch' | 'random'
  width?: number
  height?: number
  fps?: number
  fillContainer?: boolean
}

export function ArtsyAscii({
  className = '',
  style,
  type = 'random',
  width = 80,
  height = 30,
  fps = 12,
  fillContainer = false,
}: ArtsyAsciiProps) {
  const [containerSize, setContainerSize] = useState({ width, height })
  const [currentType, setCurrentType] = useState(type)
  
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
  
  // Randomly pick a pattern if type is 'random'
  useEffect(() => {
    if (type === 'random') {
      const patterns: Array<typeof currentType> = ['matrix', 'dataflow', 'pulse', 'wave', 'flame', 'glitch']
      const randomPattern = patterns[Math.floor(Math.random() * patterns.length)]
      setCurrentType(randomPattern)
    } else {
      setCurrentType(type)
    }
  }, [type])
  
  const finalWidth = fillContainer ? containerSize.width : width
  const finalHeight = fillContainer ? containerSize.height : height
  
  // Generate frames based on type
  const frames = (() => {
    switch (currentType) {
      case 'matrix':
        return generateMatrixRainFrames(finalWidth, finalHeight, 60)
      case 'dataflow':
        return generateDataFlowFrames(finalWidth, finalHeight, 40)
      case 'pulse':
        return generatePulseFrames(finalWidth, finalHeight, 30)
      case 'wave':
        return generateWaveFrames(finalWidth, finalHeight, 30, 3)
      case 'flame':
        return generateIntenseFlameFrames(finalWidth, finalHeight, 40)
      case 'glitch':
        return generateErrorFrames(finalWidth, finalHeight, 40, '▓▒░ LUKE ░▒▓')
      default:
        return generatePulseFrames(finalWidth, finalHeight, 30)
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
        color: 'rgb(var(--accent-1))',
        opacity: 0.8,
        width: '100%',
        height: '100%',
        ...style,
      }}
    />
  )
}