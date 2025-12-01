import { useState, useCallback } from 'react';

interface UseVerificationReturn {
  isVerificationOpen: boolean;
  openVerification: () => void;
  closeVerification: () => void;
  confirmVerification: () => Promise<boolean>;
}

export function useVerification(steamId?: string): UseVerificationReturn {
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const verificationCode = 'GTS';

  const openVerification = useCallback(() => {
    setIsVerificationOpen(true);
  }, []);

  const closeVerification = useCallback(() => {
    setIsVerificationOpen(false);
  }, []);

  const confirmVerification = useCallback(async (): Promise<boolean> => {
    if (!steamId || !verificationCode) {
      return false;
    }

    try {
      const response = await fetch('/api/steam/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          steamId,
          verificationCode,
        }),
      });

      if (!response.ok) {
        throw new Error('Verification failed');
      }

      const data = await response.json();
      
      if (data.verified) {
        setIsVerificationOpen(false);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Verification error:', error);
      return false;
    }
  }, [steamId, verificationCode]);

  return {
    isVerificationOpen,
    openVerification,
    closeVerification,
    confirmVerification,
  };
}
