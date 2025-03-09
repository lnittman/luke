'use client';

import { ThemeProvider } from 'next-themes';
import React, { useEffect, useState } from 'react';

export function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState('dark');

  // Ensure client-side hydration completes before rendering theme changes
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update theme color meta tag when theme changes
  useEffect(() => {
    if (!mounted) return;

    // Get the current theme from localStorage or default to dark
    const currentTheme = localStorage.getItem('theme') || 'dark';
    setTheme(currentTheme);

    // Set the theme color based on the current theme
    const themeColor = currentTheme === 'dark' ? '#161c24' : '#FFFFFF';
    
    // Update the theme-color meta tag
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute('content', themeColor);

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class' && mutation.target === document.documentElement) {
          const newTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
          const newThemeColor = newTheme === 'dark' ? '#161c24' : '#FFFFFF';
          metaThemeColor.setAttribute('content', newThemeColor);
          setTheme(newTheme);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, [mounted]);

  // This prevents hydration mismatch by ensuring colors are consistent
  // between server and client initial render
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      themes={['light', 'dark']}
      forcedTheme={!mounted ? 'dark' : undefined} // Force dark theme during SSR and until hydration completes
      disableTransitionOnChange // Disable all transitions when changing theme
    >
      {children}
    </ThemeProvider>
  );
} 