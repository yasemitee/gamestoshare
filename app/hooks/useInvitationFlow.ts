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
        if (typeof window !== 'undefined' && (window as any).showVerificationError) {
          (window as any).showVerificationError();
        }
      }
    } catch (error) {
      console.error('Verification error:', error);
      if (typeof window !== 'undefined' && (window as any).showVerificationErrorGeneric) {
        (window as any).showVerificationErrorGeneric();
      }
    }
  }, [userSteamId]);

  const goToCongratulations = useCallback(
    async (steamId: string) => {
      setIsLoading(true);
      setHasNoMatch(false);
      setMatchedGame(null);
      
      try {
        const cleanSteamId = extractCleanSteamId(steamId);
        
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
          if (typeof window !== 'undefined' && (window as any).showVerificationError) {
            (window as any).showVerificationError();
          }
          return;
        }

        setUserSteamId(cleanSteamId);

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
        if (typeof window !== 'undefined' && (window as any).showVerificationErrorGeneric) {
          (window as any).showVerificationErrorGeneric();
        }
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const sendInvitation = useCallback(async () => {
    try {
      if (!userSteamId) {
        if (typeof window !== 'undefined' && (window as any).showSteamIdNotFound) {
          (window as any).showSteamIdNotFound();
        }
        return;
      }

      const listingResponse = await fetch(`/api/listings/${listingId}`);
      const listingData = await listingResponse.json();
      
      if (!listingData?.steamId) {
        if (typeof window !== 'undefined' && (window as any).showListingOwnerNotFound) {
          (window as any).showListingOwnerNotFound();
        }
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
      if (typeof window !== 'undefined' && (window as any).showProfileOpenError) {
        (window as any).showProfileOpenError();
      }
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
