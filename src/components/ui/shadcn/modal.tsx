'use client';

import { useModal } from '@/lib/modal-context';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

export function ModalRenderer() {
  const { modals, closeModal } = useModal();

  useEffect(() => {
    if (modals.length > 0) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [modals.length]);

  return (
    <AnimatePresence>
      {modals.map((modal, index) => (
        <motion.div
          key={modal.id}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ zIndex: 1000 + index }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => closeModal(modal.id)}
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1, opacity: 1 }}
            className="relative max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto"
          >
            {modal.component}
          </motion.div>
        </motion.div>
      ))}
    </AnimatePresence>
  );
}