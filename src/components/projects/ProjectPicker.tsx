import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { Project } from '@/utils/constants/projects';
import Link from 'next/link';

interface ProjectPickerProps {
  currentProject: Project;
  onProjectChange: (project: Project) => void;
  projects: Project[];
  onOpenProjectGenerator?: () => void;
}

// Generated project list separator/button
const GENERATED_PROJECTS_ID = 'generated-projects';

// Custom order for projects
const PROJECT_ORDER = [
  'ther',
  'loops',
  'jobs',
  'voet',
  'helios',
  'squish',
  'top',
  'sine',
];

export const ProjectPicker = ({ 
  currentProject, 
  onProjectChange,
  projects,
  onOpenProjectGenerator
}: ProjectPickerProps) => {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [itemHeight, setItemHeight] = useState<number>(0);
  
  // View state
  const [viewMode, setViewMode] = useState<'main' | 'generated'>('main');
  
  // Generated projects state
  const [generatedProjects, setGeneratedProjects] = useState<Project[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreProjects, setHasMoreProjects] = useState(true);
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
    total: 0
  });
  
  // Sort projects in custom order
  const sortedProjects = useMemo(() => {
    // Create a mapping of project ID to sort order
    const orderMap = PROJECT_ORDER.reduce((map, id, index) => {
      map[id] = index;
      return map;
    }, {} as {[key: string]: number});
    
    // Sort projects based on the custom order
    return [...projects].sort((a, b) => {
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
  }, [projects]);
  
  // Handle scroll events
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    
    // Load more projects when near bottom
    if (
      viewMode === 'generated' &&
      !isLoadingMore && 
      hasMoreProjects && 
      scrollTop + clientHeight >= scrollHeight - 100
    ) {
      loadMoreGeneratedProjects();
    }
  }, [viewMode, isLoadingMore, hasMoreProjects]);

  // Calculate appropriate height based on available space
  useEffect(() => {
    if (containerRef.current) {
      // Calculate available height more aggressively to fit above dock
      const availableHeight = Math.max(
        window.innerHeight * 0.5, // Use 50% of viewport height instead of 60%
        350 // Lower minimum height
      );
      
      // Calculate optimal item height including margins - adding 1 for the generated row
      const numItems = viewMode === 'main' ? sortedProjects.length + 1 : 
        Math.min(generatedProjects.length + 1, 8); // Cap at 8 items for generated view
      
      const calculatedItemHeight = Math.floor(availableHeight / numItems) - 4; // 4px for margin
      
      // Set a reasonable min/max for item height - reduced for better fit
      const optimalHeight = Math.max(Math.min(calculatedItemHeight, 70), 50);
      
      setItemHeight(optimalHeight);
    }
  }, [sortedProjects.length, generatedProjects.length, viewMode]);
  
  // Fetch generated projects
  const fetchGeneratedProjects = useCallback(async (offset = 0, limit = 10) => {
    try {
      setIsLoadingMore(true);
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      
      const response = await fetch(
        `${baseUrl}/api/projects?offset=${offset}&limit=${limit}`
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching generated projects:', error);
      return { projects: [], pagination: { total: 0, offset, limit } };
    } finally {
      setIsLoadingMore(false);
    }
  }, []);
  
  // Load initial generated projects
  const loadGeneratedProjects = useCallback(async () => {
    const data = await fetchGeneratedProjects(0, pagination.limit);
    setGeneratedProjects(data.projects || []);
    setPagination(data.pagination || { offset: 0, limit: pagination.limit, total: 0 });
    setHasMoreProjects((data.pagination?.total || 0) > (data.projects?.length || 0));
  }, [fetchGeneratedProjects, pagination.limit]);
  
  // Load more generated projects (pagination)
  const loadMoreGeneratedProjects = useCallback(async () => {
    if (isLoadingMore || !hasMoreProjects) return;
    
    const newOffset = pagination.offset + pagination.limit;
    const data = await fetchGeneratedProjects(newOffset, pagination.limit);
    
    if (data.projects && data.projects.length > 0) {
      setGeneratedProjects(prev => [...prev, ...data.projects]);
      setPagination(data.pagination || { offset: newOffset, limit: pagination.limit, total: pagination.total });
      setHasMoreProjects((data.pagination?.total || 0) > (newOffset + data.projects.length));
    } else {
      setHasMoreProjects(false);
    }
  }, [fetchGeneratedProjects, isLoadingMore, hasMoreProjects, pagination]);
  
  // Switch to generated projects view
  const openGeneratedProjects = useCallback(async () => {
    setViewMode('generated');
    if (generatedProjects.length === 0) {
      await loadGeneratedProjects();
    }
  }, [generatedProjects.length, loadGeneratedProjects]);
  
  // Return to main view
  const returnToMainView = useCallback(() => {
    setViewMode('main');
  }, []);
  
  // Add scroll event listener
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  return (
    <motion.div 
      className="w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="relative w-full rounded-lg overflow-hidden bg-[rgb(var(--background-secondary))] border border-[rgb(var(--border))]">
        {/* Header */}
        <div className="px-4 py-3 flex justify-between items-center border-b border-[rgb(var(--border))]">
          <div className="flex items-center gap-2">
            {viewMode === 'generated' && (
              <motion.button
                onClick={returnToMainView}
                className="text-sm text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-accent))] transition-colors"
                whileHover={{ opacity: 0.8 }}
                whileTap={{ opacity: 0.6 }}
              >
                ←
              </motion.button>
            )}
            <h3 className="text-[rgb(var(--text-secondary))] text-sm">
              {viewMode === 'main' ? 'select project' : 'ai-generated'}
            </h3>
          </div>
          
          <motion.button
            onClick={onOpenProjectGenerator}
            className="text-sm text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-accent))] transition-colors"
            whileHover={{ opacity: 0.8 }}
            whileTap={{ opacity: 0.6 }}
          >
            +
          </motion.button>
        </div>
        
        {/* Scrollable content area */}
        <div className="relative">
          {/* Scrollable content */}
          <div 
            ref={scrollContainerRef}
            className="p-3 max-h-[60vh] overflow-y-auto scroll-smooth hide-scrollbar"
            style={{ scrollbarWidth: 'none' }}
          >
            <motion.div 
              ref={containerRef} 
              className="space-y-3.5"
              layout
            >
              <AnimatePresence mode="wait">
                {viewMode === 'main' ? (
                  // Main projects view
                  <motion.div
                    key="main-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3.5"
                  >
                    {/* Base projects - in sorted order */}
                    {sortedProjects.map((project) => {
                      const isActive = currentProject.id === project.id;
                      
                      return (
                        <motion.div
                          key={project.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            duration: 0.3, 
                            delay: 0.03 * PROJECT_ORDER.indexOf(project.id)
                          }}
                          className="relative"
                          onMouseEnter={() => setHoveredProject(project.id)}
                          onMouseLeave={() => setHoveredProject(null)}
                        >
                          <Link 
                            href={`/projects?id=${project.id}`} 
                            passHref
                            onClick={(e) => {
                              e.preventDefault();
                              onProjectChange(project);
                            }}
                          >
                            <div
                              className={clsx(
                                "px-4 py-3 border-b border-[rgb(var(--border))] grid grid-cols-12 hover:bg-[rgb(var(--background-hover))] transition-colors cursor-pointer group",
                                isActive && "bg-[rgb(var(--background-hover))]"
                              )}
                              style={{ 
                                height: itemHeight ? `${itemHeight}px` : 'auto',
                              }}
                            >
                              <div className="col-span-2 text-2xl flex items-center">
                                {project.emoji}
                              </div>
                              <div className="col-span-10 flex flex-col justify-center">
                                <div className="text-[rgb(var(--text-primary))] group-hover:text-[rgb(var(--text-accent))] transition-colors text-base lowercase">
                                  {project.name}
                                </div>
                                <div className="text-[rgb(var(--text-secondary))] text-sm line-clamp-1">
                                  {project.description}
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                    
                    {/* "Generated Projects" option - main view */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.03 * sortedProjects.length }}
                      className="relative"
                      onMouseEnter={() => setHoveredProject(GENERATED_PROJECTS_ID)}
                      onMouseLeave={() => setHoveredProject(null)}
                    >
                      <div
                        className={clsx(
                          "px-4 py-3 border-b border-[rgb(var(--border))] grid grid-cols-12 hover:bg-[rgb(var(--background-hover))] transition-colors cursor-pointer group"
                        )}
                        onClick={openGeneratedProjects}
                        style={{ 
                          height: itemHeight ? `${itemHeight}px` : 'auto',
                        }}
                      >
                        <div className="col-span-2 text-2xl flex items-center">
                          ✨
                        </div>
                        <div className="col-span-10 flex flex-col justify-center">
                          <div className="text-[rgb(var(--text-primary))] group-hover:text-[rgb(var(--text-accent))] transition-colors text-base lowercase">
                            generated
                          </div>
                          <div className="text-[rgb(var(--text-secondary))] text-sm line-clamp-1">
                            ai-generated projects
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ) : (
                  // Generated projects view
                  <motion.div
                    key="generated-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3.5"
                  >
                    {/* Generated project items */}
                    {generatedProjects.length > 0 ? (
                      generatedProjects.map((project, index) => {
                        const isActive = currentProject.id === project.id;
                        
                        return (
                          <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.03 * index }}
                            className="relative"
                            onMouseEnter={() => setHoveredProject(project.id)}
                            onMouseLeave={() => setHoveredProject(null)}
                          >
                            <motion.div
                              className={clsx(
                                "relative p-2.5 rounded-xl transition-colors duration-300 border border-[rgb(var(--border))]",
                                hoveredProject === project.id ? "bg-[rgb(var(--surface-2))]" : "",
                                isActive && "bg-[rgb(var(--surface-2))] border-[rgb(var(--accent-1)/0.2)]"
                              )}
                              style={{ 
                                height: itemHeight ? `${itemHeight - 8}px` : 'auto',
                              }}
                            >
                              <button
                                onClick={() => {
                                  onProjectChange(project);
                                  returnToMainView();
                                }}
                                className="w-full h-full flex items-center gap-3 text-left"
                              >
                                <div className="text-2xl">
                                  {project.emoji}
                                </div>
                                <div className="flex-1">
                                  <div className="text-[rgb(var(--text-primary))] text-base lowercase">{project.name}</div>
                                  <div className="text-[rgb(var(--text-secondary))] text-sm line-clamp-1">
                                    {project.description}
                                  </div>
                                </div>
                              </button>
                            </motion.div>
                          </motion.div>
                        );
                      })
                    ) : (
                      // Loading state or empty state
                      <div className="py-3 text-center  text-sm text-[rgb(var(--text-secondary))]">
                        {isLoadingMore ? 'loading projects...' : 'no generated projects found'}
                      </div>
                    )}
                    
                    {/* Loading indicator */}
                    {isLoadingMore && generatedProjects.length > 0 && (
                      <div className="py-1.5 text-center  text-xs text-[rgb(var(--text-secondary))]">
                        loading more...
                      </div>
                    )}
                    
                    {/* End of list message */}
                    {!hasMoreProjects && generatedProjects.length > 0 && (
                      <div className="py-1.5 text-center  text-xs text-[rgb(var(--text-secondary))]">
                        end of list
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}; 