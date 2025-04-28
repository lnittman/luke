'use client';

import { motion } from 'framer-motion';
import { ThemeSwitcher } from '@/components/theme/theme-switcher';

interface ContactPanelProps {
  isExpanded: boolean;
  phone: string;
  email: string;
}

export function ContactPanel({ isExpanded, phone, email }: ContactPanelProps) {
  return (
    <motion.div
      key="expanded-content"
      initial={{ height: 0, opacity: 0 }}
      animate={{ 
        height: 'auto',
        opacity: 1,
        transition: {
          height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
          opacity: { duration: 0.2, delay: 0.1 }
        }
      }}
      exit={{ 
        height: 0,
        opacity: 0,
        transition: {
          height: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
          opacity: { duration: 0.1 }
        }
      }}
      className="overflow-hidden border-t border-[rgb(var(--border))] relative z-[100]"
    >
      <div className="p-4 sm:p-6 relative">
        {/* Contact Info */}
        <div className="space-y-2.5 text-sm sm:text-base text-[rgb(var(--text-secondary))] font-mono">
          <a 
            href={`tel:${phone}`}
            className="block hover:text-[rgb(var(--text-primary))] transition-colors"
          >
            {phone}
          </a>
          <div className="flex justify-between items-center">
            <a 
              href={`mailto:${email}`}
              className="hover:text-[rgb(var(--text-primary))] transition-colors"
            >
              {email}
            </a>
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </motion.div>
  );
} 