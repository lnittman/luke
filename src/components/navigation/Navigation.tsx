'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';

interface NavigationItem {
  href: string;
  label: string;
  icon: string;
}

const DEFAULT_NAVIGATION_ITEMS: NavigationItem[] = [
  {
    href: '/',
    label: 'Home',
    icon: '/assets/luke-home.png',
  },
  {
    href: '/bio',
    label: 'Bio',
    icon: '/assets/luke-bio.png',
  },
  {
    href: '/projects',
    label: 'Projects',
    icon: '/assets/luke-projects.png',
  },
];

// Additional item for jobs page (only shown on localhost)
const JOBS_NAVIGATION_ITEM: NavigationItem = {
  href: '/jobs',
  label: 'Jobs',
  icon: '/assets/jobs.png', // Using jobs.png
};

function NavigationIcon({ item, isActive }: { item: NavigationItem; isActive: boolean }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';

  // Adjust glow opacity and spread based on theme
  const glowOpacity = isDarkTheme ? 0.25 : 0.15;
  const glowSpread = isDarkTheme ? '0 0 25px' : '0 0 20px';
  const glowRadius = isDarkTheme ? '90%' : '70%';

  return (
    <div className="relative group">
      <motion.div
        className={clsx(
          "relative p-1.5 sm:p-2.5 rounded-xl transition-colors duration-300",
          "hover:bg-[rgb(var(--surface-1)/0.1)]",
          isActive && "bg-[rgb(var(--surface-1)/0.15)]"
        )}
        onHoverStart={() => setShowTooltip(true)}
        onHoverEnd={() => setShowTooltip(false)}
        onTouchStart={() => setShowTooltip(true)}
        onTouchEnd={() => setShowTooltip(false)}
      >
        <Image
          src={item.icon}
          alt={item.label}
          width={40}
          height={40}
          className="w-9 h-9 sm:w-12 sm:h-12 relative z-10 select-none touch-none"
          priority
          draggable={false}
        />

        <div className="absolute inset-0 rounded-xl glass-effect opacity-50" />

        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 rounded-xl"
            style={{ 
              background: `radial-gradient(circle at center, rgb(var(--accent-1) / ${glowOpacity}) 0%, transparent ${glowRadius})`,
              boxShadow: `${glowSpread} rgb(var(--accent-1) / ${glowOpacity})`,
            }}
          />
        )}
      </motion.div>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 -translate-x-1/2 -top-10 hidden sm:block w-full"
          >
            <div className="relative flex flex-col items-center">
              <div className="px-2.5 py-1.5 rounded-md bg-[rgb(var(--surface-1)/0.9)] backdrop-blur-sm  text-sm lowercase whitespace-nowrap">
                {item.label.toLowerCase()}
              </div>
              <div 
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-[rgb(var(--surface-1)/0.9)]"
                style={{ backdropFilter: 'blur(8px)' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navigation() {
  const pathname = usePathname();
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>(DEFAULT_NAVIGATION_ITEMS);
  
  // Check if we're on localhost and add the jobs link if so
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      
      if (isLocalhost) {
        setNavigationItems([...DEFAULT_NAVIGATION_ITEMS, JOBS_NAVIGATION_ITEM]);
      } else {
        setNavigationItems(DEFAULT_NAVIGATION_ITEMS);
      }
    }
  }, []);

  return (
    <nav 
      className="fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 px-3 sm:px-6 py-1.5 sm:py-3 glass-effect rounded-2xl z-[300]"
      style={{ pointerEvents: 'auto' }}
      data-navigation
    >
      <ul className="flex gap-1.5 sm:gap-3">
        {navigationItems.map(item => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link href={item.href} data-navigation>
                <NavigationIcon item={item} isActive={isActive} />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}