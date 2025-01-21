'use client';

import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

interface TimelineItem {
  period: string;
  role: string;
  company: string;
  description: string[];
  tech?: string[];
}

const TIMELINE: TimelineItem[] = [
  {
    period: "2023 - present",
    role: "founder",
    company: "sine labs",
    description: [
      "building tools for music creation that abstract away complexity",
      "exploring the intersection of ai and audio production",
    ],
    tech: ["swift", "python", "fastapi", "postgres", "gcp"]
  },
  {
    period: "2022 - present",
    role: "senior engineer",
    company: "stems labs",
    description: [
      "architected stem studio, an interactive music creation platform",
      "built custom ios audio engine and cloud processing pipeline",
      "integrated ai for intelligent audio effects generation",
    ],
    tech: ["swift", "react", "python", "fastapi", "openai", "vst3"]
  },
  {
    period: "2019 - 2020",
    role: "sde ii",
    company: "amazon",
    description: [
      "led development of address intelligence systems",
      "built self-service tools for delivery operations",
    ],
    tech: ["typescript", "react native", "aws"]
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
  const { scrollYProgress } = useScroll({ target: ref });
  const y = useParallax(scrollYProgress, 50);

  return (
    <motion.h2 
      ref={ref}
      style={{ y }}
      className="text-sm font-mono text-[rgb(var(--text-secondary))] mb-8"
    >
      {children}
    </motion.h2>
  );
}

function Bio() {
  const { sectionRefs, currentSection, scrollToSection, setRef } = useScrollSnap();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const heroOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(smoothProgress, [0, 0.2], [1, 0.8]);
  const heroY = useTransform(smoothProgress, [0, 0.2], [0, -50]);

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="relative" ref={containerRef}>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-[rgb(var(--accent-1))] origin-left z-50"
        style={{ scaleX }}
      />

      {/* Fixed Background Glass Effect */}
      <div className="fixed inset-0 backdrop-blur-xl bg-black/20 z-0" />

      {/* Hero Section */}
      <section 
        ref={setRef(0)}
        className="min-h-screen flex items-center justify-center relative z-10"
      >
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="w-full max-w-2xl mx-auto px-6"
        >
          <motion.div 
            className="relative p-8 rounded-2xl bg-black/40 border border-white/10 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
          >
            <div className="absolute inset-0 backdrop-blur-xl" />
            <div className="relative z-10 space-y-6">
              <motion.div 
                className="w-24 h-24 mx-auto mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <Image
                  src="/assets/motorcycle.png"
                  alt="Motorcycle emoji"
                  width={96}
                  height={96}
                  className="w-full h-full object-contain"
                />
              </motion.div>
              
              <div className="space-y-4 text-center">
                <p className="text-base font-mono text-[rgb(var(--text-secondary))]">
                  digital craftsman
                </p>
                <p className="text-lg leading-relaxed">
                  building tools at the intersection of music, code, and design. focused on 
                  creating experiences that feel both powerful and effortless.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Content Sections */}
      <div className="relative z-10">
        {/* Philosophy */}
        <section 
          ref={setRef(1)}
          className="min-h-screen flex items-center justify-center py-24 px-4"
        >
          <div className="w-full max-w-4xl">
            <SectionTitle>philosophy</SectionTitle>
            <motion.div 
              className="relative p-8 rounded-2xl bg-black/40 border border-white/10 overflow-hidden"
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                duration: 0.8,
                type: "spring",
                bounce: 0.2
              }}
            >
              <div className="absolute inset-0 backdrop-blur-xl" />
              <div className="relative z-10">
                <p className="text-lg leading-relaxed">
                  i believe the best tools disappear into the creative process. they should 
                  feel natural and intuitive, yet powerful enough to bring ideas to life.
                </p>
                <p className="text-lg leading-relaxed">
                  my work spans from low-level audio systems to intuitive user interfaces,
                  always seeking the balance between technical depth and human experience.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Timeline */}
        <section 
          ref={setRef(2)}
          className="min-h-screen flex items-center justify-center py-24 px-4"
        >
          <div className="w-full max-w-4xl">
            <SectionTitle>timeline</SectionTitle>
            <div className="space-y-6">
              {TIMELINE.map((item, i) => (
                <motion.div 
                  key={item.company}
                  className="relative p-8 rounded-2xl bg-black/40 border border-white/10 overflow-hidden"
                  initial={{ opacity: 0, x: -100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ 
                    duration: 0.5,
                    delay: i * 0.1,
                    type: "spring",
                    bounce: 0.2
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className="absolute inset-0 backdrop-blur-xl" />
                  <div className="relative z-10">
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-lg">{item.role} @ {item.company}</h3>
                      <span className="text-sm text-[rgb(var(--text-secondary))]">{item.period}</span>
                    </div>
                    <ul className="space-y-2 text-[rgb(var(--text-secondary))]">
                      {item.description.map((desc, i) => (
                        <li key={i} className="text-sm">{desc}</li>
                      ))}
                    </ul>
                    {item.tech && (
                      <div className="flex flex-wrap gap-2">
                        {item.tech.map(tech => (
                          <span 
                            key={tech}
                            className="px-2 py-1 text-xs rounded-full glass-effect-strong"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Interests */}
        <section 
          ref={setRef(3)}
          className="min-h-screen flex items-center justify-center py-24 px-4"
        >
          <div className="w-full max-w-4xl">
            <SectionTitle>interests</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {INTERESTS.map((category, i) => (
                <motion.div 
                  key={category.label}
                  className="relative p-8 rounded-2xl bg-black/40 border border-white/10 overflow-hidden"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ 
                    duration: 0.5,
                    delay: i * 0.1,
                    type: "spring",
                    bounce: 0.2
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    rotateX: 5,
                    rotateY: 5,
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className="absolute inset-0 backdrop-blur-xl" />
                  <div className="relative z-10">
                    <h3 className="text-sm font-mono text-[rgb(var(--text-secondary))]">
                      {category.label}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {category.items.map(item => (
                        <span 
                          key={item}
                          className="px-2 py-1 text-xs rounded-full glass-effect-strong"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Bio;