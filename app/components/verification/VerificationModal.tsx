'use client';

import { BaseVerificationModal } from './BaseVerificationModal';
import { BioVerificationStep } from './BioVerificationStep';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  steamId?: string;
}

export function VerificationModal({
  isOpen,
  onClose,
  onConfirm,
  steamId,
}: VerificationModalProps) {
  return (
    <BaseVerificationModal isOpen={isOpen} onClose={onClose}>
      <BioVerificationStep
        steamId={steamId}
        onCancel={onClose}
        onConfirm={onConfirm}
      />
    </BaseVerificationModal>
  );
}
