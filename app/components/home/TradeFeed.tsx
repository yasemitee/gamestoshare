import React, { useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { TradeFeedRow } from './TradeFeedRow';
import { colors } from '@/lib/colors';
import { COUNTRIES } from '@/lib/countries';
import { GameListingData } from '@/lib/db/types';

interface TradeFeedProps {
  data: GameListingData[];
  selectedLocation: string;
  isLoading?: boolean;
  onReachEnd?: () => void;
}

function countryName(code: string): string {
  if (!code) return 'All countries';
  return COUNTRIES.find((c) => c.code === code)?.name ?? code;
}

export const TradeFeed: React.FC<TradeFeedProps> = ({
  data,
  selectedLocation,
  isLoading = false,
  onReachEnd,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
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
        className="flex justify-between items-center pl-2 pr-5"
        style={{ marginBottom: 6 }}
      >
        <span style={{ ...headerLabelStyle, color: colors.white }}>
          Showing {countryName(selectedLocation)} · {data.length} swaps
        </span>
        <span style={{ ...headerLabelStyle, color: colors.gray1 }}>
          Sorted by newest
        </span>
      </div>

      {data.length === 0 ? (
        <div
          className="text-center py-12 text-field"
          style={{ color: colors.gray1 }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-3">
              <div
                className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                style={{ color: colors.purple }}
              />
              <span>Loading swaps...</span>
            </div>
          ) : (
            'No swaps found'
          )}
        </div>
      ) : (
        <div className="relative">
          <div
            ref={scrollRef}
            className="overflow-y-auto feed-scrollbar max-h-[60vh] md:max-h-[460px] pr-3"
            onScroll={handleScroll}
          >
            <AnimatePresence initial={false}>
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

          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center bg-[#0B0B0C]/45 pointer-events-none"
              >
                <div
                  className="flex items-center gap-3 px-4 py-2"
                  style={{ backgroundColor: colors.blue1 }}
                >
                  <div
                    className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                    style={{ color: colors.purple }}
                  />
                  <span className="text-field" style={{ color: colors.white }}>
                    Loading swaps...
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
