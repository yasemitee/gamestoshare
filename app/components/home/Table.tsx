import React from 'react';
import { TableRow } from './TableRow';
import { colors } from '@/lib/colors';
import { GameListingData } from '@/lib/db/types';

interface TableProps {
  data: GameListingData[];
  isLoading?: boolean;
  onReachEnd?: () => void;
}

export const Table: React.FC<TableProps> = ({
  data,
  isLoading = false,
  onReachEnd,
}) => {
  const handleScroll: React.UIEventHandler<HTMLDivElement> = (event) => {
    if (!onReachEnd) {
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 8;
    if (isAtBottom) {
      onReachEnd();
    }
  };

  return (
    <div>
      {/* Table Header */}
      <div
        className="text-small-title py-6 uppercase grid"
        style={{
          color: colors.white,
          gridTemplateColumns: '1.4fr 1.2fr 1.2fr',
        }}
      >
        <style>{`
          @media (min-width: 768px) {
            .text-small-title {
              grid-template-columns: 1.5fr 1fr 1.5fr 1.5fr 120px !important;
            }
          }
        `}</style>
        <div className="pl-2">User</div>
        <div className="hidden md:block">Location</div>
        <div>Wishlist</div>
        <div>Library</div>
        <div className="hidden md:block">Posted</div>
      </div>
      {/* Table Body */}
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
              <span>Loading listings...</span>
            </div>
          ) : (
            'No listings found'
          )}
        </div>
      ) : (
        <div className="relative">
          <div
            className="overflow-y-auto custom-scrollbar max-h-[40vh] md:max-h-[400px]"
            onScroll={handleScroll}
          >
            {data.map((row, idx) => (
              <TableRow key={row.id} index={idx} {...row} />
            ))}
          </div>

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0B0B0C]/45 pointer-events-none">
              <div className="flex items-center gap-3 px-4 py-2" style={{ backgroundColor: colors.blue1 }}>
                <div
                  className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                  style={{ color: colors.purple }}
                />
                <span className="text-field" style={{ color: colors.white }}>
                  Loading listings...
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
