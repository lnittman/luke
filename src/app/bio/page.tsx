'use client';

import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { zenPalette, getZenColor } from '@/utils/colors';
import { TechPill } from '@/components/TechPill';

interface TimelineItem {
  period: string;
  role: string;
  company: string;
  description: string[];
  tech?: string[];
}

const TIMELINE: TimelineItem[] = [
  {
    period: "2024",
    role: "senior engineer",
    company: "titles, inc",
    description: [
      "architected cross-platform notification system for web3 image generation platform",
      "built semantic and file-based image search visualization system",
      "developed full-stack features across ios, web, and backend systems",
    ],
    tech: [
      // Frontend
      "next.js",
      "react",
      "typescript",
      "tailwind",
      // Mobile
      "swift",
      "ios",
      // Backend
      "firebase",
      "node.js",
      // AI
      "openai",
      "vertexai",
    ]
  },
  {
    period: "2023 - present",
    role: "making stuff",
    company: "myself",
    description: [
      "building tools that feel powerful and effortless",
      "exploring novel applications of multimodal ai in audio and web",
      "crafting intuitive digital experiences",
    ],
    tech: [
      // Frontend
      "next.js",
      "typescript",
      "tailwind",
      "motion",
      // Mobile
      "swift",
      "swiftui",
      "metal",
      "avfoundation",
      // Backend
      "python",
      "fastapi",
      "postgresql",
      "sqlmodel",
      "alembic",
      "redis",
      "websocket",
      // AI/ML
      "anthropic",
      "openai",
      "vertexai",
      "langchain",
    ]
  },
  {
    period: "2022 - 2023",
    role: "senior engineer",
    company: "stems labs",
    description: [
      "architected stem studio, an interactive music creation platform",
      "built custom ios audio engine and cloud processing pipeline",
      "integrated ai for intelligent audio effects generation",
    ],
    tech: [
      // Frontend
      "react",
      "typescript",
      "threejs",
      "webgl",
      // Mobile/Desktop
      "swift",
      "coreaudio",
      "vst3",
      // Backend
      "python",
      "fastapi",
      "postgresql",
      "redis",
      "websocket",
      // AI
      "openai",
      "langchain",
    ]
  },
  {
    period: "2019 - 2021",
    role: "sde ii",
    company: "amazon",
    description: [
      "led development of address intelligence systems",
      "built self-service tools for delivery operations",
    ],
    tech: [
      // Frontend
      "react native",
      "typescript",
      // AWS
      "aws",
      "dynamodb",
      "lambda",
      "sqs",
      "cloudformation",
      "terraform"
    ]
  },
  {
    period: "2018 - 2019",
    role: "software engineer",
    company: "aws elemental",
    description: [
      "developed features for c++ based video transcoding engine",
      "rewrote quicktime decoder for enhanced metadata parsing",
      "built automated testing framework components",
    ],
    tech: [
      // Core
      "c",
      "c++",
      "python",
      // AWS
      "aws",
      "ec2",
      "s3",
      // Tools
      "cmake",
      "gdb"
    ]
  }
];

const INTERESTS = [
  { label: "code", items: ["systems", "audio", "ai", "swift", "rust"] },
  { label: "music", items: ["production", "engineering", "synthesis"] },
  { label: "design", items: ["typography", "motion", "interaction"] },
];

function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance]);
}

function useScrollSnap() {
  const [currentSection, setCurrentSection] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([null, null, null, null]);
  const isScrolling = useRef(false);

  const setRef = (index: number) => (el: HTMLElement | null) => {
    sectionRefs.current[index] = el;
  };

  const scrollToSection = (index: number) => {
    if (isScrolling.current) return;
    if (index === currentSection) return;
    if (index < 0 || index >= sectionRefs.current.length) return;

    isScrolling.current = true;
    setCurrentSection(index);

    const targetElement = sectionRefs.current[index];
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }

    setTimeout(() => {
      isScrolling.current = false;
    }, 800);
  };

  return { sectionRefs, currentSection, scrollToSection, setRef };
}

function SectionTitle({ children }: { children: string }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.h2 
      ref={ref}
      className="text-xs sm:text-sm font-mono text-[rgb(var(--text-secondary))] mb-6 sm:mb-8"
    >
      {children}
    </motion.h2>
  );
}

function GlowingText({ text }: { text: string }) {
  return (
    <motion.span 
      className="relative inline-block group"
      whileHover={{ scale: 1.05 }}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          className="relative inline-block"
          animate={{
            textShadow: [
              `0 0 20px rgb(${getZenColor(char, i).glow} / 0.7)`,
              `0 0 35px rgb(${getZenColor(char, i).glow} / 0.9)`,
              `0 0 20px rgb(${getZenColor(char, i).glow} / 0.7)`
            ],
            y: [0, -2, 0]
          }}
          whileHover={{
            textShadow: `0 0 40px rgb(${getZenColor(char, i).glow})`,
            transition: { duration: 0.2 }
          }}
          transition={{
            textShadow: {
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 0.2
            },
            y: {
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 0.1
            }
          }}
        >
          {char}
        </motion.span>
      ))}
      <motion.span
        className="absolute inset-0 -z-10 opacity-50 group-hover:opacity-80 blur-xl transition-opacity duration-300"
        style={{
          background: zenPalette.map(color => 
            `radial-gradient(circle, rgb(${color.glow} / 0.5) 0%, transparent 70%)`
          ).join(', ')
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
    </motion.span>
  );
}

function ProjectSection({ title, items, defaultExpanded = false, isTechSection = false }: { 
  title: string; 
  items: string[];
  defaultExpanded?: boolean;
  isTechSection?: boolean;
}) {
  // ... existing ProjectSection code ...
}

function Bio() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <div className="relative" ref={containerRef}>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-[rgb(var(--accent-1))] origin-left z-50"
      />

      {/* Hero Section */}
      <motion.section 
        className="min-h-[calc(100vh-4rem)] pt-24 sm:pt-32 flex items-center justify-center relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="w-full max-w-2xl mx-auto px-4 sm:px-6">
          <motion.div 
            className="relative p-6 sm:p-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="relative z-10 space-y-6">
              <motion.div 
                className="w-24 h-24 mx-auto mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.4,
                  ease: [0.23, 1, 0.32, 1],
                  delay: 0.1
                }}
              >
                <Image
                  src="/assets/digital-craftsman.png"
                  alt="digital craftsman"
                  width={96}
                  height={96}
                  className="w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain relative z-10 select-none touch-none pointer-events-none"
                  priority
                  draggable={false}
                />
              </motion.div>
              
              <div className="space-y-4 text-center font-mono">
                <motion.p 
                  className="text-[rgb(var(--text-primary))] leading-relaxed text-sm sm:text-base mt-8 sm:mt-12 flex flex-col sm:block gap-2"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.4,
                    ease: [0.23, 1, 0.32, 1],
                    delay: 0.3
                  }}
                >
                  <span>i enjoy making, using, and talking about tools that feel</span>
                  <span><GlowingText text="powerful" /> / <GlowingText text="effortless" /></span>
                </motion.p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Philosophy Section */}
      <motion.section 
        className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-16 sm:py-24 px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="w-full max-w-2xl mx-auto space-y-8">
          <SectionTitle>philosophy</SectionTitle>
          
          <motion.div 
            className="relative p-6 sm:p-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="relative z-10 font-mono">
              <p className="text-[rgb(var(--text-primary))] leading-relaxed text-sm sm:text-base">
                i believe the best tools disappear into the creative process. they should 
                feel natural and intuitive, yet powerful enough to bring ideas to life.
              </p>
              <p className="text-[rgb(var(--text-primary))] leading-relaxed text-sm sm:text-base mt-4">
                my work spans from low-level audio systems to intuitive user interfaces,
                always seeking the balance between technical depth and human experience.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Timeline Section */}
      <motion.section 
        className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-16 sm:py-24 px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="w-full max-w-2xl mx-auto space-y-8">
          <SectionTitle>timeline</SectionTitle>
          
          {TIMELINE.map((item, i) => (
            <motion.div 
              key={item.company}
              className="relative p-8 rounded-2xl glass-effect-strong overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ 
                duration: 0.4,
                delay: i * 0.1
              }}
            >
              <div className="relative z-10 font-mono">
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-sm sm:text-lg">{item.role}</h3>
                    <div className="text-[rgb(var(--text-secondary))] text-xs sm:text-sm">@ {item.company}</div>
                  </div>
                  <span className="text-[rgb(var(--text-secondary))] text-xs sm:text-sm ml-4">{item.period}</span>
                </div>
                <ul className="space-y-2 mt-4">
                  {item.description.map((desc, i) => (
                    <li key={i} className="text-[rgb(var(--text-primary))] text-xs sm:text-sm">{desc}</li>
                  ))}
                </ul>
                {item.tech && (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-4">
                    {item.tech.map((tech, i) => (
                      <TechPill key={tech} text={tech} index={i} />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}

export default Bio;