'use client';

import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { PROJECTS, type Project } from '@/utils/constants/projects';
import { ProjectContent } from '@/components/projects/ProjectContent';
import { VideoPlayer } from '@/components/projects/VideoPlayer';
import { useVideoPreload } from '@/hooks/useVideoPreload';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

// Custom order for projects
const PROJECT_ORDER = [
  'ther',
  'jobs',
  'loops',
  'voet',
  'squish',
  'helios',
  'sine',
];

// Generated project interface
interface GeneratedProject {
  id: string;
  name: string;
  emoji: string;
  description: string;
  createdAt: string;
}

export default function Projects() {
  const [currentVideo, setCurrentVideo] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [generatedProjects, setGeneratedProjects] = useState<GeneratedProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocalhost, setIsLocalhost] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const projectId = searchParams?.get('id');
  
  // Use refs to access hash directly since NextJS sometimes has issues with hash fragments
  const generatedSectionRef = useRef<HTMLDivElement>(null);
  
  // Use explicit state for view management to ensure proper transitions
  const [currentView, setCurrentView] = useState<'list' | 'detail' | 'generated'>(
    projectId ? 'detail' : (window?.location?.hash === '#generated' ? 'generated' : 'list')
  );
  
  // Find the current project based on the ID in the URL
  const currentProject = projectId 
    ? PROJECTS.find(p => p.id === projectId) || null
    : null;

  // Check for localhost on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLocalhost(
        window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1'
      );
    }
  }, []);

  // Fetch generated projects when in generated view
  const fetchGeneratedProjects = useCallback(async () => {
    if (currentView === 'generated') {
      setIsLoading(true);
      try {
        const response = await fetch('/api/projects?limit=50');
        if (response.ok) {
          const data = await response.json();
          setGeneratedProjects(data.projects);
        }
      } catch (error) {
        console.error('Error fetching generated projects:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [currentView]);

  // Set mounted state and fetch generated projects if needed
  useEffect(() => {
    setMounted(true);
    if (currentView === 'generated') {
      fetchGeneratedProjects();
    }
  }, [currentView, fetchGeneratedProjects]);

  // Handle URL changes including hash changes
  useEffect(() => {
    const handleUrlChange = () => {
      if (window.location.hash === '#generated') {
        setCurrentView('generated');
      } else if (projectId) {
        setCurrentView('detail');
      } else {
        setCurrentView('list');
      }
    };

    handleUrlChange();

    window.addEventListener('hashchange', handleUrlChange);
    return () => window.removeEventListener('hashchange', handleUrlChange);
  }, [projectId]);

  // Sort projects in custom order
  const sortedProjects = useMemo(() => {
    // Create a mapping of project ID to sort order
    const orderMap = PROJECT_ORDER.reduce((map, id, index) => {
      map[id] = index;
      return map;
    }, {} as {[key: string]: number});
    
    // Sort projects based on the custom order
    return [...PROJECTS].sort((a, b) => {
      // If both projects are in the order map, sort by order
      if (orderMap[a.id] !== undefined && orderMap[b.id] !== undefined) {
        return orderMap[a.id] - orderMap[b.id];
      }
      // If only project a is in the order map, it comes first
      else if (orderMap[a.id] !== undefined) {
        return -1;
      }
      // If only project b is in the order map, it comes first
      else if (orderMap[b.id] !== undefined) {
        return 1;
      }
      // If neither project is in the order map, maintain original order
      return 0;
    });
  }, []);

  // Preload all project videos
  const allVideos = PROJECTS.flatMap(p => p.videos?.map(v => v.src) || []);
  useVideoPreload(allVideos);

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
  const goToList = useCallback(() => {
    router.push('/projects');
    setCurrentView('list');
  }, [router]);

  // Handle navigation to generated projects
  const goToGenerated = useCallback(() => {
    router.push('/projects#generated');
    setCurrentView('generated');
  }, [router]);

  // Handle creating a new generated project
  const handleCreateGeneratedProject = () => {
    // Navigate to project generator page or open modal
    router.push('/projects/generate');
  };

  // Generate mouse tracking animations for list items
  const GeneratedProjectsBorderGlow = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    
    const handleMouseMove = (e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };
    
    // Calculate shadow positions based on mouse
    const shadowX = useTransform(mouseX, val => {
      const bounds = val / 262 * 100; // 262 is approx width of list item
      return `${bounds}%`;
    });
    
    // Smooth out the animations
    const springX = useSpring(shadowX, { damping: 30, stiffness: 300 });
    
    return (
      <Link 
        href="/projects#generated"
        className="block relative group"
        onClick={(e) => {
          e.preventDefault();
          goToGenerated();
        }}
      >
        <motion.div 
          className="px-4 py-3 border-b border-[rgb(var(--border))] grid grid-cols-12 transition-opacity duration-300 cursor-pointer group/item h-16 items-center"
          onMouseMove={handleMouseMove}
          whileHover={{ opacity: 1 }}
          whileTap={{ opacity: 0.9 }}
          initial={{ opacity: 0.85 }}
        >
          {/* Top border glow */}
          <motion.div 
            className="absolute top-0 left-0 right-0 h-px z-0"
            style={{
              background: `linear-gradient(
                90deg, 
                rgba(var(--accent-1), 0) 0%, 
                rgba(var(--accent-1), 0.1) 10%,
                rgba(var(--accent-1), 0.6) ${springX}, 
                rgba(var(--accent-1), 0.1) 90%,
                rgba(var(--accent-1), 0) 100%
              )`
            }}
          />
          
          {/* Bottom border glow */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 h-px z-0"
            style={{
              background: `linear-gradient(
                90deg, 
                rgba(var(--accent-1), 0) 0%, 
                rgba(var(--accent-1), 0.1) 10%,
                rgba(var(--accent-1), 0.6) ${springX}, 
                rgba(var(--accent-1), 0.1) 90%,
                rgba(var(--accent-1), 0) 100%
              )`
            }}
          />
          
          <div className="col-span-2 text-2xl flex items-center relative z-10">
            ✨
          </div>
          <div className="col-span-4 flex items-center relative z-10">
            <div className="text-[rgb(var(--text-accent))] transition-colors text-base lowercase font-medium">
              generated
            </div>
          </div>
          <div className="col-span-6 flex items-center relative z-10">
            <div className="text-[rgb(var(--text-secondary))] text-sm">
              agent-generated projects
            </div>
          </div>
        </motion.div>
      </Link>
    );
  };

  // Don't render anything until client-side hydration is complete
  if (!mounted) {
    return null;
  }

  return (
    <div className="relative w-full h-[100dvh] flex flex-col items-center justify-center px-4 overflow-hidden">
      <div className="relative w-full max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {currentView === 'detail' && currentProject ? (
            // Project detail view
            <motion.div
              key={`project-${currentProject.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Header with back button */}
              <div className="mb-8">
                <Link 
                  href="/projects"
                  className="inline-block py-2 px-1 -ml-1 mb-4 text-sm text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-accent))] transition-colors cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    goToList();
                  }}
                >
                  ← projects
                </Link>
                
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">{currentProject.emoji}</span>
                  <h1 className="text-xl sm:text-2xl text-[rgb(var(--text-primary))]">
                    {currentProject.name.toLowerCase()}
                  </h1>
                </div>
              </div>
              
              {/* Project content */}
              <ProjectContent project={currentProject} onShowDemo={showDemo} />
              
              {/* Video player */}
              <AnimatePresence>
                {currentVideo !== null && currentProject?.videos && (
                  <VideoPlayer
                    videos={currentProject.videos}
                    currentIndex={currentVideo}
                    onClose={closeVideo}
                    onNext={nextVideo}
                    onPrev={prevVideo}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          ) : currentView === 'generated' ? (
            // Generated projects view
            <motion.div
              key="generated-projects-list"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 0.8,
                ease: [0.23, 1, 0.32, 1]
              }}
              className="w-full"
              ref={generatedSectionRef}
            >
              {/* Fixed header with back button and add button */}
              <div className="fixed top-0 left-0 right-0 z-10 bg-[rgb(var(--background))] pt-14 pb-4">
                <div className="max-w-2xl mx-auto px-4">
                  <div className="flex justify-between items-center pt-4">
                    <Link 
                      href="/projects"
                      className="inline-block py-2 px-1 -ml-1 text-sm text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-accent))] transition-colors cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        goToList();
                      }}
                    >
                      ← back
                    </Link>
                    {isLocalhost && (
                      <button
                        onClick={handleCreateGeneratedProject}
                        className="py-1 px-3 text-sm text-[rgb(var(--text-accent))] hover:bg-[rgb(var(--accent-1)/0.1)] rounded-full transition-colors"
                        aria-label="Create new project"
                      >
                        + new
                      </button>
                    )}
                  </div>
                  
                  <div className="mt-6 mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">✨</span>
                      <h1 className="text-xl sm:text-2xl text-[rgb(var(--text-primary))]">
                        agent-generated projects
                      </h1>
                    </div>
                    <p className="text-[rgb(var(--text-secondary))] text-sm ml-11">
                      ideas transformed into complete technical specifications
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Generated projects list - with top padding to account for fixed header */}
              <div className="w-full bg-[rgb(var(--background-secondary))] rounded-lg overflow-hidden relative mt-52">
                {/* List header */}
                <div className="px-4 py-3 border-b border-[rgb(var(--border))] grid grid-cols-12 text-sm text-[rgb(var(--text-secondary))]">
                  <div className="col-span-2">emoji</div>
                  <div className="col-span-3">project</div>
                  <div className="col-span-7">description</div>
                </div>
                
                {isLoading ? (
                  // Loading state
                  <div className="px-4 py-12 text-center text-[rgb(var(--text-secondary))]">
                    Loading projects...
                  </div>
                ) : generatedProjects.length === 0 ? (
                  // Empty state
                  <div className="px-4 py-12 text-center text-[rgb(var(--text-secondary))]">
                    <p>No generated projects yet.</p>
                    {isLocalhost && (
                      <button
                        onClick={handleCreateGeneratedProject}
                        className="mt-4 py-2 px-4 text-sm text-[rgb(var(--text-accent))] hover:bg-[rgb(var(--accent-1)/0.1)] rounded-full transition-colors"
                      >
                        Create your first project
                      </button>
                    )}
                  </div>
                ) : (
                  // Projects list
                  <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                    {generatedProjects.map((project) => (
                      <Link 
                        key={project.id}
                        href={`/projects/generated/${project.id}`}
                        className="block"
                      >
                        <motion.div 
                          className="px-4 py-3 border-b border-[rgb(var(--border))] grid grid-cols-12 hover:bg-[rgb(var(--background-hover))] transition-all duration-300 cursor-pointer group h-16 items-center"
                          initial={{ opacity: 0.85 }}
                          whileHover={{ opacity: 1 }}
                          whileTap={{ opacity: 0.9 }}
                        >
                          <div className="col-span-2 text-2xl flex items-center">
                            {project.emoji}
                          </div>
                          <div className="col-span-3 flex items-center">
                            <div className="text-[rgb(var(--text-primary))] group-hover:text-[rgb(var(--text-accent))] transition-colors text-base lowercase">
                              {project.name}
                            </div>
                          </div>
                          <div className="col-span-7 flex items-center">
                            <div className="text-[rgb(var(--text-secondary))] text-xs line-clamp-2 leading-tight">
                              {project.description}
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                    
                    {/* Fade-out gradient for the bottom of the list */}
                    <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none" 
                      style={{ 
                        background: 'linear-gradient(to bottom, rgba(var(--background-secondary), 0), rgba(var(--background-secondary), 1))' 
                      }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            // Main project list view
            <motion.div
              key="project-list"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8,
                ease: [0.23, 1, 0.32, 1]
              }}
              className="w-full"
            >
              {/* Project list header */}
              <div className="px-4 py-3 border-b border-[rgb(var(--border))] grid grid-cols-12 text-sm text-[rgb(var(--text-secondary))]">
                <div className="col-span-2">emoji</div>
                <div className="col-span-4">project</div>
                <div className="col-span-6">description</div>
              </div>
              
              {/* Project list */}
              <div className="w-full bg-[rgb(var(--background-secondary))] rounded-lg overflow-hidden">
                {/* Generated projects entry with mouse tracking border glow */}
                <GeneratedProjectsBorderGlow />
                
                {/* Regular projects in custom order */}
                {sortedProjects.map((project) => (
                  <Link 
                    key={project.id}
                    href={`/projects?id=${project.id}`}
                    className="block"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(`/projects?id=${project.id}`);
                      setCurrentView('detail');
                    }}
                  >
                    <motion.div 
                      className="px-4 py-3 border-b border-[rgb(var(--border))] grid grid-cols-12 hover:bg-[rgb(var(--background-hover))] transition-all duration-300 cursor-pointer group h-16 items-center"
                      initial={{ opacity: 0.85 }}
                      whileHover={{ opacity: 1 }}
                      whileTap={{ opacity: 0.9 }}
                    >
                      <div className="col-span-2 text-2xl flex items-center">
                        {project.emoji}
                      </div>
                      <div className="col-span-4 flex items-center">
                        <div className="text-[rgb(var(--text-primary))] group-hover:text-[rgb(var(--text-accent))] transition-colors text-base lowercase">
                          {project.name}
                        </div>
                      </div>
                      <div className="col-span-6 flex items-center">
                        <div className="text-[rgb(var(--text-secondary))] text-sm line-clamp-2 leading-tight">
                          {project.description}
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
