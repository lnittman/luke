'use client';

import { motion } from 'framer-motion';
import {  useEffect, useState, useMemo } from 'react';
import Image from 'next/image';

import { TechPill } from '@/components/TechPill';

function Hero() {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center px-4 py-8 sm:p-0">
      {/* Main card */}
      <motion.div
        className="relative rounded-2xl p-6 sm:p-12 w-full max-w-2xl mx-auto overflow-hidden"
        style={{
          transformStyle: 'preserve-3d',
          transformPerspective: '1200px',
        }}
      >
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-8">
          {/* Logo section */}
          <motion.div
            className="relative mb-6 sm:mb-8 cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{ transform: 'translateZ(40px)' }}
            whileHover={{ 
              scale: 1.05,
              transition: { 
                type: "spring",
                stiffness: 500,
                damping: 15,
                restDelta: 0.001
              }
            }}
          >
            <motion.div 
              className="absolute inset-0 rounded-2xl"
              whileHover={{
                opacity: 0.8,
                transition: { duration: 0.15 }
              }}
            />
            <Image 
              src="/assets/logo.png"
              alt="Luke Nittmann"
              className="w-32 h-32 sm:w-40 sm:h-40 object-contain relative z-10"
              width={160}
              height={160}
              priority
            />
          </motion.div>

          {/* Title under logo */}
          <motion.div
            className="text-[rgb(var(--text-primary))] text-base sm:text-lg text-center mb-8 font-mono whitespace-nowrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            digital craftsman • product poet • digital alchemist
          </motion.div>

          {/* Personal narrative */}
          <div className="relative z-10 w-full space-y-4 sm:space-y-6 font-mono text-sm">
            {['essence', 'craft', 'resonance'].map((section, i) => (
              <motion.div 
                key={section}
                className="flex flex-col gap-2 px-4 sm:px-6 py-3 sm:py-4 rounded-lg glass-effect cursor-pointer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                whileHover={{ 
                  scale: 1.02,
                  y: -2,
                  transition: { 
                    type: "spring",
                    stiffness: 500,
                    damping: 15,
                    restDelta: 0.001
                  }
                }}
              >
                <span className="text-black text-lg">{section}</span>
                {/* Section content based on type */}
                {section === 'essence' && (
                  <span className="text-[rgb(var(--text-primary))] leading-relaxed">
                    crafting digital experiences through code and intuition 
                  </span>
                )}
                {section === 'craft' && (
                  <span className="text-[rgb(var(--text-primary))] leading-relaxed">
                    making tools feel like magic, interfaces like poetry
                  </span>
                )}
                {section === 'resonance' && (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {['product', 'engineering', 'design', 'ai', 'audio', 'web3', 'vim'].map((tag, i) => (
                      <TechPill key={tag} text={tag} index={i} />
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
            
            {/* Standalone quote */}
            <motion.div
              className="text-[rgb(var(--text-primary))] leading-relaxed italic text-center px-4 pt-4 sm:pt-6 flex flex-col items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <span className="whitespace-nowrap">"now his dream was a dream of shadows gathering like storm clouds"</span>
              <span className="text-[rgb(var(--text-secondary))] text-sm not-italic">— roberto bolaño, 2666</span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Home() {
  const [mousePosition, setMousePosition] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition([e.clientX, e.clientY]);
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  const background = useMemo(() => {
    const [mouseX, mouseY] = mousePosition;
    const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
    const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;
    
    return {
      background: `
        radial-gradient(
          600px circle at ${mouseX + centerX}px ${mouseY + centerY}px,
          rgb(var(--accent-1) / 0.15),
          transparent 40%
        )
      `
    };
  }, [mousePosition]);

  return (
    <div className="relative min-h-screen">
      <Hero />
    </div>
  );
}