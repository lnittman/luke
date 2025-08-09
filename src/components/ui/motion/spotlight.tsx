'use client'

import { motion } from 'framer-motion'
import React, { useEffect, useRef } from 'react'

interface SpotlightProps {
  size?: number
  intensity?: number
  color?: string
  className?: string
}

export function Spotlight({
  size = 400,
  intensity = 0.5,
  color = 'rgb(var(--accent-1))',
  className = '',
}: SpotlightProps) {
  const spotlightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!spotlightRef.current) return

      const rect = spotlightRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      spotlightRef.current.style.setProperty('--mouse-x', `${x}px`)
      spotlightRef.current.style.setProperty('--mouse-y', `${y}px`)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      className={`pointer-events-none fixed inset-0 overflow-hidden ${className}`}
      ref={spotlightRef}
      style={{
        background: `radial-gradient(${size}px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${color}${Math.round(
          intensity * 255
        )
          .toString(16)
          .padStart(2, '0')}, transparent 40%)`,
      }}
    >
      <motion.div
        animate={{ opacity: 1 }}
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        transition={{ duration: 1 }}
      />
    </div>
  )
}
