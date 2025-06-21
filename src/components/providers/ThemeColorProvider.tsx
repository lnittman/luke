'use client';

import { useTheme } from 'next-themes';
import { useEffect } from 'react';

const themeColors = {
  light: '#f5f4f2', // rgb(245 244 242)
  dark: '#161c24',  // rgb(22 28 36)
  stone: '#2c2a28', // rgb(44 42 40)
};

export function ThemeColorProvider() {
  const { theme, systemTheme } = useTheme();

  useEffect(() => {
    const currentTheme = theme === 'system' ? systemTheme : theme;
    const color = themeColors[currentTheme as keyof typeof themeColors] || themeColors.light;
    
    // Update theme-color meta tag
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', color);
    }
    
    // Also update Apple status bar
    const metaAppleStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (metaAppleStatusBar) {
      metaAppleStatusBar.setAttribute('content', currentTheme === 'dark' || currentTheme === 'stone' ? 'black-translucent' : 'default');
    }
  }, [theme, systemTheme]);

  return null;
}