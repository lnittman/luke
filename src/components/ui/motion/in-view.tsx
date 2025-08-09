'use client';

import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface InViewProps {
  children: React.ReactNode;
  variants?: {
    hidden: any;
    visible: any;
  };
  transition?: any;
  viewOptions?: {
    once?: boolean;
    margin?: string;
    amount?: number | 'some' | 'all';
  };
  className?: string;
}

export function InView({ 
  children, 
  variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  transition = { duration: 0.6, ease: 'easeOut' },
  viewOptions = { once: true, margin: '-100px' },
  className = ''
}: InViewProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, viewOptions as any);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}