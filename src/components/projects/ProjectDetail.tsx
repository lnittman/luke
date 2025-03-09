import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/utils/constants/projects';
import { ProjectContent } from './ProjectContent';

interface ProjectDetailProps {
  project: Project;
  onBackClick: () => void;
  onShowDemo?: () => void;
  projectIcons: Record<string, string>;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({
  project,
  onBackClick,
  onShowDemo,
  projectIcons
}) => {
  return (
    <motion.div
      key={`project-${project.id}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full h-full overflow-auto"
    >
      {/* Header with back button, centered project title, and app button - fixed position */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-[rgb(var(--background))] pt-24 pb-4 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4 h-8">
            <Link 
              href="/projects"
              className="py-1 flex items-center text-xs text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-accent))] transition-colors cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                onBackClick();
              }}
            >
              ← back
            </Link>
            
            {/* Centered Project Title and Icon */}
            <div className="flex items-center gap-3 absolute left-1/2 transform -translate-x-1/2">
              {project.id in projectIcons ? (
                <div className="w-8 h-8 relative flex items-center justify-center">
                  <Image 
                    src={projectIcons[project.id]} 
                    alt={`${project.name} icon`}
                    width={28} 
                    height={28}
                    className="object-contain"
                    priority
                  />
                </div>
              ) : (
                <span className="text-2xl">{project.emoji}</span>
              )}
              <h1 className="text-lg text-[rgb(var(--text-primary))]">
                {project.name.toLowerCase()}
              </h1>
            </div>
            
            {/* App Button (if available and not Helios) */}
            {(project.demoUrl || project.appUrl) && project.id !== 'helios' && (
              <a 
                href={project.appUrl || project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 text-sm text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] transition-colors"
              >
                app →
              </a>
            )}
            
            {/* Source Button for Helios */}
            {project.id === 'helios' && (
              <a 
                href={project.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 text-sm text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] transition-colors"
              >
                source →
              </a>
            )}
          </div>
          
          {/* Project description - centered with reduced height */}
          <div className="flex justify-center h-12">
            <p className="text-sm text-[rgb(var(--text-secondary))] text-center max-w-2xl">
              {project.description}
            </p>
          </div>
        </div>
      </div>
      
      {/* Project content - with padding to account for fixed header */}
      <ProjectContent 
        project={project} 
        onShowDemo={onShowDemo}
      />
    </motion.div>
  );
}; 