'use client';

import React, { useEffect, useRef, Suspense } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { LenisProvider } from '@/components/providers/LenisProvider';
import FluidCanvas from '@/components/interactive/FluidCanvas';
import { 
  TextScramble, 
  BlockLoader,
  AnimatedBackground,
  GlowEffect,
  TextEffect,
  InView,
  Spotlight,
  AnimatedGroup
} from '@/components/motion';
import { PROJECTS } from '@/constants/projects';
import { FloatingScene, ParticleField } from '@/components/three/FloatingScene';
import { projectIcons } from '@/components/three/ProjectIcons';

// 3D Interlude with floating icons
function ThreeInterlude({ icons, index }: { icons: React.ComponentType[]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);

  return (
    <motion.section
      ref={ref}
      className="h-[60vh] flex items-center justify-center"
      style={{ opacity }}
    >
      <motion.div 
        className="w-full h-full"
        style={{ scale }}
      >
        <FloatingScene cameraPosition={[0, 0, 8]}>
          <ParticleField count={200} />
          <group>
            {icons.map((Icon, i) => {
              const angle = (i / icons.length) * Math.PI * 2;
              const radius = 3;
              return (
                <group
                  key={i}
                  position={[
                    Math.cos(angle) * radius,
                    Math.sin(angle) * radius * 0.5,
                    Math.sin(angle + index) * 1
                  ]}
                  scale={0.8}
                >
                  <Icon />
                </group>
              );
            })}
          </group>
        </FloatingScene>
      </motion.div>
    </motion.section>
  );
}

function ProjectSection({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['10%', '-10%']);
  const iconOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const iconScale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.5, 1, 1, 0.8]);
  const nameY = useTransform(scrollYProgress, [0.2, 0.5], [50, 0]);
  const nameOpacity = useTransform(scrollYProgress, [0.2, 0.4, 0.6, 0.8], [0, 1, 1, 0]);

  const Icon3D = projectIcons[project.id as keyof typeof projectIcons];

  return (
    <motion.section
      ref={ref}
      className="min-h-[100vh] flex items-center justify-center px-6"
    >
      <motion.div
        style={{ y }}
        className="relative w-full max-w-6xl"
      >
        {/* 3D Project Icon */}
        <motion.div
          className="h-[400px] md:h-[500px] mb-12"
          style={{ opacity: iconOpacity, scale: iconScale }}
        >
          <Suspense fallback={
            <div className="flex items-center justify-center h-full">
              <BlockLoader mode={index % 11} className="text-4xl" />
            </div>
          }>
            <FloatingScene cameraPosition={[0, 0, 5]} enableControls={false}>
              {Icon3D && <Icon3D />}
            </FloatingScene>
          </Suspense>
        </motion.div>

        {/* Project Name - Below Icon */}
        <motion.div
          className="text-center"
          style={{ y: nameY, opacity: nameOpacity }}
        >
          <h2 className="text-3xl md:text-5xl font-mono lowercase">
            <TextScramble text={project.name} />
          </h2>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, -200]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="h-screen flex items-center justify-center relative">
      <AnimatedBackground variant="dots" opacity={0.05} />
      
      <motion.div 
        className="relative z-10 text-center px-6"
        style={{ y, opacity }}
      >
        <AnimatedGroup preset="scale" className="flex items-center justify-center gap-4">
          {[0, 1, 2, 3].map((i) => (
            <BlockLoader key={i} mode={i} className="text-4xl" />
          ))}
        </AnimatedGroup>
        
        <motion.div
          className="mt-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="font-mono text-sm text-[rgb(var(--accent-1))]">↓</span>
        </motion.div>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="h-[50vh] flex items-center justify-center">
      <InView>
        <AnimatedGroup preset="stagger" className="flex items-center justify-center gap-2">
          {[8, 9, 10].map((i) => (
            <BlockLoader key={i} mode={i} />
          ))}
        </AnimatedGroup>
      </InView>
    </footer>
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
      {/* Main container with proper height */}
      <div className="min-h-screen overflow-x-hidden">
        {/* Spotlight Effect */}
        <Spotlight size={600} intensity={0.3} />
        
        {/* WebGL Fluid Background */}
        <div className="fixed inset-0 z-0">
          <FluidCanvas />
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          <Hero />
          
          {PROJECTS.map((project, index) => {
            const allIcons = Object.values(projectIcons);
            const interludeIcons = [
              ...allIcons.slice(index * 2, (index * 2) + 3),
              ...allIcons.slice(0, Math.max(0, 3 - (allIcons.length - index * 2)))
            ].slice(0, 3);

            return (
              <React.Fragment key={project.id}>
                {index > 0 && (
                  <ThreeInterlude 
                    icons={interludeIcons}
                    index={index} 
                  />
                )}
                <div className="relative">
                  {index % 3 === 1 && <AnimatedBackground variant="grid" opacity={0.02} />}
                  {index % 3 === 2 && <AnimatedBackground variant="lines" opacity={0.03} />}
                  <ProjectSection project={project} index={index} />
                </div>
              </React.Fragment>
            );
          })}
          
          <ThreeInterlude 
            icons={Object.values(projectIcons).slice(-3)}
            index={PROJECTS.length} 
          />
          
          <Footer />
        </div>
      </div>
    </LenisProvider>
  );
}