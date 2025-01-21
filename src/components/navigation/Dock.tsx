'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, UserIcon, FolderIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

const DOCK_ITEMS = [
  { href: '/', icon: <HomeIcon className="w-6 h-6" />, label: 'Home' },
  { href: '/bio', icon: <UserIcon className="w-6 h-6" />, label: 'Bio' },
  { href: '/projects', icon: <FolderIcon className="w-6 h-6" />, label: 'Projects' },
];

export function Dock() {
  const pathname = usePathname();

  return (
    <motion.div 
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="glass flex gap-2 p-3">
        {DOCK_ITEMS.map((item) => (
          <Link 
            key={item.href} 
            href={item.href}
            className={clsx(
              "relative p-3 rounded-lg transition-colors duration-200",
              "hover:bg-white/10",
              pathname === item.href ? "text-white" : "text-white/60"
            )}
          >
            {item.icon}
            {pathname === item.href && (
              <motion.div
                layoutId="active-indicator"
                className="absolute bottom-1 left-1/2 w-1 h-1 bg-white rounded-full -translate-x-1/2"
                transition={{ duration: 0.2 }}
              />
            )}
          </Link>
        ))}
      </div>
    </motion.div>
  );
} 