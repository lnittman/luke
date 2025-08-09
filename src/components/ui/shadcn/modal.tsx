'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { useModal } from '@/lib/modal-context'

export function ModalRenderer() {
  const { modals, closeModal } = useModal()

  useEffect(() => {
    if (modals.length > 0) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [modals.length])

  return (
    <AnimatePresence>
      {modals.map((modal, index) => (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          exit={{ opacity: 1 }}
          initial={{ opacity: 1 }}
          key={modal.id}
          style={{ zIndex: 1000 + index }}
        >
          {/* Backdrop */}
          <motion.div
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={() => closeModal(modal.id)}
          />

          {/* Modal Content */}
          <motion.div
            animate={{ scale: 1, opacity: 1 }}
            className="relative mx-4 max-h-[90vh] w-full max-w-4xl overflow-auto"
            exit={{ scale: 1, opacity: 1 }}
            initial={{ scale: 1, opacity: 1 }}
          >
            {modal.component}
          </motion.div>
        </motion.div>
      ))}
    </AnimatePresence>
  )
}
