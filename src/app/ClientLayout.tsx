'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { clsx } from 'clsx';
import { Header } from '@/components/header/Header';
import ReactPlayer from 'react-player';

// Add type for valid theme numbers
type ThemeNumber = 1 | 2 | 3;

const THEME_BACKGROUNDS: Record<ThemeNumber, {
  video: string;
  fallback: string;
  blur: string;
  opacity: number;
  overlay: string;
}> = {
  1: { 
    video: '/water.mp4',
    fallback: '/assets/zen-garden.jpg',
    blur: '8px', 
    opacity: 0.85,
    overlay: 'linear-gradient(to bottom, rgba(var(--background-start), 0.1), rgba(var(--background-end), 0.3))'
  },
  2: { 
    video: '/water.mp4',
    fallback: '/assets/night-rain.jpg',
    blur: '10px', 
    opacity: 0.75,
    overlay: 'linear-gradient(180deg, rgba(var(--background-start), 0.2), rgba(var(--background-end), 0.4))'
  },
  3: { 
    video: '/water.mp4',
    fallback: '/assets/morning-mist.jpg',
    blur: '6px', 
    opacity: 0.8,
    overlay: 'linear-gradient(to bottom, rgba(var(--background-start), 0.15), rgba(var(--background-end), 0.35))'
  },
} as const;

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [activeTheme, setActiveTheme] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    console.log('Debug: ClientLayout mounted');
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style' && !isTransitioning) {
          const root = document.documentElement;
          const themeValue = root.style.getPropertyValue('--background-start');
          console.log('Debug: Theme value changed:', themeValue);
          
          setIsTransitioning(true);
          
          if (themeValue.includes('235')) {
            console.log('Debug: Setting theme to 1 (Zen Garden)');
            setActiveTheme(1);
          } else if (themeValue.includes('22')) {
            console.log('Debug: Setting theme to 2 (Night Rain)');
            setActiveTheme(2);
          } else if (themeValue.includes('238')) {
            console.log('Debug: Setting theme to 3 (Morning Mist)');
            setActiveTheme(3);
          }
          
          // Prevent multiple transitions within 0.8s
          setTimeout(() => setIsTransitioning(false), 800);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, [isTransitioning]);

  return (
    <div className={clsx(
      "text-[rgb(var(--text-primary))]",
      "min-h-screen w-full",
      "selection:bg-[rgb(var(--accent-1)/0.2)]",
      "transition-colors duration-700"
    )}>
      <Header />
      {children}
    </div>
  );
} 