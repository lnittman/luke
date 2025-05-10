'use client';

import clsx from 'clsx';
import { motion } from 'framer-motion';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer/index';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={clsx(
        "text-[rgb(var(--text-primary))]",
        "min-h-screen w-full",
        "selection:bg-[rgb(var(--accent-1)/0.2)]",
        "transition-colors duration-700",
        "overflow-hidden",
        "relative flex flex-col"
      )}
      style={{
        background: 'rgb(var(--background))',
      }}
    >
      <Header />
      
      <main className="flex-1 flex flex-col w-full max-w-4xl mx-auto overflow-hidden p-4">
        {children}
      </main>
      
      <Footer />
    </div>
  );
} 