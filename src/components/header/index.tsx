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
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4 glass-effect">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Link href="/" className="text-sm sm:text-base ">
            {CONTACT_INFO.name}
          </Link>
          <span className="hidden sm:inline  text-sm sm:text-base text-[rgb(var(--text-secondary))]">
            // {pageName}
          </span>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <div 
            className="text-xs sm:text-sm  text-[rgb(var(--text-secondary))]"
            onMouseEnter={() => setShowTimeTooltip(true)}
            onMouseLeave={() => setShowTimeTooltip(false)}
          >
            local time: {formattedTime}
          </div>
          <div className="text-lg">{getTimeEmoji()}</div>
        </div>
      </div>
    </header>
  );
}
