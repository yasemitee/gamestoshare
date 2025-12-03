'use client';

import { colors } from '@/lib/colors';
import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface BaseVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function BaseVerificationModal({
  isOpen,
  onClose,
  children,
}: BaseVerificationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 backdrop-brightness-40"
            style={{ backgroundColor: colors.black + '10' }}
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
            className="relative w-full max-w-[762px] px-6 md:px-48 py-8 mx-4 md:mx-0"
            style={{ backgroundColor: colors.blue1 }}
          >
            <button
              onClick={onClose}
              className="absolute top-6 md:top-9 right-4 md:right-8 hover:opacity-70 transition-opacity"
            >
              <img src="/XIcon.svg" alt="Close" width="14" height="14" />
            </button>

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
