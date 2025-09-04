'use client'

import { motion } from 'framer-motion'
import type React from 'react'

interface GlowEffectProps {
  children: React.ReactNode
  color?: string
  radius?: number
  intensity?: number
  className?: string
}

export function GlowEffect({
  children,
  color = 'rgb(var(--accent-1))',
  radius = 20,
  intensity = 0.5,
  className = '',
}: GlowEffectProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      whileHover={{ scale: 1.02 }}
    >
      <motion.div
        className="-z-10 absolute inset-0"
        initial={{ opacity: 0 }}
        style={{
          background: `radial-gradient(circle at center, ${color} 0%, transparent 70%)`,
          filter: `blur(${radius}px)`,
          transform: 'scale(1.2)',
        }}
        transition={{ duration: 0.3 }}
        whileHover={{ opacity: intensity }}
      />
      {children}
    </motion.div>
  )
}
