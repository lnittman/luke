'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  
  // Default to 'light' if theme is undefined (during initial load)
  const currentTheme = theme === 'light' ? 'light' : 'dark';
  
  return (
    <div className="flex items-center gap-2 text-xs font-mono">
      <motion.button
        onClick={() => setTheme('light')}
        className={`py-1 transition-colors cursor-pointer ${
          currentTheme === 'light' 
            ? 'text-[rgb(var(--text-primary))]' 
            : 'text-[rgb(var(--text-secondary))]'
        }`}
        initial={{ opacity: 1 }}
        whileHover={{ 
          opacity: 0.8,
          textShadow: currentTheme === 'light' ? "0 0 8px rgb(var(--accent-1)/0.6)" : "none"
        }}
        whileTap={{ opacity: 0.6 }}
        transition={{ duration: 0.2 }}
      >
        light
      </motion.button>
      <span className="text-[rgb(var(--text-secondary))]">/</span>
      <motion.button
        onClick={() => setTheme('dark')}
        className={`py-1 transition-colors cursor-pointer ${
          currentTheme === 'dark' 
            ? 'text-[rgb(var(--text-primary))]' 
            : 'text-[rgb(var(--text-secondary))]'
        }`}
        initial={{ opacity: 1 }}
        whileHover={{ 
          opacity: 0.8,
          textShadow: currentTheme === 'dark' ? "0 0 8px rgb(var(--accent-1)/0.6)" : "none"
        }}
        whileTap={{ opacity: 0.6 }}
        transition={{ duration: 0.2 }}
      >
        dark
      </motion.button>
    </div>
  );
} 