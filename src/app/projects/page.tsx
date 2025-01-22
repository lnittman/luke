'use client';

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { wrap } from 'popmotion';
import clsx from 'clsx';

interface Project {
  id: string;
  name: string;
  description: string;
  emoji: string;
  features: string[];
  tech: string[];
}

const PROJECTS: Project[] = [
  {
    id: 'sine',
    name: 'sine',
    description: 'A modern music production studio and sound design platform.',
    emoji: '🎵',
    features: [
      'Real-time audio processing and waveform visualization',
      'MIDI clip editing and pattern sequencing',
      'Sound pack management and sharing',
      'Beat detection and tempo synchronization',
      'Multi-track recording and mixing',
    ],
    tech: ['FastAPI', 'React', 'WebAudio', 'PostgreSQL', 'Redis']
  },
  {
    id: 'helios',
    name: 'helios',
    description: 'Context-aware AI assistant framework with advanced memory and reasoning.',
    emoji: '🌓',
    features: [
      'Long-term memory and context management',
      'Multi-modal reasoning capabilities',
      'Real-time knowledge graph construction',
      'Adaptive learning from user interactions',
      'Natural language understanding and generation',
    ],
    tech: ['Python', 'PyTorch', 'Neo4j', 'FastAPI', 'Redis']
  },
  {
    id: 'top',
    name: 'top',
    description: 'Developer tools for building and deploying AI-powered applications.',
    emoji: '🧠',
    features: [
      'Automated code generation and refactoring',
      'Intelligent code completion and suggestions',
      'Project scaffolding and templates',
      'Integrated AI development environment',
      'Real-time collaboration tools',
    ],
    tech: ['TypeScript', 'Next.js', 'tRPC', 'Turborepo', 'PostgreSQL']
  }
];

function ProjectPicker({ currentProject, onProjectChange }: { 
  currentProject: Project; 
  onProjectChange: (project: Project) => void;
}) {
  return (
    <motion.div 
      className="flex justify-center mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="glass flex gap-2 p-2">
        {PROJECTS.map((project) => (
          <button
            key={project.id}
            onClick={() => onProjectChange(project)}
            className={clsx(
              "relative p-3 rounded-lg transition-all duration-300",
              "hover:bg-white/5",
              currentProject.id === project.id 
                ? "text-white [text-shadow:0_0_10px_rgba(255,255,255,0.5)]" 
                : "text-white/40 blur-[0.2px]"
            )}
          >
            <span className="text-2xl relative">
              {project.emoji}
              {currentProject.id === project.id && (
                <motion.div
                  className="absolute inset-0 bg-white/20 blur-xl rounded-full"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.2, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function ProjectDetails({ project }: { project: Project }) {
  return (
    <motion.div 
      className="w-1/2 pr-8"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-8">
        <div>
          <h3 className="font-mono text-sm uppercase text-zinc-500 mb-3">Features</h3>
          <ul className="space-y-2">
            {project.features.map((feature, index) => (
              <motion.li 
                key={index} 
                className="flex items-center gap-2 text-sm"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="text-[rgb(var(--accent-1))]">▹</span>
                {feature}
              </motion.li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-mono text-sm uppercase text-zinc-500 mb-3">Tech Stack</h3>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech, index) => (
              <motion.span
                key={tech}
                className="px-2 py-1 text-xs font-mono rounded-md bg-[rgb(var(--accent-1))/0.1] text-[rgb(var(--accent-1))]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProjectDemo() {
  return (
    <motion.div 
      className="w-1/2 pl-8 border-l border-white/10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div className="aspect-video rounded-lg bg-black/20 flex items-center justify-center">
        <p className="text-zinc-500 font-mono text-sm">Demo video coming soon</p>
      </div>
    </motion.div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const glowX = useSpring(mouseX, { stiffness: 40, damping: 15, mass: 0.5 });
  const glowY = useSpring(mouseY, { stiffness: 40, damping: 15, mass: 0.5 });
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [7, -7]), {
    stiffness: 200,
    damping: 30,
    mass: 0.8,
  });
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-7, 7]), {
    stiffness: 200,
    damping: 30,
    mass: 0.8,
  });

  const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
  const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;

  const glowPositionX = useTransform(glowX, x => x + centerX);
  const glowPositionY = useTransform(glowY, y => y + centerY);

  const glowBackground = useTransform(
    [glowPositionX, glowPositionY],
    ([x, y]) => `
      radial-gradient(
        600px circle at ${x}px ${y}px,
        rgb(var(--accent-1) / 0.15),
        transparent 40%
      )
    `
  );

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full h-[600px]"
    >
      <motion.div
        className="glass-effect-strong relative rounded-2xl p-8 sm:p-12 w-full h-full overflow-hidden"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          transformPerspective: '1200px',
          boxShadow: '0 25px 50px -12px rgb(var(--accent-1) / 0.15)',
        }}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute -inset-[1px] rounded-2xl opacity-50"
          style={{
            background: glowBackground,
            filter: 'blur(5px)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 h-full">
          <div className="flex items-start gap-6 mb-12">
            <span className="text-4xl" style={{ transform: 'translateZ(20px)' }}>
              {project.emoji}
            </span>
            <div style={{ transform: 'translateZ(30px)' }}>
              <h2 className="font-mono text-2xl font-bold mb-2">{project.name}</h2>
              <p className="text-zinc-400">{project.description}</p>
            </div>
          </div>

          <div className="flex h-[calc(100%-7rem)]" style={{ transform: 'translateZ(40px)' }}>
            <ProjectDetails project={project} />
            <ProjectDemo />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const [currentProject, setCurrentProject] = useState(PROJECTS[0]);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const glowX = useSpring(mouseX, { stiffness: 40, damping: 15, mass: 0.5 });
  const glowY = useSpring(mouseY, { stiffness: 40, damping: 15, mass: 0.5 });
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [7, -7]), {
    stiffness: 200,
    damping: 30,
    mass: 0.8,
  });
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-7, 7]), {
    stiffness: 200,
    damping: 30,
    mass: 0.8,
  });

  const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
  const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;

  const glowPositionX = useTransform(glowX, x => x + centerX);
  const glowPositionY = useTransform(glowY, y => y + centerY);

  const glowBackground = useTransform(
    [glowPositionX, glowPositionY],
    ([x, y]) => `
      radial-gradient(
        600px circle at ${x}px ${y}px,
        rgb(var(--accent-1) / 0.15),
        transparent 40%
      )
    `
  );

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-16">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col">
          <ProjectPicker 
            currentProject={currentProject}
            onProjectChange={setCurrentProject}
          />

          <motion.div
            ref={containerRef}
            className="glass-effect-strong rounded-2xl p-8 sm:p-12 w-full h-[600px] overflow-hidden"
            style={{
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
              transformPerspective: '1200px',
              boxShadow: '0 25px 50px -12px rgb(var(--accent-1) / 0.15)',
            }}
          >
            {/* Glow effect */}
            <motion.div
              className="absolute -inset-[1px] rounded-2xl opacity-50"
              style={{
                background: glowBackground,
                filter: 'blur(5px)',
              }}
            />

            {/* Project Cards */}
            <div className="relative z-10 h-full">
              <AnimatePresence mode="wait">
                {PROJECTS.map((project) => (
                  project.id === currentProject.id && (
                    <motion.div
                      key={project.id}
                      className="absolute inset-0"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{
                        duration: 0.3,
                        ease: [0.23, 1, 0.32, 1]
                      }}
                    >
                      <div className="flex items-start gap-6 mb-12">
                        <span className="text-4xl" style={{ transform: 'translateZ(20px)' }}>
                          {project.emoji}
                        </span>
                        <div style={{ transform: 'translateZ(30px)' }}>
                          <h2 className="font-mono text-2xl font-bold mb-2">{project.name}</h2>
                          <p className="text-zinc-400">{project.description}</p>
                        </div>
                      </div>

                      <div className="flex h-[calc(100%-7rem)]" style={{ transform: 'translateZ(40px)' }}>
                        <ProjectDetails project={project} />
                        <ProjectDemo />
                      </div>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}