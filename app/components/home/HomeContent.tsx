'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { Table } from '@/components/home/Table';
import { FAQItem } from '@/components/home/FAQItem';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { Footer } from '@/components/layout/Footer';
import { GradientTitle } from '@/components/ui/GradientTitle';
import { GameListingData } from '@/lib/db/types';
import { colors } from '@/lib/colors';
import { MAX_LISTINGS_PER_PAGE } from '@/lib/constants';
import { formatTimeAgo } from '@/lib/utils/time';

interface Game {
  appId: number;
  name: string;
  iconUrl: string;
}

interface ListingsApiGame {
  type: 'LOOKING_FOR' | 'OFFERING';
  game: {
    name?: string | null;
    iconUrl?: string | null;
  };
}

interface ListingsApiItem {
  id: string;
  username: string | null;
  steamId: string | null;
  showSteamId: boolean;
  location: string;
  platform: string;
  createdAt: string;
  games?: ListingsApiGame[];
}

interface ListingsApiResponse {
  items: ListingsApiItem[];
  nextCursor: string | null;
}

interface HomeContentProps {
  initialListings: GameListingData[];
  initialNextCursor?: string | null;
}

function mapListingToTableData(listing: ListingsApiItem): GameListingData {
  const allGames = listing.games || [];

  const lookingForGames = allGames
    .filter((lg) => lg.type === 'LOOKING_FOR')
    .map((lg) => ({
      iconUrl: lg.game?.iconUrl || '',
      name: lg.game?.name || '',
    }));

  const offeringGames = allGames
    .filter((lg) => lg.type === 'OFFERING')
    .map((lg) => ({
      iconUrl: lg.game?.iconUrl || '',
      name: lg.game?.name || '',
    }));

  return {
    id: listing.id,
    user: listing.showSteamId ? listing.username || listing.steamId : null,
    steamId: listing.steamId || '',
    showSteamId: listing.showSteamId,
    location: listing.location,
    platform: listing.platform,
    lookingFor: lookingForGames,
    offering: offeringGames,
    postingDate: formatTimeAgo(listing.createdAt),
  };
}

function mapListingsToTableData(listings: ListingsApiItem[]): GameListingData[] {
  return listings.map(mapListingToTableData);
}

export function HomeContent({
  initialListings,
  initialNextCursor = null,
}: HomeContentProps) {
  const [listings, setListings] = useState<GameListingData[]>(initialListings);
  const [nextCursor, setNextCursor] = useState<string | null>(
    initialNextCursor
  );
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showLoadMoreLink, setShowLoadMoreLink] = useState(false);
  const hasMountedRef = useRef(false);

  const fetchListings = useCallback(
    async ({ cursor, append }: { cursor?: string | null; append?: boolean }) => {
      const isAppend = Boolean(append);
      if (!isAppend) {
        setShowLoadMoreLink(false);
      }
      if (isAppend) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      setHasError(false);

      try {
        const params = new URLSearchParams();
        params.set('limit', MAX_LISTINGS_PER_PAGE.toString());
        if (cursor) {
          params.set('cursor', cursor);
        }
        if (selectedLocation) {
          params.set('location', selectedLocation);
        }
        const trimmedSearch = searchTerm.trim();
        if (trimmedSearch) {
          params.set('search', trimmedSearch);
        }

        const response = await fetch(`/api/listings?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch listings');
        }

        const data = (await response.json()) as
          | ListingsApiResponse
          | ListingsApiItem[];
        const items = Array.isArray(data) ? data : data.items || [];
        const mapped = mapListingsToTableData(items);

        setListings((prev) => (isAppend ? [...prev, ...mapped] : mapped));
        setNextCursor(Array.isArray(data) ? null : data.nextCursor ?? null);
      } catch (error) {
        console.error('Error fetching listings:', error);
        setHasError(true);
        if (!isAppend) {
          setListings([]);
          setNextCursor(null);
        }
      } finally {
        if (isAppend) {
          setIsLoadingMore(false);
        } else {
          setIsLoading(false);
        }
      }
    },
    [selectedLocation, searchTerm]
  );

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    const timeoutId = setTimeout(() => {
      fetchListings({ append: false });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [selectedLocation, searchTerm, fetchListings]);

  const handleGameSelect = useCallback((game: Game | null) => {
    if (!game) {
      setSearchTerm('');
      return;
    }
    setSearchTerm(game.appId.toString());
  }, []);

  const handleSearchTermChange = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (!nextCursor || isLoadingMore) {
      return;
    }
    setShowLoadMoreLink(false);
    await fetchListings({ cursor: nextCursor, append: true });
  }, [nextCursor, isLoadingMore, fetchListings]);

  const handleReachTableEnd = useCallback(() => {
    if (nextCursor) {
      setShowLoadMoreLink(true);
    }
  }, [nextCursor]);

  return (
    <>
      <HeroSection
        onGameSelect={handleGameSelect}
        onSearchTermChange={handleSearchTermChange}
        onLocationChange={setSelectedLocation}
        selectedLocation={selectedLocation}
      />
      <Table
        data={listings}
        isLoading={isLoading}
        onReachEnd={handleReachTableEnd}
      />
      {hasError && (
        <div
          className="text-center mt-4 text-field"
          style={{ color: colors.gray1 }}
        >
          Could not load listings. Please try again.
        </div>
      )}
      {nextCursor && showLoadMoreLink && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore || isLoading}
            className="text-navbar flex items-center gap-2 cursor-pointer transition-colors hover:!text-white disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ color: colors.gray1 }}
          >
            <span>{isLoadingMore ? 'Loading...' : 'Load more listings'}</span>
            {isLoadingMore ? (
              <div
                className="w-3 h-3 border border-t-transparent rounded-full animate-spin"
                style={{ color: colors.gray1 }}
              />
            ) : (
              <img
                src="/Dropdown.svg"
                alt=""
                className="w-3 h-3 pt-1 transition-[filter] brightness-[0.6]"
              />
            )}
          </button>
        </div>
      )}
      <div className="mt-32">
        <GradientTitle className="text-center mb-4">FAQ</GradientTitle>
        <div
          className="mb-12 text-small-title upper text-center"
          style={{ color: colors.gray1 }}
        >
          <p>
            This information refers to Steam’s own features. GTS only helps
            users connect
          </p>
          <p className="text-small-title upper text-center mt-1">
            it does not provide Family Sharing
          </p>
        </div>
        <div className="mx-auto">
          <FAQItem
            question="HOW DO I ENABLE FAMILY SHARING?"
            answer="Log into Steam > Settings > Family > Authorize Library Sharing on this device."
          />
          <FAQItem
            question="HOW CAN I ADD PEOPLE TO MY STEAM FAMILY?"
            answer="You need to be friends first. You will see the eligible accounts under Settings > Family."
          />
          <FAQItem
            question="IS THERE A LIMIT TO THE NUMBER OF ACCOUNTS I CAN SHARE MY LIBRARY WITH?"
            answer="Yes, a Family Library can be shared with up to 5 accounts and up to 10 devices in 90 days."
          />
          <FAQItem
            question="CAN I SHARE A SPECIFIC GAME?"
            answer="Yes, you can share a specific game by flagging all the other games as private. This is a Steam feature and is not provided or managed by GTS."
          />
          <FAQItem
            question="CAN I GET BANNED FROM FAMILY SHARING?"
            answer="Offline and solo games are 100% safe, but you can get a VAC ban if your copy is used to cheat in a multiplayer game protected by Valve Anti-Cheat (VAC). Only the cheater and the owner of the copy will be affected by the ban. "
          />
        </div>
      </div>

      {/* Discord CTA */}
      <div className="mt-16 text-center">
        <h2 className="mb-4" style={{ color: colors.white }}>
          Still unsure?
        </h2>
        <p
          className="text-small-title mb-8"
          style={{ color: colors.gray1, lineHeight: '24px' }}
        >
          JOIN OUR COMMUNITY ON DISCORD AND GET TO KNOW US
        </p>
        <AnimatedButton
          href="https://discord.gg/mavhKaDRCv"
          className="inline-flex items-center gap-1.5 text-button"
        >
          <img src="/Discord.svg" alt="Discord" width={16} height={16} />
          <span className="text-button">JOIN OUR SERVER</span>
        </AnimatedButton>
      </div>
      <Footer />
    </>
  );
}
