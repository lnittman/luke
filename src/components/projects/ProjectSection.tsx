import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { TechPill } from '../TechPill';
import clsx from 'clsx';

interface ProjectSectionProps {
  title: string;
  items: string[];
  defaultExpanded?: boolean;
  isTechSection?: boolean;
}

export const ProjectSection = ({ 
  title, 
  items, 
  defaultExpanded = false, 
  isTechSection = false 
}: ProjectSectionProps) => {
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  useEffect(() => {
    setMounted(true);
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 640); // Using sm breakpoint
    };
    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  useEffect(() => {
    if (mounted) {
      setIsExpanded(isDesktop || title.toLowerCase() === 'overview');
    }
  }, [mounted, isDesktop, title]);

  return (
    <div className="space-y-2">
      <button 
        onClick={() => !isDesktop && setIsExpanded(!isExpanded)}
        className={clsx(
          "w-full flex items-center justify-between text-sm sm:text-base font-mono text-[rgb(var(--text-secondary))]",
          isDesktop ? "cursor-default" : "hover:text-[rgb(var(--text-primary))] transition-colors"
        )}
      >
        <span>{title}</span>
        {!isDesktop && (
          <span className="text-xs opacity-60">{isExpanded ? '−' : '+'}</span>
        )}
      </button>
      <AnimatePresence initial={false}>
        {(isDesktop || isExpanded) && (
          <motion.div
            initial={!isDesktop ? { height: 0, opacity: 0 } : undefined}
            animate={!isDesktop ? { height: 'auto', opacity: 1 } : undefined}
            exit={!isDesktop ? { height: 0, opacity: 0 } : undefined}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {isTechSection ? (
              <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
                {items.map((item, i) => (
                  <TechPill key={item} text={item} index={i} />
                ))}
              </div>
            ) : (
              <ul className="space-y-1.5">
                {items.map((item, i) => (
                  <motion.li 
                    key={i}
                    initial={!isDesktop ? { opacity: 0, x: -10 } : undefined}
                    animate={!isDesktop ? { opacity: 1, x: 0 } : undefined}
                    transition={{ delay: i * 0.05 }}
                    className="text-xs sm:text-sm font-mono text-[rgb(var(--text-primary))]"
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 