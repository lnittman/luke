'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import styles from './ThemeSwitcher.module.scss';

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);


  if (!mounted) {
    // Return placeholder with same dimensions to prevent layout shift
    return (
      <div className={styles.themeSwitcher} style={{ width: '2rem', height: '2rem' }} />
    );
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const themeIcons = {
    light: '☀',
    dark: '☾'
  };

  return (
    <button
      className={styles.themeSwitcher}
      onClick={toggleTheme}
      aria-label={`Switch theme (current: ${theme})`}
      title={`Theme: ${theme}`}
    >
      <span className={styles.icon}>{themeIcons[theme as 'light' | 'dark'] || '☀'}</span>
    </button>
  );
}