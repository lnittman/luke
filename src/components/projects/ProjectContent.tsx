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

    // Set up resize observer with debounce to prevent excessive updates
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateWidth, 100);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(contentRef.current);

    return () => {
      clearTimeout(timeoutId);
      if (contentRef.current) {
        resizeObserver.unobserve(contentRef.current);
      }
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div 
      ref={contentRef} 
      className="w-full"
      style={{ 
        paddingTop: '280px', // Slightly reduced padding
      }}
    >
      <div className="w-full max-w-4xl mx-auto space-y-3"> {/* Reduced spacing between sections */}
        {/* All sections stacked directly */}
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
  );
}; 