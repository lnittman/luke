import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeVariants } from './templates';
import { Toaster } from 'sonner';

interface ProjectLayoutProps {
  children: ReactNode;
  className?: string;
}

export const ProjectLayout: React.FC<ProjectLayoutProps> = ({ 
  children,
  className = ""
}) => {
  return (
    <motion.div
      className={`flex flex-col h-full max-h-[calc(100vh-80px)] overflow-hidden rounded-xl shadow-md bg-[rgb(var(--card))] text-[rgb(var(--card-foreground))] border border-[rgb(var(--border))] ${className}`}
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
    >
      <Toaster position="top-center" />
      <div className="flex flex-col md:flex-row h-full overflow-hidden">
        {children}
      </div>
    </motion.div>
  );
};

interface LeftPanelProps {
  children: ReactNode;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({ children }) => {
  return (
    <div className="flex flex-col w-full md:w-[350px] border-r border-[rgb(var(--border))] overflow-hidden">
      {children}
    </div>
  );
};

interface RightPanelProps {
  children: ReactNode;
}

export const RightPanel: React.FC<RightPanelProps> = ({ children }) => {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {children}
    </div>
  );
}; 