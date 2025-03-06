import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { getZenColor } from '@/utils/colors';

export interface QuotePillProps {
  text: string;
  index?: number;
  onClick?: () => void;
  isActive?: boolean;
}

export function QuotePill({ text, index = 0, onClick, isActive = false }: QuotePillProps) {
  const randomRotation = useMemo(() => 
    (Math.random() * 6 - 3) * (Math.random() > 0.5 ? 1 : -1), 
    []
  );

  const color = useMemo(() => 
    getZenColor(text, index),
    [text, index]
  );

  // Spring configuration for smooth transitions
  const springConfig = {
    type: "spring" as const,
    stiffness: 500,
    damping: 30, // Increased damping for less bouncy motion
    mass: 0.7,    // Reduced mass for quicker settling
    restDelta: 0.001, // Ensures animation completes fully
    restSpeed: 0.001  // Ensures animation settles completely
  };

  // Enhanced animation states with improved transitions
  const variants = {
    initial: {
      backgroundColor: `rgb(${color.bg} / 0)`,
      color: `rgb(${color.text} / 0.5)`,
      boxShadow: `0 0 0 0 rgb(${color.glow} / 0)`,
      textShadow: `0 0 0 rgb(${color.glow} / 0)`,
      scale: 0.97, // Slightly larger initial scale to reduce appearance of scaling
      rotate: 0
    },
    animate: {
      backgroundColor: `rgb(${color.bg} / ${isActive ? 0.5 : 0.2})`,
      color: `rgb(${color.text} / ${isActive ? 1 : 0.85})`,
      boxShadow: `0 0 ${isActive ? '35px' : '15px'} 0 rgb(${color.glow} / ${isActive ? 0.35 : 0.1})`,
      textShadow: `0 0 ${isActive ? '25px' : '10px'} rgb(${color.glow} / ${isActive ? 0.8 : 0.4})`,
      scale: isActive ? 1.05 : 1, // Reduced from 1.1 to 1.05
      rotate: isActive ? randomRotation * 0.3 : 0, // Reduced rotation
      transition: {
        duration: 0.3, // Slightly faster
        delay: index * 0.05,
        ease: [0.23, 1, 0.32, 1],
        scale: springConfig,
        rotate: springConfig,
        backgroundColor: { duration: 0.3 },
        boxShadow: { duration: 0.5 },
        textShadow: { duration: 0.5 }
      }
    },
    hover: {
      backgroundColor: `rgb(${color.bg} / ${isActive ? 0.7 : 0.35})`,
      color: `rgb(${color.text})`,
      boxShadow: `0 0 ${isActive ? '45px' : '20px'} 0 rgb(${color.glow} / ${isActive ? 0.5 : 0.2})`,
      textShadow: `0 0 ${isActive ? '30px' : '12px'} rgb(${color.glow} / ${isActive ? 1 : 0.6})`,
      rotate: isActive ? randomRotation * 0.4 : randomRotation * 0.6, // Less rotation
      scale: isActive ? 1.07 : 1.08, // Reduced from 1.12/1.15 to 1.07/1.08
      transition: {
        ...springConfig,
        damping: 25, // Slightly different damping for hover
      }
    },
    tap: {
      scale: 0.96, // Less scale down on tap (was 0.95)
      rotate: randomRotation * 0.2, // Less rotation
      transition: {
        ...springConfig,
        damping: 15, // Still bouncy for tap response
      }
    }
  };

  return (
    <motion.button
      className="px-1.5 sm:px-2 md:px-3 py-0.5 rounded-full text-[0.65rem] sm:text-[10px] md:text-xs cursor-pointer select-none  tracking-tight"
      variants={variants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      style={{
        transform: 'translateZ(0)', // Hardware acceleration
        willChange: 'transform, opacity, background-color, box-shadow', // Optimize animations
        transformOrigin: 'center', // Ensures scaling from center
        backfaceVisibility: 'hidden', // Prevents flickering in some browsers
      }}
    >
      {text}
    </motion.button>
  );
} 