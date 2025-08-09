'use client'

import { motion, useInView } from 'framer-motion'
import type React from 'react'
import { useRef } from 'react'

interface InViewProps {
  children: React.ReactNode
  variants?: {
    hidden: any
    visible: any
  }
  transition?: any
  viewOptions?: {
    once?: boolean
    margin?: string
    amount?: number | 'some' | 'all'
  }
  className?: string
}

export function InView({
  children,
  variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  transition = { duration: 0.6, ease: 'easeOut' },
  viewOptions = { once: true, margin: '-100px' },
  className = '',
}: InViewProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, viewOptions as any)

  return (
    <motion.div
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
      initial="hidden"
      ref={ref}
      transition={transition}
      variants={variants}
    >
      {children}
    </motion.div>
  )
}
