'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function TimeDisplay() {
  const [colonVisible, setColonVisible] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const blinkTimer = setInterval(() => {
      setColonVisible(prev => !prev);
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(blinkTimer);
    };
  }, []);

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const period = hours >= 12 ? 'pm' : 'am';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');

  return (
    <motion.div 
      className="flex items-center gap-2"
      layout="position"
    >
      <span className="text-xs font-mono text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] transition-colors">
        {displayHours}
        <span style={{ opacity: colonVisible ? 1 : 0, transition: 'opacity 0.1s' }}>:</span>
        {displayMinutes} {period}
      </span>
    </motion.div>
  );
} 