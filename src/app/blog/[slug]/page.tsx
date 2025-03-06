'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';

// Import from the correct location
import { blogPosts } from '@/app/blogData';

export default function BlogPost({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const post = blogPosts.find(post => post.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl mb-4">post not found</h1>
          <Link href="/" className="text-[rgb(var(--text-accent))]">
            return home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen pt-24 sm:pt-28 px-4 pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-2xl mx-auto">
        {/* Header with back link */}
        <div className="mb-10">
          <Link 
            href="/"
            className="inline-block py-2 px-1 -ml-1 mb-6 text-sm text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-accent))] transition-colors cursor-pointer"
          >
            ← back
          </Link>
          
          <h1 className="text-xl sm:text-2xl text-[rgb(var(--text-primary))] mb-2">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-between text-sm text-[rgb(var(--text-secondary))]">
            <span>{format(post.date, 'MMMM d, yyyy')}</span>
            <span>{post.timeToRead} read</span>
          </div>
        </div>
        
        {/* Content */}
        <div className="prose prose-invert max-w-none text-sm sm:text-base px-0 sm:px-1">
          {post.content}
        </div>
      </div>
    </motion.div>
  );
} 