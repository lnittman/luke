'use client';

import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { Header } from '@/components/header';
import dynamic from 'next/dynamic';
import { ChatProvider } from '@/components/chat/ChatContext';
import GlobalChatPanel from '@/components/chat/GlobalChatPanel';

// Dynamically import Navigation component to avoid SSR issues
const Navigation = dynamic(() => import('@/components/navigation/Navigation'), { ssr: false });

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [activeTheme, setActiveTheme] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Theme background settings
  const generateBackgroundStyle = () => {
    return {
      background: 'rgb(var(--background))',
    };
  };

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
      style={generateBackgroundStyle()}
    >
      <ChatProvider>
        <main className="flex flex-col min-h-screen w-full max-w-4xl mx-auto px-4">
          <Header />
          <div className="flex-1 pb-24">{children}</div>
          <Navigation />
        </main>
        <GlobalChatPanel />
      </ChatProvider>
    </motion.div>
  );
} 