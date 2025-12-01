import { useState, useCallback } from 'react';
import { extractCleanSteamId } from '@/lib/steam/utils';

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
    setCurrentStep('bio-verification');
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
    // Verify GTS code in bio
    try {
      const response = await fetch('/api/steam/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          steamId: userSteamId,
          verificationCode: 'GTS',
        }),
      });

      const data = await response.json();

      if (data.verified) {
        setCurrentStep('steam-id-input');
      } else {
        alert('Verification failed. Please make sure "GTS" is in your Steam bio.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      alert('Verification failed. Please try again.');
    }
  }, [userSteamId]);

  const goToCongratulations = useCallback(
    async (steamId: string) => {
      setIsLoading(true);
      // Reset previous state
      setHasNoMatch(false);
      setMatchedGame(null);
      
      try {
        const cleanSteamId = extractCleanSteamId(steamId);
        
        // Step 1: Verify GTS code in bio
        const verifyResponse = await fetch('/api/steam/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            steamId: cleanSteamId,
            verificationCode: 'GTS',
          }),
        });

        const verifyData = await verifyResponse.json();

        if (!verifyData.verified) {
          setIsLoading(false);
          alert('Verification failed. Please make sure "GTS" is in your Steam bio.');
          return;
        }

        setUserSteamId(cleanSteamId);

        // Step 2: Check for matching games
        const gamesResponse = await fetch(`/api/listings/${listingId}/check-games`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            steamId: cleanSteamId,
          }),
        });

        const gamesData = await gamesResponse.json();

        if (gamesData.hasMatch && gamesData.matchedGame) {
          setMatchedGame(gamesData.matchedGame);
          setHasNoMatch(false);
          setCurrentStep('congratulations');
        } else {
          setMatchedGame(null);
          setHasNoMatch(true);
          setCurrentStep('congratulations');
        }
      } catch (error) {
        console.error('Error checking games:', error);
        alert('Failed to verify. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const sendInvitation = useCallback(async () => {
    try {
      if (!userSteamId) {
        alert('Steam ID not found');
        return;
      }

      // Get listing owner's Steam ID
      const listingResponse = await fetch(`/api/listings/${listingId}`);
      const listingData = await listingResponse.json();
      
      if (!listingData?.steamId) {
        alert('Could not find listing owner Steam ID');
        return;
      }

      // Open Steam profile in new tab
      const steamProfileUrl = `https://steamcommunity.com/profiles/${listingData.steamId}`;
      window.open(steamProfileUrl, '_blank');
      
      // Also try to open Steam client
      window.location.href = `steam://url/SteamIDPage/${listingData.steamId}`;
      
      closeFlow();
    } catch (error) {
      console.error('Error sending invitation:', error);
      alert('Failed to open Steam profile. Please try again.');
    }
  }, [listingId, userSteamId, closeFlow]);

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
