'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  // Default to 'light' if theme is undefined (during initial load)
  const currentTheme = theme === 'light' ? 'light' : 'dark';
  
  return (
    <motion.button
      onClick={toggleTheme}
      className="py-2 px-1 text-sm text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-accent))] transition-colors cursor-pointer"
      initial={{ opacity: 1 }}
      whileHover={{ opacity: 0.8 }}
      whileTap={{ opacity: 0.6 }}
      transition={{ duration: 0.2 }}
    >
      {currentTheme}
    </motion.button>
  );
} 