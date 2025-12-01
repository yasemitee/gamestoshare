'use client';

import { BaseVerificationModal } from './BaseVerificationModal';
import { BioVerificationStep } from './BioVerificationStep';
import { SteamIdInputStep } from './SteamIdInputStep';

type InvitationStep =
  | 'bio-verification'
  | 'steam-id-input'
  | 'congratulations'
  | 'closed';

interface InvitationFlowModalProps {
  currentStep: InvitationStep;
  userSteamId: string | null;
  matchedGame: { name: string; image: string } | null;
  isLoading: boolean;
  hasNoMatch: boolean;
  onClose: () => void;
  onBioVerified: () => void;
  onSkipVerification: () => void;
  onSteamIdSubmit: (steamId: string) => void;
  onSendInvitation: () => void;
  onBackToVerification: () => void;
}

export function InvitationFlowModal({
  currentStep,
  userSteamId,
  matchedGame,
  isLoading,
  hasNoMatch,
  onClose,
  onBioVerified,
  onSkipVerification,
  onSteamIdSubmit,
  onSendInvitation,
  onBackToVerification,
}: InvitationFlowModalProps) {
  const isOpen = currentStep !== 'closed';
  const isBioVerificationStep = currentStep === 'bio-verification';
  const isSteamIdStep =
    currentStep === 'steam-id-input' || currentStep === 'congratulations';
  const isResultStep = currentStep === 'congratulations';

  return (
    <BaseVerificationModal isOpen={isOpen} onClose={onClose}>
      {isBioVerificationStep && (
        <BioVerificationStep
          steamId={userSteamId || undefined}
          onCancel={onClose}
          onConfirm={onBioVerified}
          onSkip={onSkipVerification}
          showSkip
          hideBioPreview
        />
      )}

      {isSteamIdStep && (
        <SteamIdInputStep
          onBack={onBackToVerification}
          onNext={onSteamIdSubmit}
          isLoading={isLoading}
          showCongratulations={isResultStep && !hasNoMatch}
          showNoMatch={isResultStep && hasNoMatch}
          matchedGameName={matchedGame?.name}
          matchedGameImage={matchedGame?.image}
          currentSteamId={userSteamId || undefined}
          onSendInvitation={onSendInvitation}
        />
      )}
    </BaseVerificationModal>
  );
}
