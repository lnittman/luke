'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {  useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { TechPill } from '@/components/TechPill';
import { getZenColor } from '@/utils/colors';
import { defaultQuote, techQuotes } from '@/utils/quotes';

function Hero() {
  const [currentQuote, setCurrentQuote] = useState(defaultQuote);
  const [isQuoteChanging, setIsQuoteChanging] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [autoRotatePaused, setAutoRotatePaused] = useState(false);
  const [rotationOrder, setRotationOrder] = useState<string[]>([]);

  const resonanceItems = ['books', 'product', 'engineering', 'design', 'ux', 'ai', 'audio', 'vim'];

  // Initialize with a random resonance item and rotation order
  useEffect(() => {
    // Shuffle the resonance items for rotation order
    const shuffled = [...resonanceItems]
      .sort(() => Math.random() - 0.5);
    setRotationOrder(shuffled);
    
    // Set initial active item
    const randomItem = shuffled[0];
    setActiveItem(randomItem);
    handleItemChange(randomItem);
  }, []);

  // Auto-rotate through items
  useEffect(() => {
    if (autoRotatePaused || !activeItem || rotationOrder.length === 0) return;
    
    const interval = setInterval(() => {
      const currentIndex = rotationOrder.indexOf(activeItem);
      const nextIndex = (currentIndex + 1) % rotationOrder.length;
      const nextItem = rotationOrder[nextIndex];
      setActiveItem(nextItem);
      handleItemChange(nextItem);
    }, 8000);

    return () => clearInterval(interval);
  }, [activeItem, autoRotatePaused, rotationOrder]);

  const handleItemChange = (item: string) => {
    if (!techQuotes[item]) return;
    
    setIsQuoteChanging(true);
    setTimeout(() => {
      const quotes = techQuotes[item];
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setCurrentQuote(randomQuote);
      setIsQuoteChanging(false);
    }, 300);
  };

  const handleTechClick = (item: string) => {
    setAutoRotatePaused(true);
    setActiveItem(item);
    handleItemChange(item);
  };

  return (
    <div className="relative w-full h-[100dvh] flex items-center justify-center px-4 py-4 sm:p-0">
      {/* Main card */}
      <motion.div
        className="relative rounded-2xl p-3 sm:p-4 md:p-8 w-full max-w-2xl mx-auto overflow-hidden"
        style={{
          transformStyle: 'preserve-3d',
          transformPerspective: '1200px',
        }}
      >
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-3 sm:gap-6 md:gap-8">
          {/* Logo section */}
          <motion.div
            className="relative mb-2 sm:mb-4 md:mb-6 cursor-pointer"
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.8,
              ease: [0.23, 1, 0.32, 1]
            }}
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
            whileTap={{
              scale: 0.95,
              rotate: -8,
              x: 10,
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 8,
                mass: 0.8
              }
            }}
          >
            <Image
              src="/assets/logo.png"
              alt="logo"
              width={96}
              height={96}
              className="w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain relative z-10 select-none touch-none pointer-events-none"
              priority
              draggable={false}
            />
          </motion.div>

          {/* Personal narrative */}
          <div className="relative z-10 w-full space-y-1.5 landscape:space-y-2 sm:space-y-3 md:space-y-4 font-mono text-[10px] landscape:text-[9px] sm:text-sm">
            {['essence', 'craft', 'resonance'].map((section, i) => (
              <motion.div 
                key={section}
                className="flex flex-col gap-0.5 landscape:gap-1 sm:gap-2 px-2 sm:px-4 md:px-6 py-1 landscape:py-1 sm:py-2 md:py-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <motion.span 
                  className="text-sm landscape:text-xs sm:text-lg font-mono tracking-tight relative"
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
                      className="inline-block"
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
                        y: -2,
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
                  <span className="text-[rgb(var(--text-primary))] leading-relaxed landscape:text-[9px]">
                    crafting digital experiences through code and intuition 
                  </span>
                )}
                {section === 'craft' && (
                  <span className="text-[rgb(var(--text-primary))] leading-relaxed landscape:text-[9px]">
                    making tools feel like magic, interfaces like poetry
                  </span>
                )}
                {section === 'resonance' && (
                  <div className="flex flex-wrap gap-1 landscape:gap-0.5 sm:gap-1.5 md:gap-2">
                    {resonanceItems.map((tag, i) => (
                      <TechPill 
                        key={tag} 
                        text={tag} 
                        index={i} 
                        onClick={() => handleTechClick(tag)}
                        isActive={tag === activeItem}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
            
            {/* Standalone quote */}
            <motion.div
              className="text-[rgb(var(--text-primary))] leading-relaxed italic px-2 sm:px-4 md:px-6 pt-1 landscape:pt-1.5 sm:pt-4 flex flex-col items-center gap-0.5 landscape:gap-1 sm:gap-2 min-h-[5rem] landscape:min-h-[4.5rem] sm:min-h-[6rem]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuote.text}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col items-center gap-1.5 landscape:gap-1 sm:gap-2 w-full max-w-lg"
                >
                  <span className="text-[9px] landscape:text-[8px] sm:text-xs whitespace-pre-line text-center">
                    "{currentQuote.text}"
                  </span>
                  <span className="text-[rgb(var(--text-secondary))] text-[8px] landscape:text-[7px] sm:text-xs not-italic text-center">
                    — {currentQuote.author}{currentQuote.year ? ` (${currentQuote.year})` : ''}{currentQuote.source ? `,\n${currentQuote.source}` : ''}
                  </span>
                </motion.div>
              </AnimatePresence>
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