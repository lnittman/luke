'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { PROJECTS } from '@/utils/constants/projects';
import { ProjectDetail } from '@/components/projects/ProjectDetail';
import { VideoPlayer } from '@/components/projects/VideoPlayer';

// Project icons map for custom icons
const PROJECT_ICONS: Record<string, string> = {
  voet: '/assets/voet.png',
  loops: '/assets/loops-xyz.png'
};

export default function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const router = useRouter();
  const [currentVideo, setCurrentVideo] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  // Find the current project based on the ID in the URL - with async handling
  useEffect(() => {
    const loadProject = async () => {
      if (!mounted) return;
      
      const { projectId } = await params;
      const currentProject = PROJECTS.find(p => p.id === projectId) || null;
      
      if (!currentProject) {
        router.push('/projects');
      }
    };
    
    loadProject();
  }, [mounted, params, router]);

  // Get the current project ID for rendering
  const [currentProject, setCurrentProject] = useState<any>(null);
  
  useEffect(() => {
    const initProject = async () => {
      const { projectId } = await params;
      setCurrentProject(PROJECTS.find(p => p.id === projectId) || null);
    };
    
    initProject();
  }, [params]);

  // Set mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close video player
  const closeVideo = () => setCurrentVideo(null);
  
  // Show demo video
  const showDemo = () => setCurrentVideo(0);
  
  // Navigation functions
  const nextVideo = () => {
    if (currentProject?.videos && currentVideo !== null) {
      setCurrentVideo((currentVideo + 1) % currentProject.videos.length);
    }
  };
  
  const prevVideo = () => {
    if (currentProject?.videos && currentVideo !== null) {
      setCurrentVideo((currentVideo - 1 + currentProject.videos.length) % currentProject.videos.length);
    }
  };
  
  // Handle navigation to projects list
  const goToList = () => {
    router.push('/projects');
  };

  // Don't render anything until client-side hydration is complete
  if (!mounted || !currentProject) {
    return null;
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start px-4">
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
        <ProjectDetail
          key="project-detail"
          project={currentProject}
          onBackClick={goToList}
          onShowDemo={showDemo}
          projectIcons={PROJECT_ICONS}
        />
      </div>
      
      {/* Video player popup */}
      <AnimatePresence>
        {currentProject && currentVideo !== null && currentProject.videos && currentProject.videos.length > 0 && (
          <VideoPlayer 
            videos={currentProject.videos}
            currentIndex={currentVideo}
            onClose={closeVideo}
            onNext={nextVideo}
            onPrev={prevVideo}
          />
        )}
      </AnimatePresence>
    </div>
  );
} 