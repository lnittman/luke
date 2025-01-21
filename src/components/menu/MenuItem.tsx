'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface MenuItemProps {
  children: ReactNode;
  icon?: ReactNode;
  rightIcon?: ReactNode;
  onClick: () => void;
  variant?: 'default' | 'active';
}

export function MenuItem({
  children,
  icon,
  rightIcon,
  onClick,
  variant = 'default'
}: MenuItemProps) {
  return (
    <motion.button
      className="group relative flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg"
      onClick={onClick}
      whileHover={{ backgroundColor: 'rgba(var(--surface-2), 0.8)' }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="relative z-10 flex items-center gap-3 text-[rgb(var(--text-secondary))] group-hover:text-[rgb(var(--text-primary))]">
        {icon && (
          <span className="text-[rgb(var(--accent-1))]">
            {icon}
          </span>
        )}
        <span>
          {children}
        </span>
      </span>

      {rightIcon && (
        <span className="relative z-10 text-[rgb(var(--text-secondary))] group-hover:text-[rgb(var(--text-primary))]">
          {rightIcon}
        </span>
      )}

      {variant === 'active' && (
        <motion.div
          className="absolute inset-0 rounded-lg bg-[rgb(var(--accent-1))]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
        />
      )}
    </motion.button>
  );
}
