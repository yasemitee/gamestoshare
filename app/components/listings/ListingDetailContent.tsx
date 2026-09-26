'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { colors } from '@/lib/colors';
import { MOTION } from '@/lib/constants';
import { GoBackButton } from '@/components/ui/GoBackButton';
import { GamesList } from './GamesList';
import { FriendRequestSection } from './FriendRequestSection';
import { ListingUserHeader } from './ListingUserHeader';
import { GamesModal, type GamesTab } from './GamesModal';

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
  const [galleryTab, setGalleryTab] = useState<GamesTab | null>(null);
  const ownerName =
    listing.showSteamId && listing.username ? listing.username : 'Anonymous';

  return (
    <div className="">
      {/* Go Back Button */}
      <motion.div
        initial={{ opacity: 0, y: MOTION.rise }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: MOTION.duration, ease: MOTION.ease, delay: 0 }}
        className="mb-14"
      >
        <GoBackButton />
      </motion.div>
      {/* Main Content */}
      <div className="flex flex-col">
        {/* Top Section - Avatar and User Info */}
        <motion.div
          initial={{ opacity: 0, y: MOTION.rise }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: MOTION.duration, ease: MOTION.ease, delay: 0.05 }}
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: MOTION.duration, delay: 0.1 }}
          style={{
            borderTop: `1px solid ${colors.gray2}`,
          }}
          className="mt-5 mb-6 md:mb-13"
        />
        {/* Content Section: Description | Games */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-22">
          {/* Left: Description */}
          <motion.div
            initial={{ opacity: 0, y: MOTION.rise }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: MOTION.duration, ease: MOTION.ease, delay: 0.1 }}
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
            initial={{ opacity: 0, y: MOTION.rise }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: MOTION.duration, ease: MOTION.ease, delay: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-9"
          >
            <GamesList
              title="WISHLIST"
              games={lookingForGames}
              onViewAll={() => setGalleryTab('wishlist')}
            />
            <GamesList
              title="LIBRARY"
              games={offeringGames}
              onViewAll={() => setGalleryTab('library')}
            />
          </motion.div>
        </div>
      </div>
      {/* Friend Request Section */}
      <motion.div
        initial={{ opacity: 0, y: MOTION.rise }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: MOTION.duration, ease: MOTION.ease, delay: 0.2 }}
        className="mt-14 md:mt-32"
      >
        <FriendRequestSection
          listingId={listing.id}
          username={listing.username}
        />
      </motion.div>
      <GamesModal
        open={galleryTab !== null}
        tab={galleryTab ?? 'wishlist'}
        onTabChange={setGalleryTab}
        onClose={() => setGalleryTab(null)}
        ownerName={ownerName}
        wishlist={lookingForGames}
        library={offeringGames}
      />
    </div>
  );
};
