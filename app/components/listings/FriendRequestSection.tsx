'use client';

import { useState } from 'react';
import { TermsCheckbox } from '@/components/ui/TermsCheckbox';
import { Button } from '@/components/ui/Button';

interface FriendRequestSectionProps {
  listingId: string;
  username: string | null;
}

export function FriendRequestSection({
  listingId,
  username,
}: FriendRequestSectionProps) {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendRequest = async () => {
    if (!termsAccepted) return;

    setIsSubmitting(true);
    try {
      // TODO: Implement friend request API
      console.log('Sending friend request for listing:', listingId);
      alert('Friend request sent!');
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert('Failed to send friend request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8">
      <TermsCheckbox checked={termsAccepted} onChange={setTermsAccepted} />
      <Button
        onClick={handleSendRequest}
        disabled={!termsAccepted || isSubmitting}
        className="mx-auto block px-6 py-2.5 text-button"
      >
        {isSubmitting ? 'SENDING...' : 'SEND INVITATION'}
      </Button>
    </div>
  );
}
