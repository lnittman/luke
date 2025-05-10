'use client';

import { motion } from 'framer-motion';
import { ThemeSwitcher } from '@/components/theme/theme-switcher';

const CONTACT_INFO = {
  email: "luke.nittmann@gmail.com",
  phone: "(313) 500-1244",
};

export function Footer() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <motion.div 
        className="max-w-4xl mx-auto p-4 flex justify-between items-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Contact Info - Bottom Left */}
        <motion.div className="flex flex-col text-xs font-mono text-[rgb(var(--text-secondary))]">
          <a 
            href={`mailto:${CONTACT_INFO.email}`} 
            className="hover:text-[rgb(var(--text-primary))] transition-colors"
          >
            {CONTACT_INFO.email}
          </a>
          <a 
            href={`sms:${CONTACT_INFO.phone}`} 
            className="hover:text-[rgb(var(--text-primary))] transition-colors"
          >
            {CONTACT_INFO.phone}
          </a>
        </motion.div>

        {/* Theme Switcher - Bottom Right */}
        <ThemeSwitcher />
      </motion.div>
    </div>
  );
} 