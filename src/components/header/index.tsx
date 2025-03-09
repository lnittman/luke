'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

interface ContactInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
}

const CONTACT_INFO: ContactInfo = {
  name: "luke nittmann",
  phone: "(313) 500-1244",
  email: "luke.nittmann@gmail.com",
  address: "3038 Isabel Dr, Los Angeles 90065",
};

export function Header() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [colonVisible, setColonVisible] = useState(true);
  
  const pathname = usePathname();
  const pageName = pathname === '/' ? 'home' : pathname.slice(1);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const blinkTimer = setInterval(() => {
      setColonVisible(prev => !prev);
    }, 1000);

    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      clearInterval(timer);
      clearInterval(blinkTimer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const period = hours >= 12 ? 'pm' : 'am';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).toLowerCase();

  // Get emoji based on time of day
  const getTimeEmoji = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return '🌅'; // Morning
    if (hour >= 12 && hour < 18) return '☀️'; // Afternoon
    if (hour >= 18 && hour < 22) return '🌆'; // Evening
    return '🌙'; // Night
  };

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-[200] px-4 sm:px-6 py-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        ref={headerRef}
        className="max-w-3xl mx-auto glass-effect-strong rounded-lg relative overflow-hidden"
        layout="preserve-aspect"
        layoutRoot
        style={{ zIndex: isExpanded ? 200 : 50 }}
      >
        <motion.div 
          className="flex items-center justify-between px-4 sm:px-6 h-[52px] sm:h-14 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
          layout="position"
        >
          {/* Name and Page Indicator */}
          <motion.div 
            className="text-base sm:text-lg font-medium text-[rgb(var(--text-primary))]"
            layout="position"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            variants={{
              glow: { 
                filter: "drop-shadow(0 0 8px rgb(var(--accent-1)/0.6))",
                transition: { duration: 0.3 }
              },
              noGlow: { 
                filter: "drop-shadow(0 0 0px transparent)",
                transition: { duration: 0.3 }
              }
            }}
            animate={isExpanded || isHovered ? "glow" : "noGlow"}
          >
            <span className="font-mono">{CONTACT_INFO.name}</span>
            <span className="hidden sm:inline opacity-50 ml-2 font-mono">//</span>
            <motion.span
              key={pageName}
              className="hidden sm:inline-block ml-2 font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {pageName}
            </motion.span>
          </motion.div>

          {/* Time Indicator */}
          <motion.div 
            className="flex items-center gap-2"
            layout="position"
          >
            <span className="hidden sm:inline text-xs font-mono text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] transition-colors">
              local time - {displayHours}
              <span style={{ opacity: colonVisible ? 1 : 0, transition: 'opacity 0.1s' }}>:</span>
              {displayMinutes} {period}
            </span>
            <div className="w-[36px] sm:w-[44px] h-[36px] sm:h-[44px] flex items-center justify-center">
              {getTimeEmoji()}
            </div>
          </motion.div>
        </motion.div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              key="expanded-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ 
                height: 'auto',
                opacity: 1,
                transition: {
                  height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                  opacity: { duration: 0.2, delay: 0.1 }
                }
              }}
              exit={{ 
                height: 0,
                opacity: 0,
                transition: {
                  height: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
                  opacity: { duration: 0.1 }
                }
              }}
              className="overflow-hidden border-t border-[rgb(var(--border))] relative z-[100]"
            >
              <div className="p-4 sm:p-6 relative">
                {/* Contact Info */}
                <div className="space-y-2.5 text-sm sm:text-base text-[rgb(var(--text-secondary))] font-mono">
                  <a 
                    href={`tel:${CONTACT_INFO.phone}`}
                    className="block hover:text-[rgb(var(--text-primary))] transition-colors"
                  >
                    {CONTACT_INFO.phone}
                  </a>
                  <div className="flex justify-between items-center">
                    <a 
                      href={`mailto:${CONTACT_INFO.email}`}
                      className="hover:text-[rgb(var(--text-primary))] transition-colors"
                    >
                      {CONTACT_INFO.email}
                    </a>
                    <ThemeSwitcher />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.header>
  );
}
