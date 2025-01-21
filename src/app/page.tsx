'use client';

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useState, useMemo } from 'react';
import Image from 'next/image';

// Enhanced sparkle system
const SPARKLE_VARIANTS = {
  dot: 'M0,2.5 a2.5,2.5 0 1,0 5,0 a2.5,2.5 0 1,0 -5,0',
  star: 'M2.5 0L3.5 1.8L5 2L3.8 3.3L4 5L2.5 4.2L1 5L1.2 3.3L0 2L1.5 1.8L2.5 0Z',
  diamond: 'M2.5 0L5 2.5L2.5 5L0 2.5L2.5 0Z',
  cross: 'M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2v-2z',
} as const;

type SparkleVariant = keyof typeof SPARKLE_VARIANTS;

interface SparkleProps {
  delay?: number;
  size?: number;
  position?: { x: number; y: number };
  intensity?: number;
  pathVariant?: SparkleVariant;
}

interface SparkleFieldProps {
  count?: number;
  container?: HTMLDivElement | null;
  intensity?: number;
}

function EnhancedSparkle({ 
  delay = 0, 
  size = 1, 
  position = { x: 0, y: 0 }, 
  intensity = 1,
  pathVariant = 'dot'
}: SparkleProps) {
  const sparkleVariants = {
    initial: { 
      opacity: 0, 
      scale: 0,
      rotate: 0,
    },
    animate: {
      opacity: [0, intensity, 0],
      scale: [0, size, 0],
      rotate: [0, 180, 360],
      x: [position.x - 20, position.x, position.x + 20],
      y: [position.y - 20, position.y, position.y + 20],
    }
  };

  return (
    <motion.div
      className="absolute w-2 h-2 pointer-events-none"
      style={{ left: position.x, top: position.y }}
      variants={sparkleVariants}
      initial="initial"
      animate="animate"
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        repeatType: 'loop',
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 5 5">
        <path
          d={SPARKLE_VARIANTS[pathVariant]}
          fill="rgb(var(--accent-1))"
          style={{ 
            mixBlendMode: 'screen',
            filter: `blur(${0.5 * intensity}px) brightness(${1 + intensity})`,
          }}
        />
      </svg>
    </motion.div>
  );
}

function SparkleField({ count = 10, container, intensity = 1 }: SparkleFieldProps) {
  const [sparkles, setSparkles] = useState<Array<{
    id: number;
    variant: SparkleVariant;
    position: { x: number; y: number };
    size: number;
  }>>([]);

  useEffect(() => {
    // Generate sparkles on the client side only
    const newSparkles = Array.from({ length: count }, (_, i) => ({
      id: i,
      variant: ['dot', 'star', 'diamond', 'cross'][Math.floor(Math.random() * 4)] as SparkleVariant,
      position: {
        x: Math.random() * (container?.getBoundingClientRect()?.width || 400),
        y: Math.random() * (container?.getBoundingClientRect()?.height || 400),
      },
      size: 0.8 + Math.random() * 0.4,
    }));
    setSparkles(newSparkles);
  }, [count, container]);

  return (
    <>
      {sparkles.map((sparkle) => (
        <EnhancedSparkle
          key={sparkle.id}
          delay={sparkle.id * 0.2}
          size={sparkle.size}
          position={sparkle.position}
          intensity={intensity}
          pathVariant={sparkle.variant}
        />
      ))}
    </>
  );
}

function Hero() {
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
    <div ref={containerRef} className="relative w-full min-h-screen flex items-center justify-center px-4 py-8 sm:p-0">
      {/* Main card */}
      <motion.div
        className="glass-effect-strong relative rounded-2xl p-6 sm:p-12 w-full max-w-2xl mx-auto overflow-hidden"
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

          {/* Personal narrative */}
          <div className="relative z-10 w-full space-y-4 sm:space-y-6 font-mono text-sm">
            {['essence', 'craft', 'resonance', 'manifesto'].map((section, i) => (
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
                <span className="text-[rgb(var(--text-secondary))] text-xs">{section}</span>
                {/* Section content based on type */}
                {section === 'essence' && (
                  <span className="text-[rgb(var(--text-primary))] leading-relaxed">
                    digital craftsman • product poet • interface alchemist
                  </span>
                )}
                {section === 'craft' && (
                  <span className="text-[rgb(var(--text-primary))] leading-relaxed">
                    weaving digital experiences through code, design, and intuition
                  </span>
                )}
                {section === 'resonance' && (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {['product', 'engineering', 'design', 'ai', 'web3'].map((tag, i) => {
                      const randomRotation = (Math.random() * 6 - 3) * (Math.random() > 0.5 ? 1 : -1);
                      
                      return (
                        <motion.span 
                          key={tag}
                          className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs glass-effect-strong cursor-pointer select-none"
                          style={{
                            color: `rgb(var(--accent-${i % 2 + 1}))`,
                            background: `rgb(var(--surface-1) / 0.3)`,
                          }}
                          whileHover={{ 
                            rotate: randomRotation,
                            background: `rgb(var(--surface-1) / 0.4)`,
                            scale: 1.1,
                            transition: { 
                              type: "spring",
                              stiffness: 500,
                              damping: 15,
                              restDelta: 0.001
                            }
                          }}
                          whileTap={{ 
                            scale: 0.95,
                            transition: { duration: 0.1 }
                          }}
                        >
                          {tag}
                        </motion.span>
                      );
                    })}
                  </div>
                )}
                {section === 'manifesto' && (
                  <span className="text-[rgb(var(--text-primary))] leading-relaxed italic">
                    "building beautiful experiences is not just about code—it's about crafting moments of digital magic that resonate with the human spirit."
                  </span>
                )}
              </motion.div>
            ))}
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