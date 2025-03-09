'use client';

import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { PROJECTS, type Project } from '@/utils/constants/projects';
import { ProjectContent } from '@/components/projects/ProjectContent';
import { VideoPlayer } from '@/components/projects/VideoPlayer';
import { useVideoPreload } from '@/hooks/useVideoPreload';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ProjectsList } from '@/components/projects/ProjectsList';
import { GeneratedProjectsList } from '@/components/projects/GeneratedProjectsList';
import { ProjectDetail } from '@/components/projects/ProjectDetail';

// Define the GeneratedProject interface
interface GeneratedProject {
  id: string;
  name: string;
  emoji: string;
  description: string;
  createdAt: string;
}

// Project icons map for custom icons (keep this definition)
const PROJECT_ICONS: Record<string, string> = {
  voet: '/assets/voet.png',
  loops: '/assets/loops-xyz.png'
};

// Custom order for projects
const PROJECT_ORDER = [
  'arbor',
  'ther',
  'jobs',
  'voet',
  'loops',
  'helios',
  'squish',
  'sine',
];

// Add the noThemeTransition style at the top of the file
const noThemeTransition = `
  /* Disable all transitions related to colors and borders */
  .project-list-item,
  .project-list-item *,
  [class*="border-[rgb(var(--border))]"],
  [class*="text-[rgb(var(--text"],
  [class*="bg-[rgb(var(--background"],
  .generated-name,
  .project-name,
  .project-description {
    transition-property: none !important;
  }

  /* Selectively enable only the transitions we want */
  .project-list-item:hover,
  .project-list-item:active {
    transition: opacity 300ms ease !important;
  }
`;

export default function Projects() {
  const [currentVideo, setCurrentVideo] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [generatedProjects, setGeneratedProjects] = useState<GeneratedProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocalhost, setIsLocalhost] = useState(false);
  const [showArborTooltip, setShowArborTooltip] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
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

  // Calculate total pages for pagination
  const totalPages = useMemo(() => {
    const totalItems = currentView === 'list' ? PROJECTS.length : generatedProjects.length;
    return Math.ceil(totalItems / 9);
  }, [currentView, generatedProjects.length, PROJECTS.length]);

  // Get the projects to display based on current pagination
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * 9;
    return currentView === 'list' 
      ? sortedProjects.slice(startIndex, startIndex + 9) as Project[]
      : generatedProjects.slice(startIndex, startIndex + 9) as GeneratedProject[];
  }, [currentPage, currentView, generatedProjects, sortedProjects]);

  // Handle changing page
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Handle going to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // Handle going to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Don't render anything until client-side hydration is complete
  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center px-4 overflow-hidden">
      {/* Add style to completely disable transitions during theme changes */}
      <style jsx global>{noThemeTransition}</style>
      
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
        <AnimatePresence mode="wait">
          {currentView === 'detail' && currentProject ? (
            // Project detail view
            <ProjectDetail
              project={currentProject}
              onBackClick={goToList}
              onShowDemo={showDemo}
              projectIcons={PROJECT_ICONS}
            />
          ) : currentView === 'generated' ? (
            // Generated projects view
            <GeneratedProjectsList
              projects={paginatedProjects as GeneratedProject[]}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={paginate}
              onProjectClick={(project) => {
                router.push(`/projects?id=${project.id}`);
                setCurrentView('detail');
              }}
              onBackClick={goToList}
              showArborTooltip={showArborTooltip}
              setShowArborTooltip={setShowArborTooltip}
            />
          ) : (
            // Main projects list view
            <ProjectsList
              projects={paginatedProjects as Project[]}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={paginate}
              onProjectClick={(project) => {
                router.push(`/projects?id=${project.id}`);
                setCurrentView('detail');
              }}
              GeneratedProjectsBorderGlow={GeneratedProjectsBorderGlow}
            />
          )}
        </AnimatePresence>
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
