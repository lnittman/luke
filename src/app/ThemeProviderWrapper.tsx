'use client';

import { ThemeProvider } from 'next-themes';
import React, { useEffect, useState } from 'react';

export function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // Ensure client-side hydration completes before rendering theme changes
  useEffect(() => {
    setMounted(true);
  }, []);

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