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
      { src: 'assets/squish-demo-2.mp4', title: 'asset organization' },
      { src: 'assets/squish-demo.mp4', title: 'semantic search demo' }
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
      { src: 'assets/top.mp4', title: 'platform demo' }
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
      { src: 'assets/drib-demo.mp4', title: 'platform demo' },
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
      { src: 'assets/sine-ios.mp4', title: 'ios app demo' },
      { src: 'assets/sine-pack-utility.mp4', title: 'pack utility' }
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
      { src: 'assets/helios.mp4', title: 'app demo' }
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
    <div className="px-4">
      <motion.div 
        className="flex justify-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="relative p-2 rounded-xl glass-effect">
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
                <span className="text-[26px] relative">
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
    </div>
  );
}

function VideoPlayer({ src, title, onClose, onNext, onPrev, hasNext, hasPrev }: { 
  src: string; 
  title: string;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext && hasNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev && hasPrev) onPrev();
      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev, hasNext, hasPrev]);

  return (
    <motion.div 
      className="fixed inset-0 bg-black/90 z-[300] flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between text-white/80">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-mono">{title}</h2>
          <div className="flex items-center gap-2 text-white/60">
            {hasPrev && (
              <button
                onClick={onPrev}
                className="hover:text-white transition-colors"
              >
                ←
              </button>
            )}
            {hasNext && (
              <button
                onClick={onNext}
                className="hover:text-white transition-colors"
              >
                →
              </button>
            )}
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:text-white transition-colors font-mono"
        >
          esc
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center relative">
        {/* Video */}
        <div className="relative max-w-6xl w-full mx-4">
          <video
            ref={videoRef}
            src={src}
            className="w-full rounded-lg"
            loop
            playsInline
            onClick={togglePlay}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="p-4">
        <div className="max-w-6xl mx-auto space-y-2">
          {/* Progress bar */}
          <div 
            className="w-full h-1 rounded-full bg-white/10 cursor-pointer"
            onClick={handleSeek}
          >
            <motion.div 
              className="h-full rounded-full bg-white/30"
              style={{ width: `${(progress / duration) * 100}%` }}
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="text-white/60 hover:text-white transition-colors"
            >
              {isPlaying ? '⏸️' : '▶️'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProjectSection({ title, items, defaultExpanded = false, isTechSection = false }: { 
  title: string; 
  items: string[];
  defaultExpanded?: boolean;
  isTechSection?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  useEffect(() => {
    setMounted(true);
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 640); // Using sm breakpoint
    };
    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  useEffect(() => {
    if (mounted) {
      setIsExpanded(isDesktop || title.toLowerCase() === 'overview');
    }
  }, [mounted, isDesktop, title]);

  return (
    <div className="space-y-2">
      <button 
        onClick={() => !isDesktop && setIsExpanded(!isExpanded)}
        className={clsx(
          "w-full flex items-center justify-between text-sm sm:text-base font-mono text-[rgb(var(--text-secondary))]",
          isDesktop ? "cursor-default" : "hover:text-[rgb(var(--text-primary))] transition-colors"
        )}
      >
        <span>{title}</span>
        {!isDesktop && (
          <span className="text-xs opacity-60">{isExpanded ? '−' : '+'}</span>
        )}
      </button>
      <AnimatePresence initial={false}>
        {(isDesktop || isExpanded) && (
          <motion.div
            initial={!isDesktop ? { height: 0, opacity: 0 } : undefined}
            animate={!isDesktop ? { height: 'auto', opacity: 1 } : undefined}
            exit={!isDesktop ? { height: 0, opacity: 0 } : undefined}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {isTechSection ? (
              <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
                {items.map((item, i) => (
                  <TechPill key={item} text={item} index={i} />
                ))}
              </div>
            ) : (
              <ul className="space-y-1.5">
                {items.map((item, i) => (
                  <motion.li 
                    key={i}
                    initial={!isDesktop ? { opacity: 0, x: -10 } : undefined}
                    animate={!isDesktop ? { opacity: 1, x: 0 } : undefined}
                    transition={{ delay: i * 0.05 }}
                    className="text-xs sm:text-sm font-mono text-[rgb(var(--text-primary))]"
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProjectContent({ project, onShowDemo }: { project: Project; onShowDemo: () => void }) {
  return (
    <div className="min-h-[calc(100vh-10rem)] sm:min-h-0 flex flex-col px-4 py-4 mt-16 sm:mt-24">
      <div className="w-full max-w-4xl mx-auto space-y-6 overflow-y-auto sm:overflow-visible">
        <div className="px-4 sm:px-6 md:px-8 space-y-2">
          <h1 className="text-xl sm:text-2xl font-mono">{project.name}</h1>
          <p className="text-sm sm:text-base font-mono text-[rgb(var(--text-primary))]">
            {project.description}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-8 pt-4">
            {project.videos && project.videos.length > 0 && (
              <button 
                onClick={onShowDemo}
                className="text-xs sm:text-sm font-mono text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] transition-colors"
              >
                demo →
              </button>
            )}
            {(project.id === 'sine' || project.id === 'helios') && (
              <a 
                href={project.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm font-mono text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] transition-colors"
              >
                source →
              </a>
            )}
          </div>
        </div>

        <motion.div
          className="relative p-4 sm:p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative z-10 space-y-8">
            {/* Content Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-6">
                <ProjectSection 
                  title={project.content.overview.title} 
                  items={project.content.overview.items}
                />
                <ProjectSection 
                  title={project.content.core.title} 
                  items={project.content.core.items}
                />
              </div>
              <div className="space-y-6">
                <ProjectSection 
                  title={project.content.architecture.title} 
                  items={project.content.architecture.items}
                />
                <ProjectSection 
                  title={project.content.tech.title} 
                  items={project.content.tech.items}
                  isTechSection={true}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function Projects() {
  const [currentProject, setCurrentProject] = useState(PROJECTS[0]);
  const [currentVideo, setCurrentVideo] = useState<number | null>(null);

  const closeVideo = () => setCurrentVideo(null);
  const showDemo = () => setCurrentVideo(0);
  
  const nextVideo = () => {
    if (currentVideo === null || !currentProject.videos) return;
    if (currentVideo < currentProject.videos.length - 1) {
      setCurrentVideo(currentVideo + 1);
    }
  };

  const prevVideo = () => {
    if (currentVideo === null || !currentProject.videos) return;
    if (currentVideo > 0) {
      setCurrentVideo(currentVideo - 1);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col sm:justify-center">
      {/* Sticky Project Picker */}
      <div className="sticky top-[4.5rem] z-50 py-2 sm:absolute sm:top-[64px] sm:left-0 sm:right-0 bg-[rgb(var(--background))]">
        <ProjectPicker 
          currentProject={currentProject}
          onProjectChange={(project) => {
            setCurrentProject(project);
            setCurrentVideo(null);
          }}
        />
      </div>

      {/* Project Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentProject.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="pt-8 sm:pt-0"
        >
          <ProjectContent 
            project={currentProject} 
            onShowDemo={showDemo}
          />
        </motion.div>
      </AnimatePresence>

      {/* Full screen video player */}
      <AnimatePresence>
        {currentVideo !== null && currentProject.videos && (
          <VideoPlayer
            src={currentProject.videos[currentVideo].src}
            title={currentProject.videos[currentVideo].title}
            onClose={closeVideo}
            onNext={nextVideo}
            onPrev={prevVideo}
            hasNext={currentVideo < currentProject.videos.length - 1}
            hasPrev={currentVideo > 0}
          />
        )}
      </AnimatePresence>
    </div>
  );
}