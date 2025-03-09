'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GeneratedProjectsList } from '@/components/projects/GeneratedProjectsList';

// Define the GeneratedProject interface
interface GeneratedProject {
  id: string;
  name: string;
  emoji: string;
  description: string;
  createdAt: string;
}

export default function GeneratedProjectsPage() {
  const router = useRouter();
  const [generatedProjects, setGeneratedProjects] = useState<GeneratedProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showArborTooltip, setShowArborTooltip] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Set mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch generated projects
  const fetchGeneratedProjects = useCallback(async () => {
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
  }, []);

  // Fetch generated projects on mount
  useEffect(() => {
    if (mounted) {
      fetchGeneratedProjects();
    }
  }, [mounted, fetchGeneratedProjects]);

  // Calculate total pages for pagination
  const totalPages = useMemo(() => {
    return Math.ceil(generatedProjects.length / 9);
  }, [generatedProjects.length]);

  // Get the projects to display based on current pagination
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * 9;
    return generatedProjects.slice(startIndex, startIndex + 9);
  }, [currentPage, generatedProjects]);

  // Handle changing page
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Handle navigation to projects list
  const goToList = useCallback(() => {
    router.push('/projects');
  }, [router]);

  // Don't render anything until client-side hydration is complete
  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center px-4 overflow-hidden">
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
        <AnimatePresence mode="wait" initial={false}>
          {isLoading ? (
            <motion.div
              key="generated-loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center justify-center py-20"
            >
              <div className="text-[rgb(var(--text-secondary))] text-lg font-mono">
                loading...
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="generated-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <GeneratedProjectsList
                projects={paginatedProjects}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={paginate}
                onProjectClick={(project) => {
                  router.push(`/projects/generated/${project.id}`);
                }}
                onBackClick={goToList}
                showArborTooltip={showArborTooltip}
                setShowArborTooltip={setShowArborTooltip}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 