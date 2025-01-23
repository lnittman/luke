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

  const hoverStyle = useMemo(() => ({
    backgroundColor: `rgb(${color.bg} / 0.4)`,
    color: `rgb(${color.text})`,
    boxShadow: `0 0 20px 0 rgb(${color.glow} / 0.1)`,
  }), [color]);

  return (
    <motion.span 
      className="px-1.5 sm:px-2 md:px-3 py-0.5 rounded-full text-[0.65rem] sm:text-[10px] md:text-xs glass-effect-strong cursor-pointer select-none text-slate-800 transition-colors duration-200 border border-slate-200/10"
      style={{
        background: `rgb(var(--surface-1) / 0.3)`,
        transform: 'translateZ(0)', // Hardware acceleration
      }}
      whileHover={{ 
        rotate: randomRotation,
        scale: 1.1,
        ...hoverStyle,
        transition: { 
          type: "spring",
          stiffness: 600,
          damping: 20,
          restDelta: 0.0001,
          bounce: 0.2
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
