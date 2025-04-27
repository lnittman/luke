'use client';

import { motion } from 'framer-motion';

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