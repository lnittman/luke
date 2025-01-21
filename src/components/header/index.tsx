'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
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
  name: "Luke Nittmann",
  phone: "(313) 500-1244",
  email: "luke.nittmann@gmail.com",
  address: "3038 Isabel Dr, Los Angeles 90065",
};

export function Header() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTheme, setActiveTheme] = useState<Theme>('system');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showTimeTooltip, setShowTimeTooltip] = useState(false);

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
          className="flex items-center justify-between px-3 sm:px-4 h-[42px] sm:h-10 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* Name */}
          <motion.span 
            className="text-sm font-medium text-[rgb(var(--text-primary))]"
            layout
          >
            {CONTACT_INFO.name.toLowerCase()}
          </motion.span>

          {/* Time Indicator */}
          <div className="relative">
            <motion.div
              className="p-2 sm:p-2.5 rounded-lg text-lg"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [1, 0.8, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              onHoverStart={() => setShowTimeTooltip(true)}
              onHoverEnd={() => setShowTimeTooltip(false)}
            >
              {getTimeEmoji()}
            </motion.div>

            <AnimatePresence>
              {showTimeTooltip && (
                <motion.div
                  className="absolute right-0 top-full mt-1 px-2 py-1 text-xs rounded-lg glass-effect whitespace-nowrap"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  local time: {formattedTime}
                </motion.div>
              )}
            </AnimatePresence>
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
              <div className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  {/* Contact Info */}
                  <div className="space-y-2 text-[11px] sm:text-xs text-[rgb(var(--text-secondary))]">
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

                  {/* Theme Switcher */}
                  <div className="self-end">
                    <Switcher<Theme>
                      options={THEMES}
                      value={activeTheme}
                      onChange={(value) => {
                        setActiveTheme(value);
                        setTheme(value);
                      }}
                    />
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
