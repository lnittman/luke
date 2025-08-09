'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GlowEffectProps {
  children: React.ReactNode;
  color?: string;
  radius?: number;
  intensity?: number;
  className?: string;
}

export function GlowEffect({ 
  children, 
  color = 'rgb(var(--accent-1))',
  radius = 20,
  intensity = 0.5,
  className = ''
}: GlowEffectProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: intensity }}
        transition={{ duration: 0.3 }}
        style={{
          background: `radial-gradient(circle at center, ${color} 0%, transparent 70%)`,
          filter: `blur(${radius}px)`,
          transform: 'scale(1.2)',
        }}
      />
      {children}
    </motion.div>
  );
}