'use client';

import clsx from 'clsx';
import { motion } from 'framer-motion';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer/index';

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
        "transition-colors duration-700",
        "overflow-hidden",
        "relative"
      )}
      style={{
        background: 'rgb(var(--background))',
      }}
    >
      <Header />
      
      <main className="flex flex-col min-h-screen w-full max-w-4xl mx-auto p-4 overflow-hidden">
        <div className="flex-1 overflow-hidden pb-16">
          {children}
        </div>
      </main>
      
      <Footer />
    </motion.div>
  );
} 