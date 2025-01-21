'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface ContactInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
}

const CONTACT_INFO: ContactInfo = {
  name: "Luke Nittmann",
  phone: "(313) 500-1244",
  email: "luke.nittmann@gmail.com",
  address: "3038 Isabel Dr, Los Angeles 90065",
};

export function ContactCard() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="fixed top-4 sm:top-6 left-4 sm:left-6 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="glass-effect-strong rounded-lg relative overflow-hidden cursor-pointer w-[260px] sm:w-[280px]"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
      >
        {/* Compact view */}
        <motion.div className="flex items-center gap-3 px-3 sm:px-4 h-[42px] sm:h-10 w-full">
          <motion.div
            className="w-2 h-2 rounded-full bg-[rgb(var(--accent-1))]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.span 
            className="text-sm font-medium text-[rgb(var(--text-primary))]"
            layout
          >
            {CONTACT_INFO.name}
          </motion.span>
        </motion.div>

        {/* Expanded view */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              key="expanded-content"
              initial={{ height: 0 }}
              animate={{ 
                height: 'auto',
                transition: {
                  height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                }
              }}
              exit={{ 
                height: 0,
                transition: {
                  height: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
                }
              }}
              className="relative overflow-hidden"
            >
              <motion.div 
                className="px-3 sm:px-4 pb-4 pt-2 space-y-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ 
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.2, delay: 0.1 }
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                  transition: { duration: 0.1 }
                }}
              >
                {/* Contact Details */}
                <motion.div className="space-y-2 text-[11px] sm:text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[rgb(var(--accent-1))]" />
                    <a 
                      href={`tel:${CONTACT_INFO.phone}`}
                      className="text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] transition-colors py-1"
                    >
                      {CONTACT_INFO.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[rgb(var(--accent-2))]" />
                    <a 
                      href={`mailto:${CONTACT_INFO.email}`}
                      className="text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] transition-colors py-1"
                    >
                      {CONTACT_INFO.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="w-1 h-1 rounded-full bg-[rgb(var(--accent-1))]" />
                    <a 
                      href={`https://maps.google.com/?q=${encodeURIComponent(CONTACT_INFO.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] transition-colors py-1"
                    >
                      {CONTACT_INFO.address}
                    </a>
                  </div>
                </motion.div>

                {/* Map Preview */}
                <motion.div 
                  className="w-full h-24 rounded-lg overflow-hidden relative"
                  initial={{ scale: 0.95, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="absolute inset-0 bg-[rgb(var(--surface-1))] opacity-30" />
                  
                  {/* Decorative map elements */}
                  <div className="absolute inset-0 opacity-40">
                    <motion.div
                      className="absolute w-full h-[1px] bg-[rgb(var(--accent-1))]"
                      style={{ top: '40%' }}
                      animate={{
                        opacity: [0.2, 0.4, 0.2],
                        scaleX: [0.9, 1, 0.9],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <motion.div
                      className="absolute h-full w-[1px] bg-[rgb(var(--accent-2))]"
                      style={{ left: '60%' }}
                      animate={{
                        opacity: [0.2, 0.4, 0.2],
                        scaleY: [0.9, 1, 0.9],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    
                    {/* Location pin */}
                    <motion.div
                      className="absolute w-2 h-2 rounded-full bg-[rgb(var(--accent-1))]"
                      style={{ 
                        left: '60%', 
                        top: '40%',
                        transform: 'translate(-50%, -50%)',
                      }}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </div>

                  {/* Location text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs text-[rgb(var(--text-secondary))] font-mono">
                      Los Angeles, CA
                    </span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Bottom fade gradient */}
              <div 
                className="absolute inset-x-0 bottom-0 h-6 pointer-events-none"
                style={{
                  background: 'linear-gradient(to bottom, transparent, rgb(var(--background-end) / 0.1))'
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Decorative gradient */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: `linear-gradient(45deg, rgb(var(--accent-1)), rgb(var(--accent-2)))`,
            filter: 'blur(20px)',
          }}
          animate={{
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </motion.div>
  );
}