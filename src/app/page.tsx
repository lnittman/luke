'use client';

import { motion, stagger } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { blogPosts } from '@/app/blog/blogData';

// Style to completely disable all transitions during theme changes
const noThemeTransition = `
  /* Disable all transitions related to colors and borders */
  .blog-list-item,
  .blog-list-item *,
  [class*="border-[rgb(var(--border))]"],
  [class*="text-[rgb(var(--text"],
  [class*="bg-[rgb(var(--background"],
  .blog-title,
  .blog-date {
    transition-property: none !important;
  }

  /* Selectively enable only the transitions we want */
  .blog-list-item:hover,
  .blog-list-item:active {
    transition: opacity 300ms ease !important;
  }
`;

function Hero() {
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.8,
        ease: [0.23, 1, 0.32, 1],
        when: "beforeChildren",
        staggerChildren: 0.08
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: [0.23, 1, 0.32, 1]
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center px-4" style={{ paddingTop: 'calc(50vh - 320px)' }}>
      {/* Add style to completely disable transitions during theme changes */}
      <style jsx global>{noThemeTransition}</style>
      
      <motion.div 
        className="relative w-full max-w-2xl mx-auto overflow-hidden select-none flex flex-col items-center pb-48"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Blog posts container */}
        <motion.div
          className="w-full bg-[rgb(var(--background-secondary))] rounded-lg overflow-hidden transform-gpu scale-[0.95] origin-top"
          style={{ 
            maxWidth: '100%',
            overflow: 'hidden'
          }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Blog post header */}
          <motion.div 
            variants={itemVariants}
            className="px-3 py-2 border-b border-[rgb(var(--border))] grid grid-cols-12 text-xs text-[rgb(var(--text-secondary))]"
          >
            <div className="col-span-2 flex items-center">date</div>
            <div className="col-span-8 flex items-center">title</div>
            <div className="col-span-2 flex items-center justify-end">read</div>
          </motion.div>
          
          {/* Blog post list - scrollable */}
          <div className="max-h-[calc(100vh-250px)] overflow-y-auto">
            {blogPosts.map((post) => (
              <motion.div key={post.id} variants={itemVariants}>
                <Link 
                  href={`/blog/${post.slug}`}
                  className="block"
                >
                  <div 
                    className="blog-list-item px-3 py-2 border-b border-[rgb(var(--border))] grid grid-cols-12 hover:bg-[rgb(var(--background-hover))] transition-all duration-300 cursor-pointer group h-[46px] items-center"
                  >
                    <div className="col-span-2 text-xs text-[rgb(var(--text-secondary))] flex items-center leading-none">
                      {format(post.date, 'yyyy')}
                    </div>
                    <div className="col-span-8 text-[rgb(var(--text-primary))] group-hover:text-[rgb(var(--text-accent))] transition-colors text-xs flex items-center leading-tight line-clamp-2">
                      {post.title}
                    </div>
                    <div className="col-span-2 text-right text-xs text-[rgb(var(--text-secondary))] flex items-center justify-end leading-none">
                      {post.timeToRead}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="overflow-hidden h-screen">
      <Hero />
    </div>
  );
}