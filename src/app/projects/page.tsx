'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import { PROJECTS, type Project } from '@/utils/constants/projects';
import { ProjectContent } from '@/components/projects/ProjectContent';
import { ProjectPicker } from '@/components/projects/ProjectPicker';
import { VideoPlayer } from '@/components/projects/VideoPlayer';
import { ProjectGenerator } from '@/components/projects/ProjectGenerator';
import { useVideoPreload } from '@/hooks/useVideoPreload';
import clsx from 'clsx';

export default function Projects() {
  const [currentProject, setCurrentProject] = useState(PROJECTS[0]);
  const [currentVideo, setCurrentVideo] = useState<number | null>(null);
  const [showProjectPicker, setShowProjectPicker] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  // Track if the current project is a generated project
  const [isGeneratedProject, setIsGeneratedProject] = useState(false);
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const [contentDimensions, setContentDimensions] = useState({ width: 0, height: 0 });
  const [windowWidth, setWindowWidth] = useState(0);
  // Loading state for fetching generated projects
  const [isLoadingProject, setIsLoadingProject] = useState(false);
  // Load tech data for project generation
  const [techData, setTechData] = useState<{
    techMd: string;
    relationships: Record<string, string[]>;
    isNewGeneration: boolean;
  } | null>(null);

  // Preload all project videos
  const allVideos = PROJECTS.flatMap(p => p.videos?.map(v => v.src) || []);
  useVideoPreload(allVideos);

  // Fetch a generated project by ID
  const fetchGeneratedProject = useCallback(async (projectId: string) => {
    try {
      setIsLoadingProject(true);
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      
      // Use the direct endpoint to fetch the project by ID
      const response = await fetch(`${baseUrl}/api/projects/${projectId}`);
      
      if (!response.ok) {
        // If response is 404, the project doesn't exist
        if (response.status === 404) {
          return false;
        }
        throw new Error(`API error: ${response.status}`);
      }
      
      const project = await response.json();
      
      // Ensure the project has the expected format
      if (project && project.id) {
        setCurrentProject(project);
        setIsGeneratedProject(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error fetching generated project:', error);
      return false;
    } finally {
      setIsLoadingProject(false);
    }
  }, []);

  // Fetch tech data on page load
  useEffect(() => {
    const fetchTechData = async () => {
      try {
        console.log('Fetching tech data...');
        
        // Implement exponential backoff for retries
        const fetchWithRetry = async (retries = 3, delay = 1000) => {
          try {
            const response = await fetch('/api/tech');
            if (response.ok) {
              const data = await response.json();
              console.log('Tech data loaded successfully');
              setTechData(data);
              return data;
            } else {
              const errorText = await response.text();
              console.error('Failed to load tech data:', errorText);
              throw new Error(errorText);
            }
          } catch (error) {
            if (retries > 0) {
              console.log(`Retrying tech data fetch (${retries} attempts left)...`);
              await new Promise(resolve => setTimeout(resolve, delay));
              return fetchWithRetry(retries - 1, delay * 2);
            }
            throw error;
          }
        };
        
        await fetchWithRetry();
      } catch (error) {
        console.error('Error fetching tech data after retries:', error);
        
        // Set default tech data on error
        setTechData({
          techMd: "# Technology Stack Guide\n\nDefault technology information.",
          relationships: {
            "react": ["next.js", "typescript", "tailwind"],
            "next.js": ["react", "typescript", "vercel"],
            "node.js": ["express", "typescript"],
            "swift": ["swiftui", "combine"]
          },
          isNewGeneration: false
        });
      }
    };
    
    fetchTechData();
  }, []);

  useEffect(() => {
    // Get project id from hash (e.g. #drib -> drib)
    const projectId = window.location.hash.slice(1);
    
    // If hash exists and matches a base project, select it
    if (projectId && PROJECTS.some(p => p.id === projectId)) {
      const index = PROJECTS.findIndex(p => p.id === projectId);
      setCurrentProject(PROJECTS[index]);
      setIsGeneratedProject(false);
    }
    // If hash is 'new', open the project generator
    else if (projectId === 'new') {
      setShowGenerator(true);
    }
    // Otherwise, try to fetch it as a generated project
    else if (projectId) {
      fetchGeneratedProject(projectId).then(found => {
        // If the project wasn't found, default to the first project
        if (!found) {
          setCurrentProject(PROJECTS[0]);
          setIsGeneratedProject(false);
          window.location.hash = `#${PROJECTS[0].id}`;
        }
      });
    }

    // Initialize window width
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [fetchGeneratedProject]);

  // Store content dimensions when content changes or on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (contentContainerRef.current && !showProjectPicker && !showGenerator) {
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
  }, [currentProject, showProjectPicker, showGenerator]);

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
    setShowGenerator(false);
    // Update URL hash
    window.location.hash = `#${project.id}`;
    // Track if this is a base project from PROJECTS or a generated one
    setIsGeneratedProject(!PROJECTS.some(p => p.id === project.id));
  };

  const openProjectGenerator = () => {
    setShowGenerator(true);
    setShowProjectPicker(false);
    // Update URL hash to #new
    window.location.hash = 'new';
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
            onClick={() => {
              setShowProjectPicker(!showProjectPicker);
              if (showGenerator) setShowGenerator(false);
            }}
            className={clsx(
              "p-1.5 sm:p-2.5 rounded-xl font-mono flex items-center gap-2 sm:gap-3 relative",
              getButtonFontSize(),
              "w-32 sm:w-36 md:w-40 justify-between" // Fixed width with justified content
            )}
            whileTap={{ scale: 0.97 }}
          >
            <span className={clsx(getEmojiSize(), "relative")}>
              {showGenerator ? "✨" : currentProject.emoji}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ 
                  background: 'radial-gradient(circle at center, rgb(var(--accent-1) / 0.15) 0%, transparent 70%)',
                  boxShadow: showProjectPicker ? '0 0 20px rgb(var(--accent-1) / 0.2)' : 'none'
                }}
              />
            </span>
            <span className="lowercase flex-1 text-center">
              {showGenerator ? "new" : isLoadingProject ? "loading..." : currentProject.name}
            </span>
            <span className="opacity-70">{showProjectPicker ? '×' : '↓'}</span>
            <div className="absolute inset-0 rounded-xl glass-effect opacity-50" />
            {showProjectPicker && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 rounded-xl"
                style={{ 
                  background: 'radial-gradient(circle at center, rgb(var(--accent-1) / 0.15) 0%, transparent 70%)',
                  boxShadow: '0 0 20px rgb(var(--accent-1) / 0.2)'
                }}
              />
            )}
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
                  <ProjectPicker 
                    currentProject={currentProject}
                    onProjectChange={selectProject}
                    projects={PROJECTS}
                    onOpenProjectGenerator={openProjectGenerator}
                  />
                </motion.div>
              ) : showGenerator ? (
                <motion.div
                  key="project-generator"
                  initial={{ opacity: 0, position: 'absolute', width: '100%' }}
                  animate={{ opacity: 1, position: 'relative' }}
                  exit={{ opacity: 0, position: 'absolute', width: '100%' }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <ProjectGenerator 
                    onProjectGenerated={selectProject}
                    onCancel={() => setShowGenerator(false)}
                    techData={techData}
                  />
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
