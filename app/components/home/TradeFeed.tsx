import React, { useRef } from 'react';
import Link from 'next/link';
import { AnimatePresence } from 'motion/react';
import { TradeFeedRow } from './TradeFeedRow';
import { colors } from '@/lib/colors';
import { COUNTRIES } from '@/lib/countries';
import { GameListingData } from '@/lib/db/types';

interface TradeFeedProps {
  data: GameListingData[];
  totalCount?: number;
  selectedLocation: string;
  isLoading?: boolean;
  onReachEnd?: () => void;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
}

function countryName(code: string): string {
  if (!code) return 'All countries';
  return COUNTRIES.find((c) => c.code === code)?.name ?? code;
}

const shimmer = 'motion-safe:animate-pulse';
const skeletonTone = { backgroundColor: 'rgba(255,255,255,.06)' };

// Mirrors TradeFeedRow's geometry so the feed doesn't jump when data lands.
const SkeletonRow: React.FC<{ first?: boolean }> = ({ first }) => (
  <div
    aria-hidden="true"
    className="flex flex-col md:flex-row md:items-center gap-4 md:gap-5"
    style={{
      padding: '18px 8px',
      borderTop: first ? 'none' : '1px solid rgba(255,255,255,.07)',
    }}
  >
    <div className="flex items-center gap-4 md:contents">
      <div className="flex items-center gap-3 md:w-[210px] md:flex-shrink-0">
        <div
          className={`w-10 h-10 rounded-full flex-shrink-0 ${shimmer}`}
          style={skeletonTone}
        />
        <div className="space-y-2">
          <div className={`h-3 w-24 ${shimmer}`} style={skeletonTone} />
          <div className={`h-2 w-16 ${shimmer}`} style={skeletonTone} />
        </div>
      </div>
      <div className="flex-1 flex justify-end md:justify-start gap-1 md:gap-10">
        {[0, 1].map((group) => (
          <div
            key={group}
            className={`gap-1 ${group === 1 ? 'hidden md:flex' : 'flex'}`}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-16 h-[30px] ${i === 2 ? 'hidden md:block' : ''} ${shimmer}`}
                style={skeletonTone}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
    <div className="md:w-24 md:flex-shrink-0 flex md:flex-col md:items-end justify-between gap-2">
      <div className={`h-2 w-16 ${shimmer}`} style={skeletonTone} />
      <div className={`h-2 w-8 ${shimmer}`} style={skeletonTone} />
    </div>
  </div>
);

export const TradeFeed: React.FC<TradeFeedProps> = ({
  data,
  totalCount,
  selectedLocation,
  isLoading = false,
  onReachEnd,
  scrollRef: externalScrollRef,
}) => {
  const internalScrollRef = useRef<HTMLDivElement>(null);
  const scrollRef = externalScrollRef ?? internalScrollRef;
  const handleScroll: React.UIEventHandler<HTMLDivElement> = (event) => {
    if (!onReachEnd) return;
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 8) {
      onReachEnd();
    }
  };

  const headerLabelStyle: React.CSSProperties = {
    fontSize: 12,
    letterSpacing: '.08em',
    textTransform: 'uppercase',
  };

  return (
    <div style={{ marginTop: 56 }}>
      <div
        className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 pl-2 pr-5"
        style={{ marginBottom: 6 }}
      >
        <span style={{ ...headerLabelStyle, color: colors.white }}>
          {countryName(selectedLocation)}
          {!isLoading && (
            <>
              {' · '}
              {totalCount ?? data.length}{' '}
              {(totalCount ?? data.length) === 1 ? 'listing' : 'listings'}
            </>
          )}
        </span>
        <span style={{ ...headerLabelStyle, color: colors.gray1 }}>
          Sorted by newest
        </span>
      </div>

      {/* Old rows would sit under the new country's header, so swap them out. */}
      {isLoading ? (
        <div role="status" aria-label="Loading listings">
          {[0, 1, 2, 3].map((i) => (
            <SkeletonRow key={i} first={i === 0} />
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-14">
          <p className="text-field mb-5" style={{ color: colors.gray1 }}>
            {selectedLocation
              ? `No listings in ${countryName(selectedLocation)} yet.`
              : 'No listings yet.'}
          </p>
          <Link
            href="/listings/create"
            className="uppercase transition-colors hover:!text-[#C3C2F5]"
            style={{
              fontSize: 11,
              letterSpacing: '.08em',
              color: colors.white,
              borderBottom: `1px solid ${colors.purple}`,
              paddingBottom: 2,
            }}
          >
            Create a post
          </Link>
        </div>
      ) : (
        <div className="relative">
          <div
            ref={scrollRef}
            className="overflow-y-auto feed-scrollbar max-h-[60vh] md:max-h-[460px] pr-3"
            onScroll={handleScroll}
            style={{
              WebkitMaskImage:
                'linear-gradient(to bottom, #000 calc(100% - 64px), transparent 100%)',
              maskImage:
                'linear-gradient(to bottom, #000 calc(100% - 64px), transparent 100%)',
            }}
          >
            <AnimatePresence>
              {data.map((row, idx) => (
                <TradeFeedRow
                  key={row.id}
                  first={idx === 0}
                  index={idx}
                  scrollRoot={scrollRef}
                  {...row}
                />
              ))}
            </AnimatePresence>
          </div>

        </div>
      )}
    </div>
  );
};
