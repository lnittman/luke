'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface LogoNameProps {
  name: string;
  isHovered: boolean;
  isExpanded: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function LogoName({ name, isHovered, isExpanded, onMouseEnter, onMouseLeave }: LogoNameProps) {
  return (
    <motion.div 
      className="text-base sm:text-lg font-medium text-[rgb(var(--text-primary))] flex items-center gap-2"
      layout="position"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      variants={{
        glow: { 
          filter: "drop-shadow(0 0 8px rgb(var(--accent-1)/0.6))",
          transition: { duration: 0.3 }
        },
        noGlow: { 
          filter: "drop-shadow(0 0 0px transparent)",
          transition: { duration: 0.3 }
        }
      }}
      animate={isExpanded || isHovered ? "glow" : "noGlow"}
    >
      <span className="font-mono">{name}</span>
    </motion.div>
  );
} 