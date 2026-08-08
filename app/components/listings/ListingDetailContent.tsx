'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { colors } from '@/lib/colors';
import { GoBackButton } from '@/components/ui/GoBackButton';
import { Button } from '@/components/ui/Button';
import { GamesList } from './GamesList';
import { FriendRequestSection } from './FriendRequestSection';
import { ListingUserHeader } from './ListingUserHeader';
import { ManageAccessModal } from '@/components/verification/ManageAccessModal';
import { ManageListingPanel } from './ManageListingPanel';
import { getManageToken } from '@/lib/utils/manageStorage';

interface Game {
  id: string;
  name: string;
  steamAppId: number;
  iconUrl: string | null;
  headerImage: string | null;
  releaseYear: number | null;
  priceInCents: number | null;
}

interface ListingDetailContentProps {
  listing: {
    id: string;
    username: string | null;
    showSteamId: boolean;
    avatarUrl: string | null;
    location: string;
    steamLevel: number | null;
    accountYears: number | null;
    description: string | null;
  };
  lookingForGames: Game[];
  offeringGames: Game[];
  postingDate: string;
}

export const ListingDetailContent: React.FC<ListingDetailContentProps> = ({
  listing,
  lookingForGames,
  offeringGames,
  postingDate,
}) => {
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [managedListing, setManagedListing] = useState<{
    token: string;
    listing: any;
  } | null>(null);
  const [hasCheckedCache, setHasCheckedCache] = useState(false);

  useEffect(() => {
    const cached = getManageToken(listing.id);
    if (cached) {
      fetch('/api/listings/manage', {
        headers: { Authorization: `Bearer ${cached.token}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.listing) {
            setManagedListing({ token: cached.token, listing: data.listing });
          }
        })
        .finally(() => setHasCheckedCache(true));
    } else {
      setHasCheckedCache(true);
    }
  }, [listing.id]);

  return (
    <div className="">
      {/* Go Back Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-14"
      >
        <GoBackButton />
      </motion.div>
      {/* Main Content */}
      <div className="flex flex-col">
        {/* Top Section - Avatar and User Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <ListingUserHeader
            username={listing.username}
            showSteamId={listing.showSteamId}
            avatarUrl={listing.avatarUrl}
            location={listing.location}
            steamLevel={listing.steamLevel}
            accountYears={listing.accountYears}
          />
        </motion.div>
        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            borderTop: `1px solid ${colors.gray2}`,
          }}
          className="mt-5 mb-6 md:mb-13"
        />
        {/* Content Section: Description | Games */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-22">
          {/* Left: Description */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="flex items-center gap-4 pb-4 md:mb-8">
              <p className="text-small-title" style={{ color: colors.white }}>
                DESCRIPTION
              </p>
              <span
                className="text-field-small"
                style={{ color: colors.gray1 }}
              >
                {postingDate}
              </span>
            </div>
            <p className="text-field-small" style={{ color: colors.gray1 }}>
              {listing.description || 'No description provided.'}
            </p>
          </motion.div>
          {/* Right: Games Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-9"
          >
            <GamesList title="WISHLIST" games={lookingForGames} />
            <GamesList title="LIBRARY" games={offeringGames} />
          </motion.div>
        </div>
      </div>
      {/* Friend Request Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="mt-14 md:mt-32"
      >
        <FriendRequestSection
          listingId={listing.id}
          username={listing.username}
        />
      </motion.div>
      <div className="mt-16">
        {managedListing ? (
          <ManageListingPanel
            listing={managedListing.listing}
            token={managedListing.token}
            onDeleted={() => {
              window.location.href = '/';
            }}
          />
        ) : (
          hasCheckedCache && (
            <Button
              variant="secondary"
              onClick={() => setIsManageModalOpen(true)}
            >
              È IL TUO ANNUNCIO?
            </Button>
          )
        )}
      </div>

      <ManageAccessModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        listingId={listing.id}
        onVerified={({ token, listing: fullListing }) => {
          setManagedListing({ token, listing: fullListing });
        }}
      />
    </div>
  );
};
