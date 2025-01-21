'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useState } from 'react';

interface MenuProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  anchor: { x: number; y: number } | null;
}

export function Menu({ children, isOpen, onClose, anchor }: MenuProps) {
  if (!anchor) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Menu */}
          <motion.div
            className="fixed z-50 glass-effect-strong rounded-xl overflow-hidden shadow-lg"
            style={{
              top: anchor.y + 8,
              right: window.innerWidth - anchor.x,
              width: 280,
            }}
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="relative overflow-hidden">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
