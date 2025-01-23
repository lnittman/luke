'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useEffect } from 'react';
import Image from 'next/image';

interface NavigationItem {
  href: string;
  label: string;
  icon: string;
}

const NAVIGATION_ITEMS: NavigationItem[] = [
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

function NavigationIcon({ item, isActive }: { item: NavigationItem; isActive: boolean }) {
  return (
    <motion.div
      className={clsx(
        "relative p-3 rounded-xl transition-colors duration-300",
        "hover:bg-[rgb(var(--surface-1)/0.1)]",
        isActive && "bg-[rgb(var(--surface-1)/0.15)]"
      )}
    >
      <Image
        src={item.icon}
        alt={item.label}
        width={40}
        height={40}
        className="w-12 h-12 relative z-10"
        priority
      />

      <div className="absolute inset-0 rounded-xl glass-effect" />

      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 rounded-xl"
          style={{ 
            background: 'radial-gradient(circle at center, rgb(var(--accent-1) / 0.15) 0%, transparent 70%)',
            boxShadow: '0 0 30px rgb(var(--accent-1) / 0.3)'
          }}
        />
      )}
    </motion.div>
  );
}

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav 
      className="fixed bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 glass-effect rounded-2xl z-50"
      data-navigation
    >
      <ul className="flex gap-4">
        {NAVIGATION_ITEMS.map(item => {
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