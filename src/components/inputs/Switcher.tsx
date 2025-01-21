'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useClickAway } from '@/hooks/useClickAway';

export interface SwitcherOption<T> {
  value: T;
  label: string;
  icon?: string;
}

interface SwitcherProps<T> {
  options: SwitcherOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function Switcher<T>({ options, value, onChange }: SwitcherProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickAway(containerRef, () => setIsOpen(false));

  const selectedOption = options.find(option => option.value === value);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
      >
        {selectedOption?.icon && <span>{selectedOption.icon}</span>}
        <span>{selectedOption?.label}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 p-1 rounded-lg bg-white dark:bg-zinc-800 shadow-lg min-w-[120px]"
          >
            {options.map((option) => (
              <button
                key={String(option.value)}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`
                  flex items-center gap-2 w-full px-3 py-1.5 rounded-md text-left
                  ${option.value === value
                    ? 'bg-black/5 dark:bg-white/5'
                    : 'hover:bg-black/5 dark:hover:bg-white/5'
                  }
                `}
              >
                {option.icon && <span>{option.icon}</span>}
                <span>{option.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
