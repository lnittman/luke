'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { PROJECTS, type Project } from '@/utils/constants/projects';
import { ProjectContent } from '@/components/projects/ProjectContent';
import { VideoPlayer } from '@/components/projects/VideoPlayer';
import { useVideoPreload } from '@/hooks/useVideoPreload';
import clsx from 'clsx';

export default function Projects() {
  const [currentProject, setCurrentProject] = useState(PROJECTS[0]);
  const [currentVideo, setCurrentVideo] = useState<number | null>(null);
  const [showProjectPicker, setShowProjectPicker] = useState(false);
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const [contentDimensions, setContentDimensions] = useState({ width: 0, height: 0 });
  const [windowWidth, setWindowWidth] = useState(0);

  // Preload all project videos
  const allVideos = PROJECTS.flatMap(p => p.videos?.map(v => v.src) || []);
  useVideoPreload(allVideos);

  useEffect(() => {
    // Get project id from hash (e.g. #drib -> drib)
    const projectId = window.location.hash.slice(1);
    
    // If hash exists and matches a project, select it
    if (projectId && PROJECTS.some(p => p.id === projectId)) {
      const index = PROJECTS.findIndex(p => p.id === projectId);
      setCurrentProject(PROJECTS[index]);
    }

    // Initialize window width
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Store content dimensions when content changes or on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (contentContainerRef.current && !showProjectPicker) {
        const { width, height } = contentContainerRef.current.getBoundingClientRect();
        setContentDimensions({ width, height });
      }
    };

    // Initial measurement
    updateDimensions();
    
    // Update on window resize
    window.addEventListener('resize', updateDimensions);
    
    // Cleanup
    return () => window.removeEventListener('resize', updateDimensions);
  }, [currentProject, showProjectPicker]);

  const closeVideo = () => setCurrentVideo(null);
  const showDemo = () => setCurrentVideo(0);
  
  const nextVideo = () => {
    if (currentVideo === null || !currentProject.videos) return;
    if (currentVideo < currentProject.videos.length - 1) {
      setCurrentVideo(currentVideo + 1);
    }
  };

  const prevVideo = () => {
    if (currentVideo === null || !currentProject.videos) return;
    if (currentVideo > 0) {
      setCurrentVideo(currentVideo - 1);
    }
  };

  const selectProject = (project: Project) => {
    setCurrentProject(project);
    setShowProjectPicker(false);
    // Update URL hash
    window.location.hash = `#${project.id}`;
  };

  // Calculate fluid button sizes based on window width
  const getButtonFontSize = () => {
    if (windowWidth < 400) return 'text-xs';
    if (windowWidth < 640) return 'text-sm';
    return 'text-base';
  };

  const getEmojiSize = () => {
    if (windowWidth < 400) return 'text-base';
    if (windowWidth < 640) return 'text-lg';
    return 'text-xl';
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Main content container with proper spacing for header */}
      <div className="pt-[76px] sm:pt-[84px] w-full">
        {/* Project Picker Button - Centered between header and content */}
        <motion.div 
          className="flex justify-center mb-4 sm:mb-6 md:mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <motion.button 
            onClick={() => setShowProjectPicker(!showProjectPicker)}
            className={clsx(
              "px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full font-mono flex items-center gap-1.5 sm:gap-2 transition-colors relative overflow-hidden",
              getButtonFontSize()
            )}
            whileHover={{ 
              boxShadow: '0 0 15px rgb(var(--accent-1) / 0.2)'
            }}
            whileTap={{ scale: 0.97 }}
          >
            <span className={clsx(getEmojiSize())}>{currentProject.emoji}</span>
            <span>{currentProject.name}</span>
            <span className="ml-1 sm:ml-2 opacity-70">{showProjectPicker ? '×' : '↓'}</span>
            <div className="absolute inset-0 rounded-full glass-effect opacity-30" />
            {/* Subtle glow effect instead of visible border */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{ 
                boxShadow: '0 0 10px rgb(var(--accent-1) / 0.15) inset',
                background: 'radial-gradient(circle at center, rgb(var(--accent-1) / 0.07) 0%, transparent 70%)'
              }}
            />
          </motion.button>
        </motion.div>

        {/* Content Container */}
        <div className="w-full max-w-5xl mx-auto px-2 sm:px-3 md:px-4 relative flex-1">
          {/* Content Area - Either Project Content or Grid */}
          <div 
            className="relative"
            style={contentDimensions.height > 0 ? {
              minHeight: `${contentDimensions.height}px`
            } : {}}
          >
            <AnimatePresence mode="wait">
              {showProjectPicker ? (
                <motion.div
                  key="project-grid"
                  initial={{ opacity: 0, position: 'absolute', width: '100%' }}
                  animate={{ opacity: 1, position: 'relative' }}
                  exit={{ opacity: 0, position: 'absolute', width: '100%' }}
                  transition={{ duration: 0.3 }}
                  className="w-full py-2 sm:py-4 md:py-6"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 max-w-4xl mx-auto">
                    {PROJECTS.map(project => (
                      <motion.div
                        key={project.id}
                        onClick={() => selectProject(project)}
                        className={clsx(
                          "p-2 sm:p-3 md:p-4 rounded-xl cursor-pointer relative overflow-hidden",
                          "transition-all duration-300",
                        )}
                        whileHover={{ 
                          boxShadow: '0 0 20px rgb(var(--accent-1) / 0.15)',
                          transition: { duration: 0.2 }
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="absolute inset-0 rounded-xl glass-effect opacity-50" />
                        {project.id === currentProject.id && (
                          <motion.div
                            className="absolute inset-0 rounded-xl z-0"
                            style={{ 
                              background: 'radial-gradient(circle at center, rgb(var(--accent-1) / 0.15) 0%, transparent 70%)',
                              boxShadow: '0 0 20px rgb(var(--accent-1) / 0.2) inset',
                            }}
                          />
                        )}
                        <div className="relative z-10 flex flex-col items-center">
                          <div className={clsx(
                            "mb-1 sm:mb-2",
                            windowWidth < 400 ? "text-xl" : 
                            windowWidth < 640 ? "text-2xl" : "text-3xl"
                          )}>
                            {project.emoji}
                          </div>
                          <div className={clsx(
                            "font-mono text-center",
                            windowWidth < 400 ? "text-[10px]" : 
                            windowWidth < 640 ? "text-xs" : "text-sm"
                          )}>
                            {project.name}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={`project-content-${currentProject.id}`}
                  ref={contentContainerRef}
                  initial={{ opacity: 0, position: 'absolute', width: '100%' }}
                  animate={{ opacity: 1, position: 'relative' }}
                  exit={{ opacity: 0, position: 'absolute', width: '100%' }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                  layout
                >
                  <ProjectContent 
                    project={currentProject} 
                    onShowDemo={showDemo}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Full screen video player */}
      <AnimatePresence>
        {currentVideo !== null && currentProject.videos && (
          <VideoPlayer
            src={currentProject.videos[currentVideo].src}
            title={currentProject.videos[currentVideo].title}
            onClose={closeVideo}
            onNext={nextVideo}
            onPrev={prevVideo}
            hasNext={currentVideo < currentProject.videos.length - 1}
            hasPrev={currentVideo > 0}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
