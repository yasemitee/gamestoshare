import React from 'react';
import { TableRow } from './TableRow';
import { colors } from '@/lib/colors';
import { GameListingData } from '@/lib/db/types';

interface TableProps {
  data: GameListingData[];
}

export const Table: React.FC<TableProps> = ({ data }) => {
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
        <div>Looking for</div>
        <div>Offering</div>
        <div className="hidden md:block">Posted</div>
      </div>
      {/* Table Body */}
      {data.length === 0 ? (
        <div
          className="text-center py-12 text-field"
          style={{ color: colors.gray1 }}
        >
          No listings found
        </div>
      ) : (
        <div className="overflow-y-auto custom-scrollbar max-h-[40vh] md:max-h-[400px]">
          {data.map((row, idx) => (
            <TableRow key={idx} index={idx} {...row} />
          ))}
        </div>
      )}
    </div>
  );
};
