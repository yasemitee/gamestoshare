'use client';

import { useState } from 'react';
import { BaseVerificationModal } from './BaseVerificationModal';
import { BioVerificationStep } from './BioVerificationStep';
import { SteamIdInputStep } from './SteamIdInputStep';
import { setManageToken } from '@/lib/utils/manageStorage';
import toast from 'react-hot-toast';
import { colors } from '@/lib/colors';
import { normalizeSteamId } from '@/lib/steam/utils';

interface ManageAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingId?: string;
  onVerified: (result: { token: string; steamId: string; listing: any }) => void;
}

type Step = 'profile-url' | 'bio';

export function ManageAccessModal({
  isOpen,
  onClose,
  listingId,
  onVerified,
}: ManageAccessModalProps) {
  const [step, setStep] = useState<Step>(listingId ? 'bio' : 'profile-url');
  const [profileUrl, setProfileUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    setStep(listingId ? 'bio' : 'profile-url');
    setProfileUrl('');
    onClose();
  };

  const handleProfileUrlNext = (value: string) => {
    setProfileUrl(value);
    setStep('bio');
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const verifyResponse = await fetch('/api/listings/manage/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          listingId
            ? { listingId }
            : { steamProfileUrl: normalizeSteamId(profileUrl) }
        ),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok || !verifyData.verified) {
        toast.error(
          verifyData.error === 'No listing found for this Steam account'
            ? 'No listing found for this Steam account.'
            : 'Verification failed. Make sure "GTS" is in your Steam bio and try again.',
          { style: { background: colors.blue1, color: colors.white } }
        );
        return;
      }

      const listingResponse = await fetch('/api/listings/manage', {
        headers: { Authorization: `Bearer ${verifyData.token}` },
      });
      const listingData = await listingResponse.json();

      if (!listingResponse.ok) {
        toast.error('Could not load your listing.', {
          style: { background: colors.blue1, color: colors.white },
        });
        return;
      }

      setManageToken(verifyData.listingId, {
        token: verifyData.token,
        steamId: verifyData.steamId,
        expiresAt: verifyData.expiresAt,
      });

      onVerified({
        token: verifyData.token,
        steamId: verifyData.steamId,
        listing: listingData.listing,
      });
      handleClose();
    } catch (error) {
      console.error('Manage verification error:', error);
      toast.error('Something went wrong. Please try again.', {
        style: { background: colors.blue1, color: colors.white },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseVerificationModal isOpen={isOpen} onClose={handleClose}>
      {step === 'profile-url' ? (
        <SteamIdInputStep
          onBack={handleClose}
          onNext={handleProfileUrlNext}
          isLoading={false}
        />
      ) : (
        <BioVerificationStep
          onCancel={listingId ? handleClose : () => setStep('profile-url')}
          onConfirm={handleConfirm}
          showSkip={false}
          isLoading={isSubmitting}
        />
      )}
    </BaseVerificationModal>
  );
}
