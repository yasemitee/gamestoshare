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
        className="text-small-title grid py-6 uppercase"
        style={{
          color: colors.white,
          gridTemplateColumns: '1.5fr 1fr 1fr 1.5fr 1.5fr 1fr',
        }}
      >
        <div>User</div>
        <div>Location</div>
        <div>Platform</div>
        <div>Looking for</div>
        <div>Offering</div>
        <div>Posted</div>
      </div>
      {/* Table Body */}
      <div className="overflow-y-auto custom-scrollbar max-h-[40vh] md:max-h-[400px]">
        {data.map((row, idx) => (
          <TableRow key={idx} {...row} />
        ))}
      </div>
    </div>
  );
};
