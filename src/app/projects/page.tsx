'use client';

import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useState, useEffect, useCallback, useMemo, useRef, Suspense } from 'react';
import { PROJECTS, type Project } from '@/utils/constants/projects';
import { useVideoPreload } from '@/hooks/useVideoPreload';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ProjectsList } from '@/components/projects/ProjectsList';

// Project icons map for custom icons
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

// Wrapper component that uses search params
function ProjectsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  // Get the project ID from the URL
  const projectId = searchParams?.get('project');
  
  const [currentVideo, setCurrentVideo] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isLocalhost, setIsLocalhost] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Use explicit state for view management to ensure proper transitions
  const [currentView, setCurrentView] = useState<'list' | 'detail'>(
    projectId ? 'detail' : 'list'
  );
  
  // Find the current project based on the ID in the URL
  const currentProject = projectId 
    ? PROJECTS.find(p => p.id === projectId) || null
    : null;

  // Check for localhost on mount
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setIsLocalhost(
        window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1'
      );
    }
  }, []);

  // Handle URL changes
  useEffect(() => {
    const handleUrlChange = () => {
      if (projectId) {
        setCurrentView('detail');
      } else {
        setCurrentView('list');
      }
    };

    // Set up the listener for hash changes
    window.addEventListener('hashchange', handleUrlChange);
    
    // Initial view setup - prioritize project detail view if projectId exists
    if (projectId) {
      setCurrentView('detail');
    } else {
      setCurrentView('list');
    }
    
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
    router.push('/projects/generated');
  }, [router]);

  // Calculate total pages for pagination
  const totalPages = useMemo(() => {
    return Math.ceil(PROJECTS.length / 9);
  }, [PROJECTS.length]);

  // Get the projects to display based on current pagination
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * 9;
    return sortedProjects.slice(startIndex, startIndex + 9);
  }, [currentPage, sortedProjects]);

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
        href="/projects/generated"
        className="block relative group"
        onClick={(e) => {
          e.preventDefault();
          goToGenerated();
        }}
      >
        <motion.div 
          className="px-3 py-2 border-b border-[rgb(var(--border))] grid grid-cols-12 transition-opacity duration-300 cursor-pointer group/item h-[46px] items-center"
          onMouseMove={handleMouseMove}
          whileHover={{ opacity: 1 }}
          whileTap={{ opacity: 0.9 }}
        >
          {/* Glow effect */}
          <motion.div 
            className="absolute inset-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"
            style={{
              background: `
                radial-gradient(
                  circle at ${springX} 50%, 
                  rgba(var(--accent-1), 0.15) 0%, 
                  transparent 70%
                )
              `,
              zIndex: 0
            }}
          />
          
          <div className="col-span-2 flex items-center justify-start z-10">
            <div className="flex items-center justify-center w-6 h-6 text-xl leading-none">
              ✨
            </div>
          </div>
          <div className="col-span-4 flex items-center z-10">
            <div className="text-[rgb(var(--text-primary))] group-hover/item:text-[rgb(var(--text-accent))] transition-colors text-xs lowercase leading-none">
              generated
            </div>
          </div>
          <div className="col-span-6 flex items-center z-10">
            <div className="text-[rgb(var(--text-secondary))] text-xs transition-colors leading-tight line-clamp-2">
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
    <div className="fixed inset-0 flex items-center justify-center px-4 overflow-hidden">
      {/* Add style to completely disable transitions during theme changes */}
      <style jsx global>{noThemeTransition}</style>
      
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
        <AnimatePresence mode="wait" initial={true}>
          {currentView === 'detail' && currentProject ? (
            // Project detail view - redirect to the new URL structure
            <motion.div
              key="redirect"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              onAnimationComplete={() => {
                router.push(`/projects/${currentProject.id}`);
              }}
            />
          ) : (
            // Main projects list view
            <ProjectsList
              key="projects-list"
              projects={paginatedProjects as Project[]}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={paginate}
              onProjectClick={(project) => {
                router.push(`/projects/${project.id}`);
              }}
              GeneratedProjectsBorderGlow={GeneratedProjectsBorderGlow}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function Projects() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl mb-4">loading...</div>
        </div>
      </div>
    }>
      <ProjectsContent />
    </Suspense>
  );
}
