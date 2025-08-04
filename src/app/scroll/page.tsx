'use client';

import React, { useEffect, useRef } from 'react';
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

const ASCII_PATTERNS = [
  `
╔═══════════════════════════════════════════════════════════════════════╗
║  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ║
║  ░░██╗░░░░░██╗░░░██╗██╗░░██╗███████╗░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ║
║  ░░██║░░░░░██║░░░██║██║░██╔╝██╔════╝░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ║
║  ░░██║░░░░░██║░░░██║█████╔╝░█████╗░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ║
║  ░░██║░░░░░██║░░░██║██╔═██╗░██╔══╝░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ║
║  ░░███████╗╚██████╔╝██║░░██╗███████╗░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ║
║  ░░╚══════╝░╚═════╝░╚═╝░░╚═╝╚══════╝░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ║
║  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ║
╚═══════════════════════════════════════════════════════════════════════╝
  `,
  `
┌─────────────────────────────────────────────────────────────────────┐
│ ╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱ │
│ ╱╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╱ │
│ ╱╱╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╱╱ │
│ ╱╱╱╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╱╱╱ │
│ ╱╱╱╱╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╱╱╱╱ │
│ ╱╱╱╱╱╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╱╱╱╱╱ │
│ ╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱ │
└─────────────────────────────────────────────────────────────────────┘
  `,
  `
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▓
▓░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░▓
▓░░▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒░░▓
▓░░▒▒▓▓█████████████████████████████████████████████████████▓▓▒▒░░▓
▓░░▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒░░▓
▓░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░▓
▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▓
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  `
];

function ASCIIInterlude({ pattern, index }: { pattern: string; index: number }) {
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
      className="h-[60vh] flex items-center justify-center px-6"
      style={{ opacity }}
    >
      <motion.pre
        className="font-mono text-xs sm:text-sm text-[rgb(var(--accent-1))] select-none"
        style={{ scale }}
      >
        {pattern}
      </motion.pre>
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
  const rotate = useTransform(scrollYProgress, [0, 1], [-5, 5]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  return (
    <motion.section
      ref={ref}
      className="min-h-[80vh] flex items-center justify-center px-6 py-20"
    >
      <motion.div
        style={{ y }}
        className="w-full max-w-6xl"
      >
        <InView
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Project Icon */}
            <motion.div
              className="flex justify-center"
              style={{ rotate, scale }}
            >
              <GlowEffect 
                intensity={0.4} 
                radius={40}
                color={index % 2 === 0 ? 'rgb(var(--accent-1))' : 'rgb(var(--accent-2))'}
              >
                <motion.div
                  className="text-[150px] md:text-[200px] select-none"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {project.emoji}
                </motion.div>
              </GlowEffect>
            </motion.div>

            {/* Project Info */}
            <div className="space-y-6">
              <AnimatedGroup preset="slide">
                <h2 className="text-4xl md:text-6xl font-mono">
                  <TextScramble text={project.name} />
                </h2>
                
                <p className="text-lg md:text-xl font-mono text-[rgb(var(--text-secondary))]">
                  <TextEffect text={project.description} preset="fade" />
                </p>

                <div className="flex items-center gap-4 mt-6">
                  {project.content.core.items.slice(0, 4).map((_, i) => (
                    <BlockLoader key={i} mode={(index * 2 + i) % 11} />
                  ))}
                </div>

                <motion.div 
                  className="flex gap-4 mt-8"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="brutalist-button text-sm"
                    >
                      VIEW DEMO →
                    </a>
                  )}
                  <a
                    href={project.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="brutalist-button text-sm"
                  >
                    SOURCE CODE →
                  </a>
                </motion.div>
              </AnimatedGroup>
            </div>
          </div>
        </InView>
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
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
        style={{ y, opacity }}
      >
        <GlowEffect color="rgb(var(--accent-2))" radius={50} intensity={0.3}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-mono mb-8">
            <TextScramble text="LUKE NITTMANN" />
          </h1>
        </GlowEffect>
        
        <AnimatedGroup preset="scale" className="flex items-center justify-center gap-4 mb-8">
          {[0, 1, 2, 3].map((i) => (
            <BlockLoader key={i} mode={i} className="text-2xl" />
          ))}
        </AnimatedGroup>
        
        <InView
          variants={{
            hidden: { opacity: 0, scale: 0.8 },
            visible: { opacity: 1, scale: 1 }
          }}
          transition={{ delay: 0.5, duration: 0.8, type: 'spring' }}
        >
          <p className="text-xl md:text-2xl font-mono text-[rgb(var(--text-secondary))] mb-12">
            <TextEffect text="Crafting digital experiences with AI-native thinking" preset="blur" />
          </p>
        </InView>
        
        <motion.div
          className="inline-block"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <GlowEffect intensity={0.6} radius={15}>
            <span className="font-mono text-sm text-[rgb(var(--accent-1))]">
              ↓ EXPLORE PROJECTS ↓
            </span>
          </GlowEffect>
        </motion.div>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="h-[50vh] flex items-center justify-center">
      <InView>
        <div className="text-center space-y-6">
          <h3 className="text-3xl font-mono">
            <TextScramble text="END OF TRANSMISSION" />
          </h3>
          <AnimatedGroup preset="stagger" className="flex items-center justify-center gap-2">
            {[8, 9, 10].map((i) => (
              <BlockLoader key={i} mode={i} />
            ))}
          </AnimatedGroup>
          <motion.a
            href="/"
            className="brutalist-button inline-block mt-8"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            RETURN HOME →
          </motion.a>
        </div>
      </InView>
    </footer>
  );
}

export default function ScrollPage() {
  return (
    <LenisProvider>
      {/* Spotlight Effect */}
      <Spotlight size={600} intensity={0.3} />
      
      {/* WebGL Fluid Background */}
      <div className="fixed inset-0 z-0">
        <FluidCanvas />
      </div>
      
      {/* Content - removed relative wrapper to allow natural document flow */}
      <div className="relative z-10">
        <Hero />
        
        {PROJECTS.map((project, index) => (
          <React.Fragment key={project.id}>
            {index > 0 && (
              <ASCIIInterlude 
                pattern={ASCII_PATTERNS[index % ASCII_PATTERNS.length]} 
                index={index} 
              />
            )}
            <div className="relative">
              {index % 3 === 1 && <AnimatedBackground variant="grid" opacity={0.02} />}
              {index % 3 === 2 && <AnimatedBackground variant="lines" opacity={0.03} />}
              <ProjectSection project={project} index={index} />
            </div>
          </React.Fragment>
        ))}
        
        <ASCIIInterlude 
          pattern={ASCII_PATTERNS[0]} 
          index={PROJECTS.length} 
        />
        
        <Footer />
      </div>
    </LenisProvider>
  );
}