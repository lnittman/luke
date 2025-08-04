'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { LenisProvider } from '@/components/providers/LenisProvider';
import FluidCanvas from '@/components/interactive/FluidCanvas';
import { TextScramble } from '@/components/motion/TextScramble';
import { BlockLoader } from '@/components/motion/BlockLoader';

const ASCII_ART = `
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║     ██╗     ███████╗███╗   ██╗██╗███████╗                      ║
║     ██║     ██╔════╝████╗  ██║██║██╔════╝                      ║
║     ██║     █████╗  ██╔██╗ ██║██║███████╗                      ║
║     ██║     ██╔══╝  ██║╚██╗██║██║╚════██║                      ║
║     ███████╗███████╗██║ ╚████║██║███████║                      ║
║     ╚══════╝╚══════╝╚═╝  ╚═══╝╚═╝╚══════╝                      ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
`;

const SECTIONS = [
  {
    title: 'BAUHAUS MEETS CODE',
    content: 'Where minimalism intersects with complexity. Every line serves a purpose, every animation tells a story.',
    blocks: ['◰', '◳', '◲', '◱'],
  },
  {
    title: 'UTILITARIAN DESIGN',
    content: 'Function follows form follows function. The eternal dance of creation and constraint.',
    blocks: ['▖', '▘', '▝', '▗'],
  },
  {
    title: 'AI-NATIVE INTERFACES',
    content: 'Building the bridge between human intuition and machine intelligence. One pixel at a time.',
    blocks: ['⣾', '⣽', '⣻', '⢿'],
  },
  {
    title: 'SMOOTH AS SILK',
    content: 'Lenis brings buttery smooth scrolling. WebGL paints fluid dreams. Together, they dance.',
    blocks: ['◐', '◓', '◑', '◒'],
  },
];

function ScrollSection({ 
  section, 
  index 
}: { 
  section: typeof SECTIONS[0]; 
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['20%', '-20%']);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  return (
    <motion.section
      ref={ref}
      className="min-h-screen flex items-center justify-center px-6 py-20"
      style={{ opacity }}
    >
      <motion.div
        className="layout-section max-w-4xl w-full"
        style={{ y, scale }}
      >
        <div className="brutalist-section p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
            {section.blocks.map((block, i) => (
              <BlockLoader key={i} mode={index * 2 + i} />
            ))}
          </div>
          
          <h2 className="text-4xl md:text-6xl font-mono mb-6">
            <TextScramble text={section.title} />
          </h2>
          
          <p className="text-lg md:text-xl font-mono text-[rgb(var(--text-secondary))] leading-relaxed">
            {section.content}
          </p>
        </div>
      </motion.div>
    </motion.section>
  );
}

function ASCIISection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const chars = ASCII_ART.split('');
  
  return (
    <motion.section
      ref={ref}
      className="min-h-screen flex items-center justify-center px-6 py-20"
    >
      <pre className="font-mono text-xs sm:text-sm md:text-base text-[rgb(var(--accent-1))]">
        {chars.map((char, i) => {
          const progress = i / chars.length;
          const charDelay = progress * 0.5;
          
          return (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: charDelay, duration: 0.1 }}
              viewport={{ once: true }}
            >
              {char}
            </motion.span>
          );
        })}
      </pre>
    </motion.section>
  );
}

function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -500]);
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);

  return (
    <motion.section 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ opacity }}
    >
      <motion.div 
        className="relative z-10 text-center px-6"
        style={{ y }}
      >
        <h1 className="text-6xl md:text-8xl font-mono mb-8">
          <TextScramble text="LENIS × BAUHAUS" />
        </h1>
        
        <div className="flex items-center justify-center gap-4 mb-8">
          {[0, 1, 2, 3].map((i) => (
            <BlockLoader key={i} mode={i} className="text-2xl" />
          ))}
        </div>
        
        <p className="text-xl md:text-2xl font-mono text-[rgb(var(--text-secondary))]">
          Smooth scrolling meets brutalist design
        </p>
        
        <motion.div
          className="mt-12"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="font-mono text-sm">↓ SCROLL TO EXPLORE ↓</span>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

function Footer() {
  return (
    <footer className="min-h-[50vh] flex items-center justify-center brutalist-section">
      <div className="text-center">
        <h3 className="text-3xl font-mono mb-4">
          <TextScramble text="END OF TRANSMISSION" />
        </h3>
        <div className="flex items-center justify-center gap-2">
          {[8, 9, 10].map((i) => (
            <BlockLoader key={i} mode={i} />
          ))}
        </div>
      </div>
    </footer>
  );
}

export default function ScrollPage() {
  return (
    <LenisProvider>
      <div className="relative min-h-screen bg-gradient-custom">
        {/* WebGL Fluid Background */}
        <div className="fixed inset-0 z-0">
          <FluidCanvas />
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          <Hero />
          <ASCIISection />
          
          {SECTIONS.map((section, index) => (
            <ScrollSection key={index} section={section} index={index} />
          ))}
          
          <Footer />
        </div>
      </div>
    </LenisProvider>
  );
}