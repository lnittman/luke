import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { getZenColor } from '@/utils/colors';

export interface TechPillProps {
  text: string;
  index?: number;
  onClick?: () => void;
  isActive?: boolean;
}

export function TechPill({ text, index = 0, onClick, isActive = false }: TechPillProps) {
  const randomRotation = useMemo(() => 
    (Math.random() * 6 - 3) * (Math.random() > 0.5 ? 1 : -1), 
    []
  );

  const color = useMemo(() => 
    getZenColor(text, index),
    [text, index]
  );

  const defaultStyle = useMemo(() => ({
    backgroundColor: `rgb(${color.bg} / ${isActive ? 0.5 : 0.2})`,
    color: `rgb(${color.text} / ${isActive ? 1 : 0.85})`,
    boxShadow: `0 0 ${isActive ? '35px' : '15px'} 0 rgb(${color.glow} / ${isActive ? 0.35 : 0.1})`,
    textShadow: `0 0 ${isActive ? '25px' : '10px'} rgb(${color.glow} / ${isActive ? 0.8 : 0.4})`,
    scale: isActive ? 1.1 : 1,
    rotate: isActive ? randomRotation * 0.5 : 0,
  }), [color, isActive, randomRotation]);

  const hoverStyle = useMemo(() => ({
    backgroundColor: `rgb(${color.bg} / ${isActive ? 0.7 : 0.35})`,
    color: `rgb(${color.text})`,
    boxShadow: `0 0 ${isActive ? '45px' : '20px'} 0 rgb(${color.glow} / ${isActive ? 0.5 : 0.2})`,
    textShadow: `0 0 ${isActive ? '30px' : '12px'} rgb(${color.glow} / ${isActive ? 1 : 0.6})`,
  }), [color, isActive]);

  return (
    <motion.span 
      className="px-1.5 sm:px-2 md:px-3 py-0.5 rounded-full text-[0.65rem] sm:text-[10px] md:text-xs cursor-pointer select-none font-mono tracking-tight"
      initial={{
        backgroundColor: `rgb(${color.bg} / 0)`,
        color: `rgb(${color.text} / 0.5)`,
        boxShadow: `0 0 0 0 rgb(${color.glow} / 0)`,
        textShadow: `0 0 0 rgb(${color.glow} / 0)`,
        scale: 0.95,
      }}
      animate={{
        ...defaultStyle,
        transition: {
          duration: 0.4,
          delay: index * 0.05,
          ease: [0.23, 1, 0.32, 1],
          scale: { type: "spring", stiffness: 400, damping: 25 }
        }
      }}
      style={{
        transform: 'translateZ(0)', // Hardware acceleration
        willChange: 'transform, opacity, background-color, box-shadow', // Optimize animations
      }}
      whileHover={{ 
        rotate: isActive ? randomRotation * 0.7 : randomRotation,
        scale: isActive ? 1.12 : 1.15,
        ...hoverStyle,
        transition: { 
          type: "spring",
          stiffness: 400,
          damping: 15,
          mass: 0.8,
          velocity: 2
        }
      }}
      whileTap={{ 
        scale: 0.95,
        rotate: randomRotation * 0.3,
        transition: { 
          type: "spring",
          stiffness: 400,
          damping: 15
        }
      }}
      onClick={onClick}
    >
      {text}
    </motion.span>
  );
}
