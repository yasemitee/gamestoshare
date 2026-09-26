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
  onVerified: (result: { token: string; steamId: string; listing: any }) => void;
}

interface Challenge {
  challengeId: string;
  code: string;
  steamId: string;
}

const toastStyle = { background: colors.gray3, color: colors.white };

export function ManageAccessModal({
  isOpen,
  onClose,
  onVerified,
}: ManageAccessModalProps) {
  const [profileUrl, setProfileUrl] = useState('');
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isRequestingCode, setIsRequestingCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    setProfileUrl('');
    setChallenge(null);
    onClose();
  };

  const requestChallenge = async (value: string): Promise<boolean> => {
    setIsRequestingCode(true);
    try {
      const response = await fetch('/api/listings/manage/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ steamProfileUrl: normalizeSteamId(value) }),
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(
          response.status === 404
            ? 'No listing found for this Steam account.'
            : 'Something went wrong. Please try again.',
          { style: toastStyle }
        );
        return false;
      }

      setChallenge({
        challengeId: data.challengeId,
        code: data.code,
        steamId: data.steamId,
      });
      return true;
    } catch (error) {
      console.error('Manage challenge error:', error);
      toast.error('Something went wrong. Please try again.', {
        style: toastStyle,
      });
      return false;
    } finally {
      setIsRequestingCode(false);
    }
  };

  const handleProfileUrlNext = async (value: string) => {
    setProfileUrl(value);
    await requestChallenge(value);
  };

  const handleConfirm = async () => {
    if (!challenge) return;

    setIsSubmitting(true);
    try {
      const verifyResponse = await fetch('/api/listings/manage/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId: challenge.challengeId }),
      });

      const verifyData = await verifyResponse.json();

      if (verifyResponse.status === 410) {
        // The code timed out: hand out a fresh one so the user can retry.
        if (await requestChallenge(profileUrl)) {
          toast.error(
            'Your code expired. Put the new code in your Steam bio and try again.',
            { style: toastStyle }
          );
        }
        return;
      }

      if (!verifyResponse.ok || !verifyData.verified) {
        toast.error(
          verifyData.error === 'No listing found for this Steam account'
            ? 'No listing found for this Steam account.'
            : `Verification failed. Make sure "${challenge.code}" is in your Steam bio and try again.`,
          { style: toastStyle }
        );
        return;
      }

      const listingResponse = await fetch('/api/listings/manage', {
        headers: { Authorization: `Bearer ${verifyData.token}` },
      });
      const listingData = await listingResponse.json();

      if (!listingResponse.ok) {
        toast.error('Could not load your listing.', { style: toastStyle });
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
        style: toastStyle,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseVerificationModal isOpen={isOpen} onClose={handleClose}>
      {challenge ? (
        <BioVerificationStep
          steamId={challenge.steamId}
          code={challenge.code}
          hint="This code works once and expires in 15 minutes."
          hideBioPreview
          onCancel={() => setChallenge(null)}
          onConfirm={handleConfirm}
          isLoading={isSubmitting || isRequestingCode}
        />
      ) : (
        <SteamIdInputStep
          onBack={handleClose}
          onNext={handleProfileUrlNext}
          isLoading={isRequestingCode}
          currentSteamId={profileUrl}
        />
      )}
    </BaseVerificationModal>
  );
}
