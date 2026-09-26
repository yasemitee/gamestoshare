'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/Button';
import { colors, gradients } from '@/lib/colors';
import { MOTION } from '@/lib/constants';
import { clearManageToken } from '@/lib/utils/manageStorage';
import { GamesList } from './GamesList';
import { ListingUserHeader } from './ListingUserHeader';
import toast from 'react-hot-toast';

interface Game {
  id: string;
  name: string;
  headerImage: string | null;
  iconUrl: string | null;
  steamAppId: number;
}

interface ManageListingPanelProps {
  listing: {
    id: string;
    username: string | null;
    showSteamId: boolean;
    avatarUrl: string | null;
    location: string;
    steamLevel: number | null;
    accountYears: number | null;
    description: string | null;
    games: Array<{
      type: 'LOOKING_FOR' | 'OFFERING';
      game: Game;
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

  const offeringGames = listing.games
    .filter((g) => g.type === 'OFFERING')
    .map((g) => g.game);
  const lookingForGames = listing.games
    .filter((g) => g.type === 'LOOKING_FOR')
    .map((g) => g.game);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/listings/${listing.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        toast.error('Couldn’t delete your listing. Please try again.', {
          style: { background: colors.gray3, color: colors.white },
        });
        return;
      }

      clearManageToken(listing.id);
      toast.success('Listing deleted.', {
        style: { background: colors.gray3, color: colors.white },
      });
      onDeleted();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: MOTION.rise }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: MOTION.duration, ease: MOTION.ease, delay: 0 }}
    >
      {/* User header: same layout as the public listing page */}
      <ListingUserHeader
        username={listing.username}
        showSteamId={listing.showSteamId}
        avatarUrl={listing.avatarUrl}
        location={listing.location}
        steamLevel={listing.steamLevel}
        accountYears={listing.accountYears}
        shareUrl={`/listings/${listing.id}`}
      />

      {/* Divider */}
      <div
        style={{ borderTop: `1px solid ${colors.gray2}` }}
        className="mt-5 mb-6 md:mb-13"
      />

      {/* Description | Games */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-22">
        <div>
          <p
            className="text-small-title pb-4 md:mb-8"
            style={{ color: colors.white }}
          >
            DESCRIPTION
          </p>
          <p className="text-field-small" style={{ color: colors.gray1 }}>
            {listing.description || 'No description provided.'}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-9">
          <GamesList title="WISHLIST" games={lookingForGames} />
          <GamesList title="LIBRARY" games={offeringGames} />
        </div>
      </div>

      {/* Actions */}
      <div
        style={{ borderTop: `1px solid ${colors.gray2}` }}
        className="mt-10 md:mt-14 pt-8 flex flex-col sm:flex-row sm:items-center gap-4"
      >
        {isConfirmingDelete ? (
          <>
            <p
              className="text-field-small flex-1"
              style={{ color: colors.white }}
            >
              Delete this listing permanently? This can&apos;t be undone.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                variant="secondary"
                onClick={() => setIsConfirmingDelete(false)}
                disabled={isDeleting}
              >
                CANCEL
              </Button>
              <DeleteButton onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? 'DELETING…' : 'DELETE FOREVER'}
              </DeleteButton>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href={`/listings/create?edit=${listing.id}`}
                className="text-button px-6 py-2.5 text-center transition-opacity hover:opacity-90"
                style={{ background: gradients.main, color: colors.black }}
              >
                EDIT LISTING
              </Link>
              <DeleteButton onClick={() => setIsConfirmingDelete(true)}>
                DELETE LISTING
              </DeleteButton>
            </div>
            <Link
              href={`/listings/${listing.id}`}
              className="sm:ml-auto self-start sm:self-auto uppercase transition-colors hover:!text-[#C3C2F5]"
              style={{
                fontSize: 11,
                letterSpacing: '.08em',
                color: colors.white,
                borderBottom: `1px solid ${colors.purple}`,
                paddingBottom: 2,
              }}
            >
              View public listing
            </Link>
          </>
        )}
      </div>
    </motion.div>
  );
}

// Ember Maroon fill: DESIGN.md reserves it for destructive controls.
function DeleteButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="text-button px-6 py-2.5 transition-opacity hover:opacity-85 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        backgroundColor: colors.red,
        color: colors.white,
        border: '1px solid rgba(221, 79, 79, 0.35)',
      }}
    >
      {children}
    </button>
  );
}
