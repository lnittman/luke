'use client';

import clsx from 'clsx';
import { motion } from 'framer-motion';

import { Header } from '@/components/header';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={clsx(
        "text-[rgb(var(--text-primary))]",
        "min-h-screen w-full",
        "selection:bg-[rgb(var(--accent-1)/0.2)]",
        "transition-colors duration-700"
      )}
      style={{
        background: 'rgb(var(--background))',
      }}
    >
      <main className="flex flex-col min-h-screen w-full max-w-4xl mx-auto px-4">
        <Header />

        <div className="flex-1">
          {children}
        </div>
      </main>
    </motion.div>
  );
} 