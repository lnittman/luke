import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

interface GeneratedProject {
  id: string;
  name: string;
  emoji: string;
  description: string;
  createdAt: string;
}

interface GeneratedProjectsListProps {
  projects: GeneratedProject[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onProjectClick: (project: GeneratedProject) => void;
  onBackClick: () => void;
  showArborTooltip: boolean;
  setShowArborTooltip: (show: boolean) => void;
}

export const GeneratedProjectsList: React.FC<GeneratedProjectsListProps> = ({
  projects,
  currentPage,
  totalPages,
  onPageChange,
  onProjectClick,
  onBackClick,
  showArborTooltip,
  setShowArborTooltip
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
  const renderProjectIcon = (project: GeneratedProject) => {
    // Check if the project name contains "voet" or "loops" (case insensitive)
    if (project.name.toLowerCase().includes('voet')) {
      return (
        <div className="flex items-center justify-center w-6 h-6">
          <Image 
            src="/assets/voet.png" 
            alt="Voet" 
            width={20} 
            height={20} 
            className="object-contain"
          />
        </div>
      );
    } else if (project.name.toLowerCase().includes('loops')) {
      return (
        <div className="flex items-center justify-center w-6 h-6">
          <Image 
            src="/assets/loops-xyz.png" 
            alt="Loops" 
            width={20} 
            height={20} 
            className="object-contain"
          />
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center w-6 h-6 text-xl leading-none">
          {project.emoji}
        </div>
      );
    }
  };
  
  return (
    <motion.div
      key="generated-projects-list"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full flex flex-col transform-gpu scale-[0.95] origin-top"
      style={{ 
        maxWidth: '100%',
        overflow: 'hidden'
      }}
    >
      {/* Project list header */}
      <div className="px-3 py-2 border-b border-[rgb(var(--border))] grid grid-cols-12 text-xs text-[rgb(var(--text-secondary))] w-full">
        <div className="col-span-2 flex items-center">emoji</div>
        <div className="col-span-4 flex items-center">project</div>
        <div className="col-span-6 flex items-center">description</div>
      </div>
      
      {/* Project list - exactly 9 rows with fixed height */}
      <div className="w-full bg-[rgb(var(--background-secondary))] rounded-b-lg">
        {/* Projects list - fixed to exactly 9 entries */}
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
            <div 
              className="px-3 py-2 border-b border-[rgb(var(--border))] grid grid-cols-12 hover:bg-[rgb(var(--background-hover))] transition-all duration-300 cursor-pointer group h-[46px] items-center"
            >
              <div className="col-span-2 flex items-center justify-start">
                {renderProjectIcon(project)}
              </div>
              <div className="col-span-4 flex items-center">
                <div className="text-[rgb(var(--text-accent))] text-xs lowercase font-medium transition-colors leading-none">
                  {project.name}
                </div>
              </div>
              <div className="col-span-6 flex items-center">
                <div className="text-[rgb(var(--text-secondary))] text-xs transition-colors leading-tight line-clamp-2">
                  {project.description}
                </div>
              </div>
            </div>
          </Link>
        ))}
        
        {/* Add empty rows to always show 9 items but WITHOUT dividers */}
        {projects.length < 9 && 
          Array.from({ length: 9 - projects.length }).map((_, index) => (
            <div 
              key={`empty-${index}`} 
              className="px-3 py-2 grid grid-cols-12 h-[46px]"
            />
          ))
        }
      </div>
      
      {/* Pagination controls with back button and question mark button */}
      <div className="w-full flex justify-between items-center py-3 px-3">
        {/* Back button (left) */}
        <Link 
          href="/projects"
          className="py-1 px-2 rounded-md text-xs text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-accent))] hover:bg-[rgb(var(--surface-1)/0.1)] transition-colors cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            onBackClick();
          }}
        >
          ← back
        </Link>
        
        {/* Pagination controls (center) */}
        <div className="flex items-center space-x-1">
          {/* Previous page button */}
          <button
            onClick={() => prevPage()}
            disabled={currentPage === 1}
            className={`
              px-2 py-1 rounded-md text-xs flex items-center justify-center
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
                return <span key={`ellipsis-${pageNum}`} className="w-3 text-center text-xs text-[rgb(var(--text-secondary))]">...</span>;
              }
              
              return isVisible ? (
                <button
                  key={index}
                  onClick={() => paginate(pageNum)}
                  className={`
                    w-5 h-5 rounded-full flex items-center justify-center text-xs
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
              px-2 py-1 rounded-md text-xs flex items-center justify-center
              ${currentPage === totalPages 
                ? "opacity-50 cursor-not-allowed text-[rgb(var(--text-secondary))]" 
                : "text-[rgb(var(--text-accent))] hover:bg-[rgb(var(--accent-1)/0.1)]"}
            `}
          >
            next
          </button>
        </div>
        
        {/* Question mark button with tooltip (right) */}
        <div className="relative z-30">
          <button
            onClick={() => window.open('https://arbor-xyz.vercel.app', '_blank')}
            className="px-2 py-1 rounded-md text-xs text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-accent))] hover:bg-[rgb(var(--surface-1)/0.1)] transition-colors"
            onMouseEnter={() => setShowArborTooltip(true)}
            onMouseLeave={() => setShowArborTooltip(false)}
            aria-label="Go to Arbor"
          >
            ?
          </button>
          
          {/* Tooltip */}
          <AnimatePresence>
            {showArborTooltip && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 bottom-9 z-50 w-32"
                style={{ display: 'block' }}
              >
                <div className="relative flex flex-col items-center">
                  <div className="px-2.5 py-1.5 rounded-md bg-[rgb(var(--surface-1)/0.9)] backdrop-blur-sm text-sm lowercase whitespace-nowrap">
                    go to arbor
                  </div>
                  <div 
                    className="absolute -bottom-1 right-4 w-2 h-2 rotate-45 bg-[rgb(var(--surface-1)/0.9)]"
                    style={{ backdropFilter: 'blur(8px)' }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}; 