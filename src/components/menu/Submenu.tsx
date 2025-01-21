'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SubmenuProps {
  action?: ReactNode;
  children: ReactNode;
  isOpen: boolean;
  title: string;
  onBack: () => void;
}

export function Submenu({
  action,
  children,
  isOpen,
  title,
  onBack,
}: SubmenuProps) {
  return (
    <motion.div
      className="absolute inset-0 w-full bg-[rgb(var(--surface-1))]"
      initial={{ opacity: 0, x: 20 }}
      animate={{ 
        opacity: isOpen ? 1 : 0,
        x: isOpen ? 0 : 20,
        pointerEvents: isOpen ? 'auto' : 'none',
      }}
      transition={{ duration: 0.2 }}
    >
      <div className="py-3">
        <div className="relative flex items-center justify-center">
          <motion.button
            className="absolute left-2 p-2 rounded-lg text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--surface-2))]"
            onClick={onBack}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </motion.button>

          <h2 className="text-sm font-medium text-[rgb(var(--text-primary))]">
            {title}
          </h2>

          {action && (
            <div className="absolute right-2">
              {action}
            </div>
          )}
        </div>
      </div>

      {children}
    </motion.div>
  );
}
