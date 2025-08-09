'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import styles from './theme-switcher.module.scss'

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return placeholder with same dimensions to prevent layout shift
    return (
      <div
        className={styles.themeSwitcher}
        style={{ width: '2.5rem', height: '2.5rem' }}
      />
    )
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const themeIcons = {
    light: '☀',
    dark: '☾',
  }

  return (
    <button
      aria-label={`Switch theme (current: ${theme})`}
      className={styles.themeSwitcher}
      onClick={toggleTheme}
      title={`Theme: ${theme}`}
    >
      <span className={styles.icon}>
        {themeIcons[theme as 'light' | 'dark'] || '☀'}
      </span>
    </button>
  )
}
