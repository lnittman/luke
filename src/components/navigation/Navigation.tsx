'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useEffect } from 'react';

interface NavigationItem {
  href: string;
  label: string;
  // Will be replaced with your Genmoji PNGs
  placeholder: string;
}

const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    href: '/',
    label: 'Home',
    placeholder: '🏠',
  },
  {
    href: '/bio',
    label: 'Bio',
    placeholder: '👨‍💻',
  },
  {
    href: '/projects',
    label: 'Projects',
    placeholder: '✨',
  },
];

function NavigationIcon({ item, isActive }: { item: NavigationItem; isActive: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-15, 15], [8, -8]), {
    stiffness: 150,
    damping: 15,
  });
  const rotateY = useSpring(useTransform(mouseX, [-15, 15], [-8, 8]), {
    stiffness: 150,
    damping: 15,
  });

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((event.clientX - centerX) / 4);
    mouseY.set((event.clientY - centerY) / 4);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={clsx(
        "relative p-3 rounded-xl transition-all duration-300",
        "hover:bg-[rgb(var(--surface-1)/0.1)]",
        isActive && "bg-[rgb(var(--surface-1)/0.15)]"
      )}
      style={{
        transformStyle: 'preserve-3d',
        rotateX,
        rotateY,
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Icon container with 3D transform */}
      <motion.div
        className="relative z-10"
        style={{ transform: 'translateZ(8px)' }}
      >
        <span className="block text-2xl select-none">
          {item.placeholder}
        </span>
      </motion.div>

      {/* Glass effect base */}
      <div className="absolute inset-0 rounded-xl glass-effect" />

      {/* Active state glow */}
      {isActive && (
        <motion.div
          layoutId="glow"
          className="absolute inset-0 rounded-xl glow-effect"
          style={{ transform: 'translateZ(-4px)' }}
          transition={{
            type: "spring",
            stiffness: 380,
            damping: 30
          }}
        />
      )}

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--accent-1)/0.1)] to-transparent"
          style={{ transform: 'translateZ(-2px)' }}
        />
      </div>
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