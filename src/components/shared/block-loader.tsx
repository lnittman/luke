'use client'

import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import styles from './block-loader.module.scss'

interface BlockLoaderProps {
  mode?: number
}

const SEQUENCES = [
  // Mode 0: Braille dots
  ['⠋', '⠙', '⠸', '⠴', '⠦', '⠇'],
  // Mode 1: Complex blocks (Bio page)
  ['▖', '▘', '▝', '▗'],
  // Mode 2: Corner arrows (Home page)
  ['⌜', '⌝', '⌟', '⌞'],
  // Mode 3: Progress bars (Projects page)
  ['▁', '▃', '▄', '▅', '▆', '▇', '█', '▇', '▆', '▅', '▄', '▃'],
  // Mode 4: Vertical bars (Work page)
  ['▉', '▊', '▋', '▌', '▍', '▎', '▏', '▎', '▍', '▌', '▋', '▊'],
  // Mode 5: Directional arrows
  ['←', '↖', '↑', '↗', '→', '↘', '↓', '↙'],
  // Mode 6: Box drawing
  ['┤', '┘', '┴', '└', '├', '┌', '┬', '┐'],
  // Mode 7: Triangle corners
  ['◸', '◹', '◿', '◺'],
  // Mode 8: Circle quarters
  ['◴', '◷', '◶', '◵'],
  // Mode 9: Rotating circles
  ['◐', '◓', '◑', '◒'],
  // Mode 10: Half circles
  ['◠', '◡', '◟', '◞'],
]

export function BlockLoader({ mode = 0 }: BlockLoaderProps) {
  const [index, setIndex] = useState(0)
  const sequence = SEQUENCES[mode % SEQUENCES.length]

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % sequence.length)
    }, 100)

    return () => clearInterval(interval)
  }, [sequence.length])

  return (
    <div className={styles.container}>
      <span className={styles.character}>{sequence[index]}</span>
    </div>
  )
}
