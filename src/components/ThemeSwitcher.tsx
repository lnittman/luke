'use client';

import { useState, useEffect } from 'react';
import styles from './ThemeSwitcher.module.scss';

type Theme = 'light' | 'dark';

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Get initial theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'dark' : 'light';
      setTheme(initialTheme);
      document.documentElement.setAttribute('data-theme', initialTheme);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    
    // Update theme color meta tag
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const themeColors = {
        light: '#f5f4f2',
        dark: '#121820'
      };
      metaThemeColor.setAttribute('content', themeColors[nextTheme]);
    }
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
      <span className={styles.icon}>{themeIcons[theme]}</span>
    </button>
  );
}