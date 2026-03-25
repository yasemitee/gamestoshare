import { useState, useCallback } from 'react';
import { extractCleanSteamId } from '@/lib/steam/utils';
import { STEAM_VERIFICATION_CODE } from '@/lib/constants';
import { showVerificationError, showGenericError, showSteamIdNotFoundError } from '@/lib/utils/errors';

type InvitationStep = 'bio-verification' | 'steam-id-input' | 'congratulations' | 'closed';

interface UseInvitationFlowReturn {
  currentStep: InvitationStep;
  userSteamId: string | null;
  matchedGame: { name: string; image: string } | null;
  isLoading: boolean;
  hasNoMatch: boolean;
  openFlow: () => void;
  closeFlow: () => void;
  skipToSteamIdInput: () => void;
  goToSteamIdInput: () => Promise<void>;
  goToCongratulations: (steamId: string) => Promise<void>;
  sendInvitation: () => Promise<void>;
  backToBioVerification: () => void;
}

export function useInvitationFlow(
  listingId: string,
  listingOwnerId?: string
): UseInvitationFlowReturn {
  const [currentStep, setCurrentStep] = useState<InvitationStep>('closed');
  const [userSteamId, setUserSteamId] = useState<string | null>(null);
  const [matchedGame, setMatchedGame] = useState<{ name: string; image: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNoMatch, setHasNoMatch] = useState(false);

  const openFlow = useCallback(() => {
    setCurrentStep('steam-id-input');
  }, []);

  const closeFlow = useCallback(() => {
    setCurrentStep('closed');
    setUserSteamId(null);
    setMatchedGame(null);
    setIsLoading(false);
    setHasNoMatch(false);
  }, []);

  const skipToSteamIdInput = useCallback(() => {
    setCurrentStep('steam-id-input');
  }, []);

  const backToBioVerification = useCallback(() => {
    setCurrentStep('bio-verification');
  }, []);

  const goToSteamIdInput = useCallback(async () => {
    setCurrentStep('steam-id-input');
  }, []);

  const goToCongratulations = useCallback(
    async (steamId: string) => {
      const cleanSteamId = extractCleanSteamId(steamId);
      setUserSteamId(cleanSteamId);
      setMatchedGame(null);
      setHasNoMatch(false);
      setCurrentStep('congratulations');
    },
    []
  );

  const sendInvitation = useCallback(async () => {
    try {
      const listingResponse = await fetch(`/api/listings/${listingId}`);
      const listingData = await listingResponse.json();

      if (!listingData?.steamId) {
        showGenericError();
        return;
      }

      const isNumericId = /^\d{17}$/.test(listingData.steamId);
      const steamProfileUrl = isNumericId
        ? `https://steamcommunity.com/profiles/${listingData.steamId}`
        : `https://steamcommunity.com/id/${listingData.steamId}`;

      window.open(steamProfileUrl, '_blank');
      window.location.href = `steam://openurl/${steamProfileUrl}`;

      closeFlow();
    } catch (error) {
      console.error('Error sending invitation:', error);
      showGenericError();
    }
  }, [listingId, closeFlow]);

  return {
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
  };
}
