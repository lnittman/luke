import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { getZenColor } from '@/utils/colors';

export interface TechPillProps {
  text: string;
  index?: number;
}

export function TechPill({ text, index = 0 }: TechPillProps) {
  const randomRotation = useMemo(() => 
    (Math.random() * 6 - 3) * (Math.random() > 0.5 ? 1 : -1), 
    []
  );

  const color = useMemo(() => 
    getZenColor(text, index),
    [text, index]
  );

  return (
    <motion.span 
      className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs glass-effect-strong cursor-pointer select-none text-slate-800"
      style={{
        background: `rgb(var(--surface-1) / 0.3)`,
      }}
      whileHover={{ 
        rotate: randomRotation,
        scale: 1.1,
        backgroundColor: `rgb(${color.bg} / 0.4)`,
        color: `rgb(${color.text})`,
        boxShadow: `0 0 20px 0 rgb(${color.glow} / 0.1)`,
        transition: { 
          type: "spring",
          stiffness: 500,
          damping: 15,
          restDelta: 0.001
        }
      }}
      whileTap={{ 
        scale: 0.95,
        transition: { duration: 0.1 }
      }}
    >
      {text}
    </motion.span>
  );
}
