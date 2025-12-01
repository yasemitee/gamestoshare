'use client';

import { useState } from 'react';
import { TermsCheckbox } from '@/components/ui/TermsCheckbox';
import { Button } from '@/components/ui/Button';
import { InvitationFlowModal } from '@/components/verification/InvitationFlowModal';
import { useInvitationFlow } from '@/hooks/useInvitationFlow';

interface FriendRequestSectionProps {
  listingId: string;
  username: string | null;
}

export function FriendRequestSection({
  listingId,
  username,
}: FriendRequestSectionProps) {
  const [termsAccepted, setTermsAccepted] = useState(false);

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
