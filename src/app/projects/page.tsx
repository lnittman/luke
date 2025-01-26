'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { PROJECTS, type Project } from '@/utils/constants/projects';
import { ProjectPicker } from '@/components/projects/ProjectPicker';
import { ProjectContent } from '@/components/projects/ProjectContent';
import { VideoPlayer } from '@/components/projects/VideoPlayer';
import { useVideoPreload } from '@/hooks/useVideoPreload';

export default function Projects() {
  const [currentProject, setCurrentProject] = useState(PROJECTS[0]);
  const [currentVideo, setCurrentVideo] = useState<number | null>(null);

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
  }, []);

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

  return (
    <div className="relative min-h-screen flex flex-col sm:justify-center">
      {/* Sticky Project Picker */}
      <div className="sticky top-[4.5rem] z-50 py-2 sm:absolute sm:top-[64px] sm:left-0 sm:right-0 bg-[rgb(var(--background))]">
        <ProjectPicker 
          currentProject={currentProject}
          onProjectChange={(project) => {
            setCurrentProject(project);
            setCurrentVideo(null);
          }}
          projects={PROJECTS}
        />
      </div>

      {/* Project Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentProject.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="pt-8 pb-24 sm:pb-0 sm:pt-0"
        >
          <ProjectContent 
            project={currentProject} 
            onShowDemo={showDemo}
          />
        </motion.div>
      </AnimatePresence>

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