'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { Header } from '@/components/header';

const THEME_BACKGROUNDS = {
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

function BackgroundVideo({ activeTheme }: { activeTheme: number }) {
  const theme = THEME_BACKGROUNDS[activeTheme as keyof typeof THEME_BACKGROUNDS];
  const [videoError, setVideoError] = useState(false);
  
  useEffect(() => {
    console.log('Debug: BackgroundVideo mounted');
    console.log('Debug: Current theme:', activeTheme);
    console.log('Debug: Video path:', theme.video);
    setVideoError(false); // Reset error state on theme change
  }, [activeTheme, theme.video]);

  return (
    <AnimatePresence mode="sync" initial={false}>
      <motion.div
        key={activeTheme}
        className="fixed inset-0 -z-50 bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ 
          duration: 0.8,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        <div className="absolute inset-0">
          {!videoError ? (
            <video
              key={theme.video}
              src={theme.video}
              poster={theme.fallback}
              autoPlay
              loop
              muted
              playsInline
              className="object-cover w-full h-full"
              style={{ 
                filter: `blur(${theme.blur})`,
                opacity: theme.opacity,
              }}
              onLoadedData={() => console.log('Debug: Video loaded successfully:', theme.video)}
              onError={(e) => {
                console.error('Debug: Video failed to load:', e);
                console.error('Debug: Video path that failed:', theme.video);
                setVideoError(true);
              }}
            />
          ) : (
            <div 
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${theme.fallback})`,
                filter: `blur(${theme.blur})`,
                opacity: theme.opacity,
              }}
            />
          )}
        </div>
        
        <motion.div 
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 0.8,
            ease: [0.4, 0, 0.2, 1],
          }}
          style={{
            background: theme.overlay,
            mixBlendMode: 'soft-light',
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}

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
      <BackgroundVideo activeTheme={activeTheme} />
      {children}
    </div>
  );
} 