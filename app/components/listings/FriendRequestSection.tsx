'use client';

import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { TermsCheckbox } from '@/components/ui/TermsCheckbox';
import { Button } from '@/components/ui/Button';
import { FieldError } from '@/components/ui/FieldError';
import { showGenericError } from '@/lib/utils/errors';

interface FriendRequestSectionProps {
  listingId: string;
  username: string | null;
}

export function FriendRequestSection({ listingId }: FriendRequestSectionProps) {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  // Sends the visitor to the poster's Steam profile, where the friend
  // request itself happens (in the Steam client when installed).
  const openPosterProfile = async () => {
    setIsOpening(true);
    try {
      const response = await fetch(`/api/listings/${listingId}`);
      const listing = await response.json();

      if (!response.ok || !listing?.steamId) {
        showGenericError();
        return;
      }

      const steamProfileUrl = /^\d{17}$/.test(listing.steamId)
        ? `https://steamcommunity.com/profiles/${listing.steamId}`
        : `https://steamcommunity.com/id/${listing.steamId}`;

      window.open(steamProfileUrl, '_blank');
      window.location.href = `steam://openurl/${steamProfileUrl}`;
    } catch (error) {
      console.error('Error opening Steam profile:', error);
      showGenericError();
    } finally {
      setIsOpening(false);
    }
  };

  const handleSendRequest = () => {
    setAttempted(true);
    if (!termsAccepted) return;
    openPosterProfile();
  };

  const termsError = attempted && !termsAccepted;

  return (
    <>
      <Toaster position="top-center" />
      <div>
        <TermsCheckbox
          checked={termsAccepted}
          onChange={setTermsAccepted}
          hasError={termsError}
        />
        {termsError && (
          <div className="flex justify-center -mt-5 mb-8">
            <FieldError message="Accept the terms to continue to Steam." />
          </div>
        )}
        <div className="mx-auto block w-fit glow-hover">
          <Button
            onClick={handleSendRequest}
            disabled={isOpening}
            className="px-6 py-2.5 text-button"
          >
            {isOpening ? 'OPENING STEAM…' : 'ADD ON STEAM'}
          </Button>
        </div>
      </div>
    </>
  );
}
