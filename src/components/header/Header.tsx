'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
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
  address: "3038 isabel dr, los angeles ca 90065",
};

export function Header() {
  const [isExpanded, setIsExpanded] = useState(false);
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

  const getTimeEmoji = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return '🌅';
    if (hour >= 12 && hour < 18) return '☀️';
    if (hour >= 18 && hour < 22) return '🌆';
    return '🌙';
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
        className="max-w-5xl mx-auto glass-effect-strong rounded-xl relative overflow-hidden"
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
          >
            <span className="">{CONTACT_INFO.name}</span>
            <span className="hidden sm:inline opacity-50 ml-2 ">//</span>
            <motion.span
              key={pageName}
              className="hidden sm:inline-block ml-2 "
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
            <span className="hidden sm:inline text-xs  text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] transition-colors">
              local time - {hours.toString().padStart(2, '0')}
              <span style={{ opacity: colonVisible ? 1 : 0, transition: 'opacity 0.1s' }}>:</span>
              {displayMinutes}
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
                <div className="space-y-2.5 text-sm sm:text-base text-[rgb(var(--text-secondary))] ">
                  <a 
                    href={`tel:${CONTACT_INFO.phone.replace(/\D/g, '')}`}
                    className="block hover:text-[rgb(var(--text-primary))] transition-colors"
                  >
                    {CONTACT_INFO.phone}
                  </a>
                  <a 
                    href={`mailto:${CONTACT_INFO.email}`}
                    className="block hover:text-[rgb(var(--text-primary))] transition-colors"
                  >
                    {CONTACT_INFO.email}
                  </a>
                  {/*
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(CONTACT_INFO.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block hover:text-[rgb(var(--text-primary))] transition-colors"
                  >
                    {CONTACT_INFO.address}
                  </a>
                  */}
                </div>
                
                {/* Theme Switcher */}
                <div className="absolute bottom-4 right-4 sm:right-6">
                  <ThemeSwitcher />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.header>
  );
} 