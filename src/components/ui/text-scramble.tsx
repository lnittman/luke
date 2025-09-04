'use client'

import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'

interface TextScrambleProps {
  text: string
  className?: string
  scrambleSpeed?: number
  scrambleDuration?: number
}

const CHARACTERS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'

export function TextScramble({
  text,
  className = '',
  scrambleSpeed = 50,
  scrambleDuration = 1500,
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text)
  const [isScrambling, setIsScrambling] = useState(false)

  const scrambleText = () => {
    setIsScrambling(true)
    const chars = text.split('')
    const iterations = scrambleDuration / scrambleSpeed
    let currentIteration = 0

    const interval = setInterval(() => {
      currentIteration++
      const progress = currentIteration / iterations

      const scrambled = chars
        .map((char, index) => {
          if (char === ' ') return ' '

          // Gradually reveal the original text
          if (progress > index / chars.length) {
            return char
          }

          // Return random character
          return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]
        })
        .join('')

      setDisplayText(scrambled)

      if (currentIteration >= iterations) {
        clearInterval(interval)
        setDisplayText(text)
        setIsScrambling(false)
      }
    }, scrambleSpeed)
  }

  useEffect(() => {
    scrambleText()
  }, [text])

  return (
    <motion.span
      animate={{ opacity: 1 }}
      className={className}
      initial={{ opacity: 0 }}
      onHoverStart={() => !isScrambling && scrambleText()}
      style={{ fontFamily: 'var(--font-mono)' }}
    >
      {displayText}
    </motion.span>
  )
}
