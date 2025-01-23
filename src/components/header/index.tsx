'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Switcher } from '../inputs/Switcher';
import { THEMES, Theme } from '../theme/ThemeSwitcher';
import { setTheme } from '../theme/ThemeSwitcher';
import Link from 'next/link';

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
  const [activeTheme, setActiveTheme] = useState<Theme>('system');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showTimeTooltip, setShowTimeTooltip] = useState(false);
  const pathname = usePathname();
  const pageName = pathname === '/' ? 'home' : pathname.slice(1);

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Format time as "h:mm a" (e.g., "2:30 pm")
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
      className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="max-w-5xl mx-auto glass-effect-strong rounded-xl relative overflow-hidden"
        layout
      >
        <div 
          className="flex items-center justify-between px-4 sm:px-6 h-[52px] sm:h-14 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* Name and Page Indicator */}
          <div className="text-base sm:text-lg font-medium text-[rgb(var(--text-primary))]">
            <span className="font-mono">{CONTACT_INFO.name.toLowerCase()}</span>
            <span className="opacity-50 ml-2 font-mono">//</span>
            <motion.span
              key={pageName}
              className="ml-2 font-mono inline-block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {pageName}
            </motion.span>
          </div>

          {/* Time Indicator */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] transition-colors">
              local time: {formattedTime}
            </span>
            <motion.div
              className="p-2.5 sm:p-3 rounded-lg text-xl sm:text-2xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [1, 0.8, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {getTimeEmoji()}
            </motion.div>
          </div>
        </div>

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
              className="overflow-hidden border-t border-[rgb(var(--border))]"
            >
              <div className="p-4 sm:p-6">
                {/* Contact Info */}
                <div className="space-y-2.5 text-sm sm:text-base text-[rgb(var(--text-secondary))] font-mono">
                  <a 
                    href={`tel:${CONTACT_INFO.phone}`}
                    className="block hover:text-[rgb(var(--text-primary))] transition-colors"
                  >
                    {CONTACT_INFO.phone.toLowerCase()}
                  </a>
                  <a 
                    href={`mailto:${CONTACT_INFO.email}`}
                    className="block hover:text-[rgb(var(--text-primary))] transition-colors"
                  >
                    {CONTACT_INFO.email.toLowerCase()}
                  </a>
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(CONTACT_INFO.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block hover:text-[rgb(var(--text-primary))] transition-colors"
                  >
                    {CONTACT_INFO.address.toLowerCase()}
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.header>
  );
}
