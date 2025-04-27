'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

import { ContactPanel } from './components/ContactPanel';
import { LogoName } from './components/LogoName';
import { TimeDisplay } from './components/TimeDisplay';
import { ThemeSwitcher } from '@/components/theme/ThemeSwitcher';

const CONTACT_INFO = {
  name: "luke nittmann",
  phone: "(313) 500-1244",
  email: "luke.nittmann@gmail.com",
};

export function Header() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Top Items */}
      <motion.div 
        className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Name - Top Left */}
        <Link href="/">
          <motion.div 
            className="text-base font-mono font-medium text-[rgb(var(--text-primary))] cursor-pointer"
            whileHover={{ 
              opacity: 0.8, 
              textShadow: "0 0 8px rgb(var(--accent-1)/0.6)" 
            }}
            transition={{ duration: 0.2 }}
          >
            {CONTACT_INFO.name}
          </motion.div>
        </Link>

        {/* Time - Top Right */}
        <TimeDisplay />
      </motion.div>

      {/* Bottom Items */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 z-50 p-4 flex justify-between items-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Contact Info - Bottom Left */}
        <motion.div className="flex flex-col text-xs font-mono text-[rgb(var(--text-secondary))]">
          <a 
            href={`mailto:${CONTACT_INFO.email}`} 
            className="hover:text-[rgb(var(--text-primary))] transition-colors"
          >
            {CONTACT_INFO.email}
          </a>
          <a 
            href={`tel:${CONTACT_INFO.phone}`} 
            className="hover:text-[rgb(var(--text-primary))] transition-colors"
          >
            {CONTACT_INFO.phone}
          </a>
        </motion.div>

        {/* Theme Switcher - Bottom Right */}
        <ThemeSwitcher />
      </motion.div>
    </>
  );
}
