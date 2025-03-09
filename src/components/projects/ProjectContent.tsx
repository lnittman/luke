import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Project } from '@/utils/constants/projects';
import { ProjectSection } from './ProjectSection';
import clsx from 'clsx';

interface ProjectContentProps {
  project: Project;
  onShowDemo?: () => void;
}

export const ProjectContent = ({ project, onShowDemo }: ProjectContentProps) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Monitor container width for fluid text sizing
  useEffect(() => {
    if (!contentRef.current) return;

    const updateWidth = () => {
      if (contentRef.current) {
        setContainerWidth(contentRef.current.offsetWidth);
      }
    };

    // Initial measurement
    updateWidth();

    // Set up resize observer
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(contentRef.current);

    return () => {
      if (contentRef.current) {
        resizeObserver.unobserve(contentRef.current);
      }
      resizeObserver.disconnect();
    };
  }, []);

  // Calculate fluid font sizes based on container width
  const getDescriptionFontSize = () => {
    if (containerWidth <= 0) return 'text-xs';
    
    if (containerWidth < 300) return 'text-[10px]';
    if (containerWidth < 500) return 'text-xs';
    if (containerWidth < 700) return 'text-sm';
    return 'text-base';
  };

  const getActionButtonFontSize = () => {
    if (containerWidth <= 0) return 'text-[10px]';
    
    if (containerWidth < 300) return 'text-[8px]';
    if (containerWidth < 500) return 'text-[10px]';
    if (containerWidth < 700) return 'text-xs';
    return 'text-sm';
  };

  const getPadding = () => {
    if (containerWidth <= 0) return 'px-3 py-2';
    
    if (containerWidth < 300) return 'px-2 py-1.5';
    if (containerWidth < 500) return 'px-3 py-2';
    if (containerWidth < 700) return 'px-4 py-3';
    return 'px-6 py-4';
  };

  return (
    <div ref={contentRef} className="flex flex-col py-2 sm:py-4 md:py-6 pb-32 sm:pb-28 md:pb-24 transition-all duration-300 w-full">
      <div className="w-full max-w-4xl mx-auto space-y-3 sm:space-y-5 overflow-visible">
        <div className={clsx("space-y-2", getPadding())}>
          <p className={clsx(" text-[rgb(var(--text-primary))]", getDescriptionFontSize())}>
            {project.description}
          </p>

          {/* Action Buttons - Only show demo and source buttons */}
          <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 pt-2">
            {project.videos && project.videos.length > 0 && project.id !== 'voet' && onShowDemo && (
              <button 
                onClick={onShowDemo}
                className={clsx(" text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] transition-colors", getActionButtonFontSize())}
              >
                demo →
              </button>
            )}
            {(project.id === 'sine' || project.id === 'helios') && (
              <a 
                href={project.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={clsx(" text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] transition-colors", getActionButtonFontSize())}
              >
                source →
              </a>
            )}
          </div>
        </div>

        {/* Project Sections */}
        <div className="space-y-6 sm:space-y-8">
          <ProjectSection 
            title={project.content.overview.title} 
            items={project.content.overview.items} 
            defaultExpanded={true}
          />
          <ProjectSection 
            title={project.content.core.title} 
            items={project.content.core.items} 
            defaultExpanded={true}
          />
          <ProjectSection 
            title={project.content.architecture.title} 
            items={project.content.architecture.items}
          />
          <ProjectSection 
            title={project.content.tech.title} 
            items={project.content.tech.items}
            isTechSection={true}
          />
        </div>
      </div>
    </div>
  );
}; 