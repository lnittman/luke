'use client';

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { wrap } from 'popmotion';
import clsx from 'clsx';
import { TechPill } from '@/components/TechPill';
import { getZenColor } from '@/utils/colors';

interface Project {
  id: string;
  name: string;
  emoji: string;
  description: string;
  demoUrl: string;
  sourceUrl: string;
  videos?: { src: string; title: string }[];
  content: {
    overview: {
      title: string;
      items: string[];
    };
    core: {
      title: string;
      items: string[];
    };
    architecture: {
      title: string;
      items: string[];
    };
    tech: {
      title: string;
      items: string[];
    };
  };
}

const PROJECTS: Project[] = [
  {
    id: 'squish',
    name: 'squish',
    emoji: '🐙',
    description: 'semantic social network for sharing and discovering multimedia through natural connections',
    demoUrl: 'https://squish.app',
    sourceUrl: 'https://github.com/nithya/squish',
    videos: [
      { src: 'assets/squish-demo-2.mp4', title: 'Asset Organization' },
      { src: 'assets/squish-demo.mp4', title: 'Semantic Search Demo' }
    ],
    content: {
      overview: {
        title: 'overview',
        items: [
          'semantic multimedia sharing + discovery',
          'embedding-based content organization',
          'real-time collaborative boards',
          'fluid animations + interactions'
        ]
      },
      core: {
        title: 'core',
        items: [
          'multimodal content processing',
          'semantic search engine',
          'interactive boards + comments',
          'real-time collaboration'
        ]
      },
      architecture: {
        title: 'architecture',
        items: [
          'monorepo with shared packages',
          'end-to-end type safety',
          'global edge deployment',
          'interactive documentation'
        ]
      },
      tech: {
        title: 'tech',
        items: [
          'nextjs',
          'fastapi',
          'neon',
          'railway',
          'typescript',
          'python',
          'liveblocks',
          'mintlify',
          'resend',
          'biome',
          'turbo',
          'cmdk',
          'gcp'
        ]
      }
    }
  },
  {
    id: 'top',
    name: 'top',
    emoji: '🧠',
    description: 'vision-first development platform',
    demoUrl: 'https://top.app',
    sourceUrl: 'https://github.com/nithya/top',
    videos: [
      { src: 'assets/top.mp4', title: 'Platform Demo' }
    ],
    content: {
      overview: {
        title: 'overview',
        items: [
          'natural language development',
          'vision-driven architecture',
          'context-aware tooling',
          'seamless abstractions'
        ]
      },
      core: {
        title: 'core',
        items: [
          'intelligent context system',
          'natural language interface',
          'semantic project mapping',
          'adaptive documentation'
        ]
      },
      architecture: {
        title: 'architecture',
        items: [
          'distributed platform',
          'llm pipeline system',
          'vector embeddings',
          'context graph'
        ]
      },
      tech: {
        title: 'tech',
        items: [
          'nextjs',
          'typescript',
          'python',
          'pgvector',
          'vertexai',
          'redis',
          'turborepo',
          'postgres'
        ]
      }
    }
  },
  {
    id: 'drib',
    name: 'drib',
    emoji: '⚽️',
    description: 'ai-first football platform',
    demoUrl: 'https://drib.app',
    sourceUrl: 'https://github.com/nithya/drib',
    videos: [
      { src: 'assets/drib-demo.mp4', title: 'Platform Demo' },
    ],
    content: {
      overview: {
        title: 'overview',
        items: [
          'real-time match analytics',
          'ai-powered tactical insights',
          'social match threads',
          'dashboard+widget interface'
        ]
      },
      core: {
        title: 'core',
        items: [
          'advanced metrics engine',
          'pattern recognition',
          'live match tracking',
          'community spaces'
        ]
      },
      architecture: {
        title: 'architecture',
        items: [
          'monorepo structure',
          'real-time websockets',
          'vector embeddings',
          'edge deployment'
        ]
      },
      tech: {
        title: 'tech',
        items: [
          'nextjs',
          'typescript',
          'python',
          'clerk',
          'liveblocks',
          'mintlify',
          'postgres',
          'vertexai',
          'websocket',
          'turborepo',
          'resend',
          'knock',
          'gcp'
        ]
      }
    }
  },
  {
    id: 'sine',
    name: 'sine',
    emoji: '🎵',
    description: 'midi-based beatmaking app for ios',
    demoUrl: 'https://sine.app',
    sourceUrl: 'https://github.com/nithya/sine',
    videos: [
      { src: 'assets/sine-ios.mp4', title: 'iOS App Demo' },
      { src: 'assets/sine-pack-utility.mp4', title: 'Pack Utility' }
    ],
    content: {
      overview: {
        title: 'overview',
        items: [
          'midi pattern sequencing',
          'web-based midi/sound pack upload utility',
          'collaborative sound sharing',
          'ai audio manipulation'
        ]
      },
      core: {
        title: 'core',
        items: [
          'midi engine + patterns',
          'semantic search',
          'pack management',
          'real-time sync'
        ]
      },
      architecture: {
        title: 'architecture',
        items: [
          'native ios client',
          'websocket streaming',
          'edge deployment',
          'vector search'
        ]
      },
      tech: {
        title: 'tech',
        items: [
          'swift',
          'swiftui',
          'midikit',
          'fastapi',
          'sqlmodel',
          'alembic',
          'postgres',
          'gcp',
          'neon',
          'railway'
        ]
      }
    }
  },
  {
    id: 'helios',
    name: 'helios',
    emoji: '☀️',
    description: 'macOS menu bar utility for display temperature control',
    demoUrl: 'https://helios.app',
    sourceUrl: 'https://github.com/nithya/helios',
    videos: [
      { src: 'assets/helios.mp4', title: 'App Demo' }
    ],
    content: {
      overview: {
        title: 'overview',
        items: [
          'native menu bar interface',
          'keyboard shortcuts',
          'fluid animations',
          'minimal interactions'
        ]
      },
      core: {
        title: 'core',
        items: [
          'display control',
          'atomic operations',
          'event system',
          'state persistence'
        ]
      },
      architecture: {
        title: 'architecture',
        items: [
          'native macos app',
          'metal rendering',
          'event streaming',
          'local storage'
        ]
      },
      tech: {
        title: 'tech',
        items: [
          'swift',
          'swiftui',
          'metal',
          'combine',
          'appkit',
          'sqlite',
          'keychain',
          'hotkey'
        ]
      }
    }
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
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="relative p-2 rounded-lg">
        {/* Persistent glass background */}
        <motion.div
          className="absolute inset-0 glass-effect"
          layoutId="picker-glass"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            type: "spring",
            bounce: 0,
            duration: 0.6
          }}
        />
        <div className="relative z-10 flex gap-2">
          {PROJECTS.map((project) => (
            <button
              key={project.id}
              onClick={() => onProjectChange(project)}
              className={clsx(
                "relative p-3 rounded-lg transition-all duration-300",
                "hover:bg-white/5",
                currentProject.id === project.id 
                  ? "[text-shadow:0_0_10px_rgba(255,255,255,0.5)]" 
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
      </div>
    </motion.div>
  );
}

function VideoPlayer({ src, title }: { src: string; title: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsColor = getZenColor('/controls');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => setProgress(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  const togglePlay = async () => {
    if (!videoRef.current) return;
    try {
      if (isPlaying) {
        await videoRef.current.pause();
      } else {
        await videoRef.current.play();
      }
    } catch (error) {
      console.error('Error toggling video:', error);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const newTime = percent * duration;
    videoRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      try {
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        }
        setIsFullscreen(true);
      } catch (error) {
        console.error('Error entering fullscreen:', error);
      }
    } else {
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
        setIsFullscreen(false);
      } catch (error) {
        console.error('Error exiting fullscreen:', error);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <motion.div 
      ref={containerRef}
      className={clsx(
        "relative overflow-hidden w-full h-full rounded-lg",
        isFullscreen ? "w-screen h-screen rounded-none" : ""
      )}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-contain rounded-lg"
          loop
          muted
          playsInline
          onClick={togglePlay}
        />
        
        {/* Control bar - always mounted */}
        <motion.div
          className="absolute bottom-4 left-4 right-4 pointer-events-auto"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ 
            duration: 0.2,
            ease: 'easeInOut'
          }}
          style={{
            pointerEvents: isHovered ? 'auto' : 'none',
            willChange: 'opacity'
          }}
        >
          <motion.div 
            className="flex flex-col gap-2"
          >
            {/* Seek bar */}
            <div 
              className="w-full h-1 rounded-full bg-white/10 cursor-pointer relative overflow-hidden"
              onClick={handleSeek}
            >
              <motion.div 
                className="absolute left-0 top-0 bottom-0 bg-white/30"
                style={{ 
                  width: `${(progress / duration) * 100}%`,
                  willChange: 'width'
                }}
              />
            </div>

            {/* Controls */}
            <motion.div 
              className="flex items-center justify-between px-3 py-2 rounded-lg backdrop-blur-md"
              style={{
                backgroundColor: `rgba(${controlsColor.bg}, 0.15)`,
                boxShadow: `0 0 20px 0 rgba(${controlsColor.glow}, 0.2)`,
                willChange: 'transform'
              }}
            >
              {/* Left side - Play/Pause */}
              <button
                className="relative p-2 rounded-lg block transition-colors duration-200 text-white/60 hover:text-white"
                onClick={togglePlay}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={isPlaying ? 'pause' : 'play'}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.15 }}
                    className="text-lg leading-none block"
                    style={{ width: '1em', textAlign: 'center' }}
                  >
                    {isPlaying ? '⏸️' : '▶️'}
                  </motion.span>
                </AnimatePresence>
              </button>

              {/* Right side - Download & Fullscreen */}
              <div className="flex items-center gap-2">
                <div className="w-px h-4 bg-white/20" />
                
                <a
                  href={src}
                  download
                  className="relative p-2 rounded-lg block transition-colors duration-200 text-white/60 hover:text-white"
                >
                  <span className="text-lg leading-none" style={{ width: '1em', textAlign: 'center' }}>
                    ⬇️
                  </span>
                </a>

                <button
                  className="relative p-2 rounded-lg block transition-colors duration-200 text-white/60 hover:text-white"
                  onClick={toggleFullscreen}
                >
                  <span className="text-lg leading-none" style={{ width: '1em', textAlign: 'center' }}>
                    {isFullscreen ? '⎋' : '🖥️'}
                  </span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function ProjectDetails({ project }: { project: Project }) {
  return (
    <div className="space-y-8">
      {Object.entries(project.content).map(([key, section], i) => (
        <motion.div 
          key={key} 
          className="rounded-xl glass-effect cursor-default p-6 transform-gpu"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 + i * 0.1 }}
          whileHover={{ 
            scale: 1.02,
            y: -2,
            transition: { 
              type: "spring",
              stiffness: 500,
              damping: 30
            }
          }}
          style={{
            transformOrigin: 'center left'
          }}
        >
          <div className="space-y-4">
            <h3 className="text-sm uppercase tracking-wider text-slate-200">
              {section.title}
            </h3>
            {key === 'tech' ? (
              <div className="flex flex-wrap gap-2">
                {section.items.map((item, i) => (
                  <TechPill key={item} text={item} index={i} />
                ))}
              </div>
            ) : (
              <ul className="space-y-3">
                {section.items.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 text-sm"
                  >
                    <span className="text-[rgb(var(--accent-1))] mt-0.5">▹</span>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      ))}
    </div>
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

  const demoColor = getZenColor('/demo');
  const sourceColor = getZenColor('/source');

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full h-[600px]"
    >
      <div className="relative rounded-2xl w-full h-full flex flex-col overflow-hidden">
        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="relative p-8 sm:p-10 border-b border-[rgb(var(--accent-1))]" style={{
            boxShadow: '0 1px 20px -1px rgb(var(--accent-1) / 0.2)'
          }}>
            <div className="flex items-start gap-8">
              <span className="text-5xl">
                {project.emoji}
              </span>
              <div>
                <h2 className="font-mono text-3xl font-bold mb-3">{project.name}</h2>
                <p className="font-mono text-lg text-slate-900">{project.description}</p>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex flex-1 min-h-0">
            {/* Left scrollable content */}
            <div className="flex-[2] overflow-hidden">
              <div className="h-full overflow-y-auto px-6 sm:px-8 py-6 sm:py-8 mask-edges">
                <div className="space-y-8">
                  {Object.entries(project.content).map(([key, section], i) => (
                    <motion.div 
                      key={key} 
                      className="rounded-xl p-6 transform-gpu relative"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      whileHover={{ 
                        scale: 1.02,
                        y: -2,
                        transition: { 
                          type: "spring",
                          stiffness: 500,
                          damping: 30
                        }
                      }}
                      style={{
                        transformOrigin: 'center left'
                      }}
                    >
                      <motion.div
                        className="absolute inset-0 rounded-xl"
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)',
                        }}
                        layoutId={`section-bg-${key}`}
                        transition={{
                          type: "spring",
                          bounce: 0,
                          duration: 0.4
                        }}
                      />
                      <div className="space-y-4">
                        <h3 className="font-mono text-sm uppercase tracking-wider">
                          {section.title}
                        </h3>
                        {key === 'tech' ? (
                          <div className="flex flex-wrap gap-2">
                            {section.items.map((item, i) => (
                              <TechPill key={item} text={item} index={i} />
                            ))}
                          </div>
                        ) : (
                          <ul className="space-y-3">
                            {section.items.map((item, i) => (
                              <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-start gap-3 text-sm font-mono"
                              >
                                <span className="text-[rgb(var(--accent-1))]">-</span>
                                <span className="text-slate-900">{item}</span>
                              </motion.li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Divider with glow */}
            <div className="w-px bg-[rgb(var(--accent-2))] opacity-30 my-4" style={{
              boxShadow: '0 0 20px 0 rgb(var(--accent-2) / 0.2)'
            }} />

            {/* Right media section */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto px-6 sm:px-8 py-6 sm:py-8 mask-edges">
                <div className={clsx(
                  "flex flex-col",
                  project.videos && project.videos.length > 1 ? "space-y-4" : "h-full"
                )}>
                  {project.videos ? (
                    project.videos.map((video, i) => (
                      <div key={i} className={clsx(
                        "flex-shrink-0 w-full h-full rounded-lg overflow-hidden",
                        project.videos && project.videos.length === 1 && "h-full"
                      )}>
                        <VideoPlayer src={video.src} title={video.title} />
                      </div>
                    ))
                  ) : (
                    <div className="rounded-lg overflow-hidden w-full aspect-video bg-black/20 flex items-center justify-center">
                      <p className="text-slate-400 font-mono text-sm">Demo coming soon</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add global styles for mask-edges */}
      <style jsx global>{`
        .mask-edges {
          mask-image: linear-gradient(to bottom, 
            transparent 0%,
            black 8%,
            black 92%,
            transparent 100%
          );
        }
      `}</style>
    </motion.div>
  );
}

export default function Projects() {
  const [currentProject, setCurrentProject] = useState(PROJECTS[0]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-16">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col">
          <ProjectPicker 
            currentProject={currentProject}
            onProjectChange={setCurrentProject}
          />

          <div className="relative">
            {/* Persistent glass background */}
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: '0 25px 50px -12px rgb(var(--accent-1) / 0.15)',
              }}
              layoutId="glass-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                type: "spring",
                bounce: 0,
                duration: 0.6
              }}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentProject.id}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1,
                  transition: {
                    duration: 0.4,
                    ease: [0.23, 1, 0.32, 1]
                  }
                }}
                exit={{ 
                  opacity: 0,
                  transition: {
                    duration: 0.3,
                    ease: [0.23, 1, 0.32, 1]
                  }
                }}
                className="relative"
              >
                <ProjectCard project={currentProject} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}