'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { motion } from "framer-motion";

interface JobsTabsProps {
  children: {
    sources: React.ReactNode;
    posts: React.ReactNode;
    jobs: React.ReactNode;
  };
  activeJobId: string | null;
}

export function JobsTabs({ children, activeJobId }: JobsTabsProps) {
  const [activeTab, setActiveTab] = useState<string>(activeJobId ? "jobs" : "posts");

  // Animation variants for tab content
  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }
  };

  return (
    <Tabs 
      defaultValue={activeTab} 
      className="w-full pt-4" 
      onValueChange={setActiveTab}
      value={activeTab}
    >
      <TabsList className="grid grid-cols-3 mb-6 glass-effect shadow-sm">
        <TabsTrigger value="sources">sources</TabsTrigger>
        <TabsTrigger value="posts">posts</TabsTrigger>
        <TabsTrigger value="jobs" disabled={!activeJobId}>jobs</TabsTrigger>
      </TabsList>
      
      <TabsContent value="sources" className="mt-0 relative">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={contentVariants}
        >
          {children.sources}
        </motion.div>
      </TabsContent>
      
      <TabsContent value="posts" className="mt-0 relative">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={contentVariants}
        >
          {children.posts}
        </motion.div>
      </TabsContent>
      
      <TabsContent value="jobs" className="mt-0 relative">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={contentVariants}
        >
          {children.jobs}
        </motion.div>
      </TabsContent>
    </Tabs>
  );
} 