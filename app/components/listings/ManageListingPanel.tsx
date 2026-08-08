'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { colors } from '@/lib/colors';
import { clearManageToken } from '@/lib/utils/manageStorage';
import toast from 'react-hot-toast';

interface ManageListingPanelProps {
  listing: {
    id: string;
    username: string | null;
    showSteamId: boolean;
    description: string | null;
    location: string;
    games: Array<{
      type: 'LOOKING_FOR' | 'OFFERING';
      game: { name: string };
    }>;
  };
  token: string;
  onDeleted: () => void;
}

export function ManageListingPanel({
  listing,
  token,
  onDeleted,
}: ManageListingPanelProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const offeringNames = listing.games
    .filter((g) => g.type === 'OFFERING')
    .map((g) => g.game.name);
  const lookingForNames = listing.games
    .filter((g) => g.type === 'LOOKING_FOR')
    .map((g) => g.game.name);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/listings/${listing.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        toast.error('Failed to delete listing.', {
          style: { background: colors.blue1, color: colors.white },
        });
        return;
      }

      clearManageToken(listing.id);
      toast.success('Listing deleted.', {
        style: { background: colors.blue1, color: colors.white },
      });
      onDeleted();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="text-white">
      <p style={{ color: colors.gray1 }}>
        {listing.username || 'Your listing'} — {listing.location}
      </p>
      {listing.description && <p className="my-4">{listing.description}</p>}
      <p style={{ color: colors.gray1 }} className="mb-2">
        Offering: {offeringNames.join(', ') || 'none'}
      </p>
      <p style={{ color: colors.gray1 }} className="mb-8">
        Looking for: {lookingForNames.join(', ') || 'none'}
      </p>

      {isConfirmingDelete ? (
        <div className="flex gap-4 items-center">
          <span>Delete this listing permanently?</span>
          <Button
            variant="secondary"
            onClick={() => setIsConfirmingDelete(false)}
            disabled={isDeleting}
          >
            CANCEL
          </Button>
          <Button
            variant="primary"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'DELETING...' : 'CONFIRM DELETE'}
          </Button>
        </div>
      ) : (
        <div className="flex gap-4">
          <Button
            variant="secondary"
            onClick={() => {
              window.location.href = `/listings/create?edit=${listing.id}`;
            }}
          >
            MODIFICA
          </Button>
          <Button
            variant="primary"
            onClick={() => setIsConfirmingDelete(true)}
          >
            ELIMINA
          </Button>
        </div>
      )}
    </div>
  );
}
