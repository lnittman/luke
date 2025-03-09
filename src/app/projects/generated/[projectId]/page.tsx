'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ProjectDetail } from '@/components/projects/ProjectDetail';
import { VideoPlayer } from '@/components/projects/VideoPlayer';

// Project icons map for custom icons
const PROJECT_ICONS: Record<string, string> = {
  voet: '/assets/voet.png',
  loops: '/assets/loops-xyz.png'
};

export default function GeneratedProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const router = useRouter();
  const [currentVideo, setCurrentVideo] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the generated project data
  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true);
      try {
        const { projectId } = await params;
        const response = await fetch(`/api/projects/${projectId}`);
        if (response.ok) {
          const data = await response.json();
          setProject(data);
        } else {
          // If project not found, redirect to generated projects list
          router.push('/projects/generated');
        }
      } catch (error) {
        console.error('Error fetching generated project:', error);
        router.push('/projects/generated');
      } finally {
        setIsLoading(false);
      }
    };

    if (mounted) {
      fetchProject();
    }
  }, [mounted, params, router]);

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
    if (project?.videos && currentVideo !== null) {
      setCurrentVideo((currentVideo + 1) % project.videos.length);
    }
  };
  
  const prevVideo = () => {
    if (project?.videos && currentVideo !== null) {
      setCurrentVideo((currentVideo - 1 + project.videos.length) % project.videos.length);
    }
  };
  
  // Handle navigation to generated projects list
  const goToList = () => {
    router.push('/projects/generated');
  };

  // Don't render anything until client-side hydration is complete
  if (!mounted) {
    return null;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="text-[rgb(var(--text-secondary))] text-lg font-mono">
          loading...
        </div>
      </div>
    );
  }

  // If project not found, redirect to generated projects list
  if (!project) {
    return null;
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start px-4">
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
        <ProjectDetail
          key="project-detail"
          project={project}
          onBackClick={goToList}
          onShowDemo={showDemo}
          projectIcons={PROJECT_ICONS}
        />
      </div>
      
      {/* Video player popup */}
      <AnimatePresence>
        {project && currentVideo !== null && project.videos && project.videos.length > 0 && (
          <VideoPlayer 
            videos={project.videos}
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