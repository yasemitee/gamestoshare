'use client';

import { colors } from '@/lib/colors';
import { ReactNode } from 'react';

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 backdrop-brightness-40"
        style={{ backgroundColor: colors.black + '10' }}
        onClick={onClose}
      />

      <div
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
      </div>
    </div>
  );
}
