'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {  useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { TechPill } from '@/components/TechPill';
import { getZenColor } from '@/utils/colors';
import { defaultQuote, techQuotes } from '@/utils/quotes';
import Balancer from 'react-wrap-balancer';

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
    <div className="relative w-full h-[100dvh] flex items-center justify-center px-4 py-4 sm:p-0 overflow-hidden">
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
            className="relative mb-2 sm:mb-4 md:mb-6 cursor-pointer w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28"
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
              width={112}
              height={112}
              className="w-full h-full object-contain relative z-10 select-none touch-none pointer-events-none"
              priority
              draggable={false}
              quality={95}
            />
          </motion.div>

          {/* Personal narrative */}
          <div className="relative z-10 w-full flex flex-col gap-1.5 landscape:gap-2 sm:gap-3 md:gap-4 font-mono text-[10px] landscape:text-[9px] sm:text-sm">
            {['essence', 'craft', 'resonance'].map((section, i) => (
              <motion.div 
                key={section}
                className="flex flex-col gap-0.5 landscape:gap-1 sm:gap-2 px-2 sm:px-4 md:px-6 py-1 landscape:py-1 sm:py-2 md:py-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <motion.span 
                  className="text-base landscape:text-sm sm:text-xl md:text-2xl lg:text-3xl font-mono tracking-tight relative"
                  style={{
                    color: `rgb(${getZenColor(section, i).text})`,
                    textShadow: `0 0 15px rgb(${getZenColor(section, i).glow} / 0.4),
                                0 0 30px rgb(${getZenColor(section, i).glow} / 0.3)`,
                    letterSpacing: '-0.02em'
                  }}
                >
                  {section}
                </motion.span>
                {/* Section content based on type */}
                {section === 'essence' && (
                  <span className="text-[rgb(var(--text-primary))] leading-relaxed text-sm landscape:text-xs sm:text-lg md:text-xl lg:text-2xl">
                    building thoughtful digital experiences
                  </span>
                )}
                {section === 'craft' && (
                  <span className="text-[rgb(var(--text-primary))] leading-relaxed text-sm landscape:text-xs sm:text-lg md:text-xl lg:text-2xl">
                    creating intuitive tools and elegant interfaces
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
              className="relative h-[160px] sm:h-[180px] md:h-[200px] w-full"
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
                  className="absolute inset-0 flex flex-col items-center justify-center px-2 sm:px-4 md:px-6 py-4 landscape:py-3 sm:py-6"
                >
                  <div className="flex flex-col items-center gap-1.5 landscape:gap-1 sm:gap-2 w-full max-w-lg">
                    <Balancer className="text-sm landscape:text-xs sm:text-base md:text-lg lg:text-xl text-center leading-[1.6] landscape:leading-[1.5] sm:leading-[1.7] italic text-[rgb(var(--text-primary))]">
                      "{currentQuote.text}"
                    </Balancer>
                    <Balancer className="text-[rgb(var(--text-secondary))] text-xs landscape:text-[10px] sm:text-sm md:text-base lg:text-lg not-italic text-center leading-[1.4] landscape:leading-[1.3] sm:leading-[1.5]">
                      — {currentQuote.author}{currentQuote.year ? ` (${currentQuote.year})` : ''}{currentQuote.source ? ` • ${currentQuote.source}` : ''}
                    </Balancer>
                  </div>
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

  return (
    <div className="relative min-h-screen">
      <Hero />
    </div>
  );
}