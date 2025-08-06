'use client';

import React, { useEffect, useRef, Suspense } from 'react';
import { motion, useScroll, useTransform, useAnimationControls } from 'framer-motion';
import { LenisProvider } from '@/components/providers/LenisProvider';
import { PROJECTS } from '@/constants/projects';
import { FloatingScene } from '@/components/three/FloatingScene';
import { projectIcons } from '@/components/three/ProjectIcons';
import dynamic from 'next/dynamic';
import { BlockLoader } from '@/components/motion';

// Dynamically import components with SSR disabled
const FluidCanvas = dynamic(() => import('@/components/interactive/FluidCanvas'), {
  ssr: false,
  loading: () => null
});

function ProjectIcon({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['20%', '-20%']);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  const Icon3D = projectIcons[project.id as keyof typeof projectIcons];

  return (
    <motion.section
      ref={ref}
      className="min-h-[100vh] flex items-center justify-center px-6"
    >
      <motion.div
        style={{ y, opacity, scale }}
        className="w-full max-w-4xl mx-auto"
      >
        <div className="flex flex-col items-center">
          {/* 3D Project Icon */}
          <div className="h-[300px] md:h-[400px] mb-12">
            <Suspense fallback={
              <div className="flex items-center justify-center h-full">
                <BlockLoader mode={index % 11} className="text-4xl" />
              </div>
            }>
              {Icon3D && (
                <FloatingScene cameraPosition={[0, 0, 5]} enableControls={false}>
                  <Icon3D />
                </FloatingScene>
              )}
            </Suspense>
          </div>

          {/* Project Name */}
          <motion.h2 
            className="text-3xl md:text-5xl font-mono lowercase text-center"
            animate={{ opacity: [0, 1] }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {project.name}
          </motion.h2>
        </div>
      </motion.div>
    </motion.section>
  );
}

function ScrollIndicator() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <motion.div 
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
    >
      <motion.div 
        className="flex flex-col items-center gap-2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.div 
          className="w-6 h-10 rounded-full border-2 border-[rgb(var(--accent-1))] p-1"
        >
          <motion.div
            className="w-2 h-2 bg-[rgb(var(--accent-1))] rounded-full"
            style={{ y }}
          />
        </motion.div>
        <span className="font-mono text-xs text-[rgb(var(--text-secondary))]">scroll</span>
      </motion.div>
    </motion.div>
  );
}

export default function ScrollPage() {
  // Override body overflow for this page
  React.useEffect(() => {
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    document.documentElement.style.overflow = 'auto';
    document.documentElement.style.height = 'auto';
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
    };
  }, []);

  return (
    <LenisProvider>
      <div className="min-h-screen overflow-x-hidden">
        {/* Simple gradient background */}
        <div className="fixed inset-0 bg-gradient-to-br from-[rgb(var(--background-start))] to-[rgb(var(--background-end))]" />
        
        {/* Content */}
        <div className="relative z-10">
          <ScrollIndicator />
          
          {PROJECTS.map((project, index) => (
            <ProjectIcon key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </LenisProvider>
  );
}