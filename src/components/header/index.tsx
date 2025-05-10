import { motion } from 'framer-motion';
import Link from 'next/link';

import { TimeDisplay } from './components/TimeDisplay';

const CONTACT_INFO = {
  name: "luke nittmann",
};

export function Header() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <motion.div 
        className="max-w-4xl mx-auto p-4 flex justify-between items-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Name - Top Left */}
        <Link href="/">
          <motion.div 
            className="text-base font-mono font-medium text-[rgb(var(--text-primary))] cursor-pointer"
            whileHover={{ 
              opacity: 0.8, 
              textShadow: "0 0 8px rgb(var(--accent-1)/0.6)" 
            }}
            transition={{ duration: 0.2 }}
          >
            {CONTACT_INFO.name}
          </motion.div>
        </Link>

        {/* Time - Top Right */}
        <TimeDisplay />
      </motion.div>
    </div>
  );
}
