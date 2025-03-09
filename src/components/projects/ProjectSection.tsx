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
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [containerWidth, setContainerWidth] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
  }, []);

  // Calculate fluid font sizes based on container width
  const getTitleFontSize = () => {
    if (containerWidth <= 0) return 'text-xs';
    
    // Base size on container width with min/max constraints
    if (containerWidth < 200) return 'text-[9px]';
    if (containerWidth < 300) return 'text-[11px]';
    if (containerWidth < 400) return 'text-xs';
    return 'text-sm';
  };

  const getItemFontSize = () => {
    if (containerWidth <= 0) return 'text-[9px]';
    
    // Base size on container width with min/max constraints
    if (containerWidth < 200) return 'text-[7px]';
    if (containerWidth < 300) return 'text-[9px]';
    if (containerWidth < 400) return 'text-[11px]';
    return 'text-xs';
  };

  return (
    <div 
      ref={sectionRef}
      className="w-full"
    >
      {/* Section Title - Clickable to toggle content */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className={clsx(
          "w-full flex items-center justify-between py-1 text-[rgb(var(--text-secondary))]",
          getTitleFontSize(),
          "hover:text-[rgb(var(--text-primary))] transition-colors"
        )}
      >
        <span className="truncate">{title}</span>
        <span 
          className="opacity-60 ml-2"
        >
          {isExpanded ? '−' : '+'}
        </span>
      </button>

      {/* Section Content */}
      {isExpanded && (
        <div className="w-full pt-1 pb-1">
          {isTechSection ? (
            <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2">
              {items.map((item, i) => (
                <TechPill 
                  key={typeof item === 'string' ? item : item.name} 
                  text={item} 
                  index={i} 
                  containerWidth={containerWidth}
                />
              ))}
            </div>
          ) : (
            <ul className="space-y-1 w-full">
              {items.map((item, i) => (
                <li 
                  key={i}
                  className={clsx(
                    "text-[rgb(var(--text-primary))] break-words",
                    getItemFontSize()
                  )}
                >
                  {typeof item === 'string' ? item : item.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}; 