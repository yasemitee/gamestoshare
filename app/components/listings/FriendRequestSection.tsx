'use client';

import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { TermsCheckbox } from '@/components/ui/TermsCheckbox';
import { Button } from '@/components/ui/Button';
import { InvitationFlowModal } from '@/components/verification/InvitationFlowModal';
import { useInvitationFlow } from '@/hooks/useInvitationFlow';
import { colors } from '@/lib/colors';

interface FriendRequestSectionProps {
  listingId: string;
  username: string | null;
}

export function FriendRequestSection({
  listingId,
  username,
}: FriendRequestSectionProps) {
  const [termsAccepted, setTermsAccepted] = useState(false);

  if (typeof window !== 'undefined') {
    (window as any).showVerificationError = () => {
      toast.error(
        <div>
          <div style={{ color: colors.white }}>Verification failed</div>
          <div style={{ color: colors.gray1 }}>
            Please make sure "GTS" is in your steam bio.
          </div>
        </div>,
        {
          duration: 4000,
          style: {
            background: colors.blue1,
            borderRadius: '0',
            fontSize: '12px',
            textTransform: 'none',
          },
        }
      );
    };
    (window as any).showVerificationErrorGeneric = () => {
      toast.error('Verification failed. Please try again.', {
        duration: 4000,
        style: {
          background: colors.blue1,
          color: colors.gray1,
          borderRadius: '0',
          fontSize: '12px',
          textTransform: 'none',
        },
      });
    };
    (window as any).showSteamIdNotFound = () => {
      toast.error('Steam ID not found', {
        duration: 4000,
        style: {
          background: colors.blue1,
          color: colors.gray1,
          borderRadius: '0',
          fontSize: '12px',
          textTransform: 'none',
        },
      });
    };
    (window as any).showListingOwnerNotFound = () => {
      toast.error('Could not find listing owner Steam ID', {
        duration: 4000,
        style: {
          background: colors.blue1,
          color: colors.gray1,
          borderRadius: '0',
          fontSize: '12px',
          textTransform: 'none',
        },
      });
    };
    (window as any).showProfileOpenError = () => {
      toast.error('Failed to open Steam profile. Please try again.', {
        duration: 4000,
        style: {
          background: colors.blue1,
          color: colors.gray1,
          borderRadius: '0',
          fontSize: '12px',
          textTransform: 'none',
        },
      });
    };
  }

  const {
    currentStep,
    userSteamId,
    matchedGame,
    isLoading,
    hasNoMatch,
    openFlow,
    closeFlow,
    skipToSteamIdInput,
    goToSteamIdInput,
    goToCongratulations,
    sendInvitation,
    backToBioVerification,
  } = useInvitationFlow(listingId);

  const handleSendRequest = () => {
    if (!termsAccepted) return;
    openFlow();
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="">
        <TermsCheckbox checked={termsAccepted} onChange={setTermsAccepted} />
        <Button
          onClick={handleSendRequest}
          disabled={!termsAccepted}
          className="mx-auto block px-6 py-2.5 text-button"
        >
          SEND INVITATION
        </Button>
      </div>

      <InvitationFlowModal
        currentStep={currentStep}
        userSteamId={userSteamId}
        matchedGame={matchedGame}
        isLoading={isLoading}
        hasNoMatch={hasNoMatch}
        onClose={closeFlow}
        onBioVerified={goToSteamIdInput}
        onSkipVerification={skipToSteamIdInput}
        onSteamIdSubmit={goToCongratulations}
        onSendInvitation={sendInvitation}
        onBackToVerification={backToBioVerification}
      />
    </>
  );
}
