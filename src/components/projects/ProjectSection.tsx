import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { TechPill } from '../TechPill';
import clsx from 'clsx';

interface ProjectSectionProps {
  title: string;
  items: (string | { name: string; documentationUrl: string })[];
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
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [containerWidth, setContainerWidth] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    // Set expanded state based on defaultExpanded prop
    setIsExpanded(defaultExpanded);
  }, [defaultExpanded]);

  // Monitor container width for fluid text sizing
  useEffect(() => {
    if (!sectionRef.current) return;

    const updateWidth = () => {
      if (sectionRef.current) {
        setContainerWidth(sectionRef.current.offsetWidth);
      }
    };

    // Initial measurement
    updateWidth();

    // Set up resize observer
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) {
        resizeObserver.unobserve(sectionRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [mounted]);

  // Calculate fluid font sizes based on container width
  const getTitleFontSize = () => {
    if (containerWidth <= 0) return 'text-xs';
    
    // Base size on container width with min/max constraints
    if (containerWidth < 200) return 'text-[10px]';
    if (containerWidth < 300) return 'text-xs';
    if (containerWidth < 400) return 'text-sm';
    return 'text-base';
  };

  const getItemFontSize = () => {
    if (containerWidth <= 0) return 'text-[10px]';
    
    // Base size on container width with min/max constraints
    if (containerWidth < 200) return 'text-[8px]';
    if (containerWidth < 300) return 'text-[10px]';
    if (containerWidth < 400) return 'text-xs';
    return 'text-sm';
  };

  return (
    <motion.div 
      ref={sectionRef}
      className="space-y-1.5 sm:space-y-2 w-full"
      layout
      transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 25 }}
    >
      {/* Section Title - Always clickable to toggle content */}
      <motion.button 
        onClick={() => setIsExpanded(!isExpanded)}
        className={clsx(
          "w-full flex items-center justify-between  text-[rgb(var(--text-secondary))]",
          getTitleFontSize(),
          "hover:text-[rgb(var(--text-primary))] transition-colors"
        )}
        layout
      >
        <motion.span layout className="truncate">{title}</motion.span>
        <motion.span 
          className={clsx("opacity-60", containerWidth < 300 ? "text-[8px]" : "text-[10px]")}
          layout
        >
          {isExpanded ? '−' : '+'}
        </motion.span>
      </motion.button>

      {/* Section Content - Toggleable on all screen sizes */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden w-full"
            layout
          >
            {isTechSection ? (
              <motion.div 
                className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2 pt-1"
                layout
              >
                {items.map((item, i) => (
                  <TechPill 
                    key={typeof item === 'string' ? item : item.name} 
                    text={item} 
                    index={i} 
                    containerWidth={containerWidth}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.ul 
                className="space-y-1 sm:space-y-1.5 w-full"
                layout
              >
                {items.map((item, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={clsx(
                      " text-[rgb(var(--text-primary))] break-words",
                      getItemFontSize()
                    )}
                    layout
                  >
                    {typeof item === 'string' ? item : item.name}
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}; 