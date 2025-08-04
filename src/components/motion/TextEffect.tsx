'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';

interface TextEffectProps {
  text: string;
  preset?: 'slide' | 'fade' | 'blur' | 'scale';
  delay?: number;
  className?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.03, delayChildren: i * 0.04 },
  }),
};

const childVariants: { [key: string]: Variants } = {
  slide: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', damping: 12, stiffness: 200 },
    },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.4 },
    },
  },
  blur: {
    hidden: { opacity: 0, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      transition: { duration: 0.4 },
    },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', damping: 15, stiffness: 300 },
    },
  },
};

export function TextEffect({ 
  text, 
  preset = 'slide',
  delay = 0,
  className = '' 
}: TextEffectProps) {
  const words = text.split(' ');
  const variants = childVariants[preset];

  return (
    <motion.span
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.8 }}
      custom={delay}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block"
          variants={variants}
        >
          {word}{i < words.length - 1 && '\u00A0'}
        </motion.span>
      ))}
    </motion.span>
  );
}