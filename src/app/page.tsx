'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { blogPosts } from '@/app/blogData';

// Style to completely disable all transitions during theme changes
const noThemeTransition = `
  /* Disable all transitions related to colors and borders */
  .blog-list-item,
  .blog-list-item *,
  .project-list-item,
  .project-list-item *,
  [class*="border-[rgb(var(--border))]"],
  [class*="text-[rgb(var(--text"],
  [class*="bg-[rgb(var(--background"],
  .generated-name,
  .project-name,
  .project-description {
    transition-property: none !important;
  }

  /* Selectively enable only the transitions we want */
  .blog-list-item:hover,
  .blog-list-item:active,
  .project-list-item:hover,
  .project-list-item:active {
    transition: opacity 300ms ease !important;
  }
`;

function Hero() {
  const handleLogoPress = () => {
    // Trigger haptic feedback if available
    if (window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  };

  return (
    <div className="relative w-full h-[100dvh] flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Add style to completely disable transitions during theme changes */}
      <style jsx global>{noThemeTransition}</style>
      
      {/* Main container */}
      <motion.div
        className="relative w-full max-w-2xl mx-auto overflow-hidden select-none flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Logo centered */}
        <motion.div
          className="relative cursor-pointer w-16 h-16 sm:w-20 sm:h-20 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8,
            ease: [0.23, 1, 0.32, 1]
          }}
          whileHover={{ 
            scale: 1.05,
            filter: "drop-shadow(0 0 8px rgb(var(--accent-1)/0.6))",
            transition: { type: "spring", stiffness: 500, damping: 15 }
          }}
          whileTap={{
            scale: 0.95,
            rotate: -8,
            transition: { type: "spring", stiffness: 400, damping: 8 }
          }}
          onTapStart={handleLogoPress}
        >
          <Image
            src="/assets/logo.png"
            alt="logo"
            width={112}
            height={112}
            className="w-full h-full object-contain relative z-10 select-none touch-none pointer-events-none"
            priority
            draggable={false}
            quality={95}
          />
        </motion.div>
        
        {/* Blog posts container */}
        <motion.div
          className="w-full bg-[rgb(var(--background-secondary))] rounded-lg overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8,
            ease: [0.23, 1, 0.32, 1],
            delay: 0.2
          }}
        >
          {/* Blog post header */}
          <div className="px-4 py-3 border-b border-[rgb(var(--border))] grid grid-cols-12 text-sm text-[rgb(var(--text-secondary))]">
            <div className="col-span-2">date</div>
            <div className="col-span-8">title</div>
            <div className="col-span-2 text-right">read</div>
          </div>
          
          {/* Blog post list - scrollable */}
          <div className="max-h-[calc(100vh-250px)] overflow-y-auto">
            {blogPosts.map((post) => (
              <Link 
                key={post.id}
                href={`/blog/${post.slug}`}
                className="block"
              >
                <div 
                  className="blog-list-item px-4 py-3 border-b border-[rgb(var(--border))] grid grid-cols-12 hover:bg-[rgb(var(--background-hover))] transition-all duration-300 cursor-pointer group"
                >
                  <div className="col-span-2 text-sm text-[rgb(var(--text-secondary))]">
                    {format(post.date, 'yyyy')}
                  </div>
                  <div className="col-span-8 text-[rgb(var(--text-primary))] group-hover:text-[rgb(var(--text-accent))] transition-colors">
                    {post.title}
                  </div>
                  <div className="col-span-2 text-right text-sm text-[rgb(var(--text-secondary))]">
                    {post.timeToRead}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <Hero />
    </div>
  );
}