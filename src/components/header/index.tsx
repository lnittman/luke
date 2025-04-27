'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { ContactPanel } from './components/ContactPanel';
import { LogoName } from './components/LogoName';
import { TimeDisplay } from './components/TimeDisplay';

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
          {/* Logo and Name Component */}
          <LogoName 
            name={CONTACT_INFO.name}
            isHovered={isHovered}
            isExpanded={isExpanded}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />

          {/* Time Display Component */}
          <TimeDisplay />
        </motion.div>

        {/* Expanded Contact Panel */}
        <AnimatePresence>
          {isExpanded && (
            <ContactPanel 
              isExpanded={isExpanded}
              phone={CONTACT_INFO.phone}
              email={CONTACT_INFO.email}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.header>
  );
}
