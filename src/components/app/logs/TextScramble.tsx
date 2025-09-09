'use client'

import React, { useEffect, useState, useRef } from 'react'

interface TextScrambleLoaderProps {
  text?: string
  isLoading: boolean
  loadingText?: string
  className?: string
}

const CHARS = '░▒▓█▄▀■□▢▣▤▥▦▧▨▩!@#$%^&*()_+-=[]{}|;:,.<>?'

export function TextScrambleLoader({ 
  text, 
  isLoading, 
  loadingText = 'loading…',
  className = ''
}: TextScrambleLoaderProps) {
  const [displayText, setDisplayText] = useState(loadingText)
  const [scrambledText, setScrambledText] = useState(loadingText)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const frameRef = useRef(0)

  useEffect(() => {
    const targetText = !isLoading && text ? text : loadingText
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    let frame = 0
    const scrambleLength = targetText.length
    const scrambleDuration = 30 // frames

    intervalRef.current = setInterval(() => {
      frame++
      
      if (frame > scrambleDuration) {
        setScrambledText(targetText)
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
        return
      }

      const progress = frame / scrambleDuration
      let scrambled = ''
      
      for (let i = 0; i < targetText.length; i++) {
        if (Math.random() < progress) {
          scrambled += targetText[i]
        } else {
          scrambled += CHARS[Math.floor(Math.random() * CHARS.length)]
        }
      }
      
      setScrambledText(scrambled)
    }, 50)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isLoading, text, loadingText])

  return (
    <span className={className} style={{ fontFamily: 'monospace' }}>
      {scrambledText}
    </span>
  )
}