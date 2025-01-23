'use client';

import { motion } from 'framer-motion';
import {  useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { TechPill } from '@/components/TechPill';
import { getZenColor } from '@/utils/colors';

function Hero() {
  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] pt-20 sm:pt-0 flex items-center justify-center px-4 py-8 sm:p-0">
      {/* Main card */}
      <motion.div
        className="relative rounded-2xl p-4 sm:p-6 md:p-12 w-full max-w-2xl mx-auto overflow-hidden"
        style={{
          transformStyle: 'preserve-3d',
          transformPerspective: '1200px',
        }}
      >
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-6 sm:gap-8">
          {/* Logo section */}
          <motion.div
            className="relative mb-4 sm:mb-6 cursor-pointer"
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
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain relative z-10"
              width={160}
              height={160}
              priority
            />
          </motion.div>

          {/* Title under logo 
          <motion.div
            className="text-[rgb(var(--text-primary))] text-sm sm:text-base md:text-lg text-center mb-4 sm:mb-8 font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="whitespace-normal sm:whitespace-nowrap">
              craftsman • product poet • digital alchemist
            </span>
          </motion.div>
          */}

          {/* Personal narrative */}
          <div className="relative z-10 w-full space-y-3 sm:space-y-4 md:space-y-6 font-mono text-xs sm:text-sm">
            {['essence', 'craft', 'resonance'].map((section, i) => (
              <motion.div 
                key={section}
                className="flex flex-col gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <motion.span 
                  className="text-base sm:text-lg font-mono tracking-tight relative"
                  style={{
                    color: `rgb(${getZenColor(section, i).text})`,
                    textShadow: `0 0 15px rgb(${getZenColor(section, i).glow} / 0.4),
                                0 0 30px rgb(${getZenColor(section, i).glow} / 0.3)`,
                    letterSpacing: '-0.02em'
                  }}
                >
                  {section.split('').map((char, charIndex) => (
                    <motion.span
                      key={charIndex}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        transition: {
                          delay: 0.3 + i * 0.1 + charIndex * 0.05,
                          duration: 0.3,
                          ease: [0.23, 1, 0.32, 1]
                        }
                      }}
                      whileHover={{
                        y: -1,
                        transition: {
                          duration: 0.1,
                          ease: "easeInOut"
                        }
                      }}
                    >
                      {char}
                    </motion.span>
                  ))}
                  <motion.div
                    className="absolute inset-0 -z-10 rounded-lg opacity-50"
                    style={{
                      background: `radial-gradient(circle at center, rgb(${getZenColor(section, i).glow} / 0.15), transparent 70%)`
                    }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ 
                      scale: 1.2, 
                      opacity: 0.5,
                      transition: {
                        delay: 0.3 + i * 0.1,
                        duration: 0.4,
                        ease: [0.23, 1, 0.32, 1]
                      }
                    }}
                  />
                </motion.span>
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
                  <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2">
                    {['product', 'engineering', 'design', 'ai', 'audio', 'web3', 'vim'].map((tag, i) => (
                      <TechPill key={tag} text={tag} index={i} />
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
            
            {/* Standalone quote */}
            <motion.div
              className="text-[rgb(var(--text-primary))] leading-relaxed italic text-center px-3 sm:px-4 pt-3 sm:pt-4 md:pt-6 flex flex-col items-center gap-1.5 sm:gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <span className="text-xs sm:text-sm whitespace-normal sm:whitespace-nowrap">
                "now his dream was a dream of shadows gathering like storm clouds"
              </span>
              <span className="text-[rgb(var(--text-secondary))] text-[0.65rem] sm:text-xs not-italic">
                — roberto bolaño, 2666
              </span>
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