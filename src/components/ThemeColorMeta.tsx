'use client';

import { useEffect } from 'react';

export function ThemeColorMeta() {
  useEffect(() => {
    // Function to update theme color based on color scheme
    const updateThemeColor = () => {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const themeColor = isDarkMode ? '#121820' : '#f2f1ef';
      
      // Update theme-color meta tag
      let metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.setAttribute('name', 'theme-color');
        document.head.appendChild(metaThemeColor);
      }
      metaThemeColor.setAttribute('content', themeColor);
      
      // Update apple status bar
      let metaAppleStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
      if (metaAppleStatusBar) {
        metaAppleStatusBar.setAttribute('content', isDarkMode ? 'black-translucent' : 'default');
      }
    };

    // Update on mount
    updateThemeColor();

    // Listen for theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateThemeColor);

    return () => {
      mediaQuery.removeEventListener('change', updateThemeColor);
    };
  }, []);

  return null;
}