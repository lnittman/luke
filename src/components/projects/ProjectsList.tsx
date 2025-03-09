import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/utils/constants/projects';

interface ProjectsListProps {
  projects: Project[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onProjectClick: (project: Project) => void;
  GeneratedProjectsBorderGlow: React.FC;
}

export const ProjectsList: React.FC<ProjectsListProps> = ({
  projects,
  currentPage,
  totalPages,
  onPageChange,
  onProjectClick,
  GeneratedProjectsBorderGlow
}) => {
  // Handle pagination
  const paginate = (pageNumber: number) => {
    onPageChange(pageNumber);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  // Function to render project icon or emoji
  const renderProjectIcon = (project: Project) => {
    if (project.id === 'voet') {
      return (
        <div className="flex items-center justify-center w-8 h-8">
          <Image 
            src="/assets/voet.png" 
            alt="Voet" 
            width={24} 
            height={24} 
            className="object-contain"
          />
        </div>
      );
    } else if (project.id === 'loops') {
      return (
        <div className="flex items-center justify-center w-8 h-8">
          <Image 
            src="/assets/loops-xyz.png" 
            alt="Loops" 
            width={24} 
            height={24} 
            className="object-contain"
          />
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center w-8 h-8 text-2xl">
          {project.emoji}
        </div>
      );
    }
  };
  
  return (
    <motion.div
      key="project-list"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full flex flex-col"
    >
      {/* Project list header */}
      <div className="px-4 py-3 border-b border-[rgb(var(--border))] grid grid-cols-12 text-sm text-[rgb(var(--text-secondary))] w-full">
        <div className="col-span-2">emoji</div>
        <div className="col-span-4">project</div>
        <div className="col-span-6">description</div>
      </div>
      
      {/* Project list - exactly 9 rows with fixed height */}
      <div className="w-full bg-[rgb(var(--background-secondary))] rounded-b-lg">
        {/* Generated projects entry with border glow */}
        <GeneratedProjectsBorderGlow />
        
        {/* Regular projects in custom order */}
        {projects.map((project) => (
          <Link 
            key={project.id}
            href={`/projects?id=${project.id}`}
            className="block"
            onClick={(e) => {
              e.preventDefault();
              onProjectClick(project);
            }}
          >
            <motion.div 
              className="px-4 py-3 border-b border-[rgb(var(--border))] grid grid-cols-12 hover:bg-[rgb(var(--background-hover))] transition-all duration-300 cursor-pointer group h-[52px] items-center"
              initial={{ opacity: 0.85 }}
              whileHover={{ opacity: 1 }}
              whileTap={{ opacity: 0.9 }}
            >
              <div className="col-span-2 flex items-center">
                {renderProjectIcon(project)}
              </div>
              <div className="col-span-4 flex items-center">
                <div className="text-[rgb(var(--text-primary))] group-hover:text-[rgb(var(--text-accent))] transition-colors text-sm lowercase">
                  {project.name}
                </div>
              </div>
              <div className="col-span-6 flex items-center">
                <div className="text-[rgb(var(--text-secondary))] text-sm transition-colors">
                  {project.description}
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
        
        {/* Add empty rows to ensure exactly 9 rows when we have fewer than 8 projects (accounting for GeneratedProjectsBorderGlow) */}
        {projects.length < 8 && 
          Array.from({ length: 8 - projects.length }).map((_, index) => (
            <div 
              key={`empty-${index}`} 
              className="px-4 py-3 grid grid-cols-12 h-[52px]"
            />
          ))
        }
      </div>
      
      {/* Pagination controls - centered */}
      <div className="w-full flex justify-center items-center py-4 px-4">
        <div className="flex items-center space-x-2">
          {/* Previous page button */}
          <button
            onClick={() => prevPage()}
            disabled={currentPage === 1}
            className={`
              px-3 py-1 rounded-md text-xs flex items-center justify-center
              ${currentPage === 1 
                ? "opacity-50 cursor-not-allowed text-[rgb(var(--text-secondary))]" 
                : "text-[rgb(var(--text-accent))] hover:bg-[rgb(var(--accent-1)/0.1)]"}
            `}
          >
            prev
          </button>
          
          {/* Page numbers */}
          <div className="flex space-x-1">
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNum = index + 1;
              const isVisible = 
                pageNum === 1 || 
                pageNum === totalPages ||
                Math.abs(pageNum - currentPage) <= 1;
              
              if (!isVisible && pageNum === 2 || (!isVisible && pageNum === totalPages - 1)) {
                return <span key={`ellipsis-${pageNum}`} className="w-4 text-center text-xs text-[rgb(var(--text-secondary))]">...</span>;
              }
              
              return isVisible ? (
                <button
                  key={index}
                  onClick={() => paginate(pageNum)}
                  className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-xs
                    ${currentPage === pageNum 
                      ? "bg-[rgb(var(--accent-1)/0.15)] text-[rgb(var(--text-accent))]" 
                      : "text-[rgb(var(--text-secondary))] hover:bg-[rgb(var(--surface-1)/0.1)]"}
                  `}
                >
                  {pageNum}
                </button>
              ) : null;
            })}
          </div>
          
          {/* Next page button */}
          <button
            onClick={() => nextPage()}
            disabled={currentPage === totalPages}
            className={`
              px-3 py-1 rounded-md text-xs flex items-center justify-center
              ${currentPage === totalPages 
                ? "opacity-50 cursor-not-allowed text-[rgb(var(--text-secondary))]" 
                : "text-[rgb(var(--text-accent))] hover:bg-[rgb(var(--accent-1)/0.1)]"}
            `}
          >
            next
          </button>
        </div>
      </div>
    </motion.div>
  );
}; 