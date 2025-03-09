'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { getZenColor } from '@/utils/colors';

function GlowingText({ text }: { text: string }) {
  return (
    <motion.span 
      className="whitespace-pre relative inline-block group"
      whileHover={{ scale: 1.00 }}
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
              repeatType: "reverse"
            },
            y: {
              duration: Math.random() * 2 + 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}

function Bio() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Hero Section */}
      <motion.section 
        className="min-h-screen flex items-center justify-center relative z-10"
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
                  className="w-40 h-40 object-contain relative z-10 select-none touch-none pointer-events-none pb-8"
                  priority
                  draggable={false}
                />
              </motion.div>
              
              <div className="space-y-4 text-center ">
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
                  <GlowingText text="nice person" />
                </motion.p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* 
      // Philosophy Section and other sections are commented out as requested
      */}
    </main>
  );
}

export default function BioPage() {
  return <Bio />;
}