import React from 'react';
import { TableRow } from './TableRow';
import { colors } from '@/lib/colors';
import { GameListingData } from '@/lib/types';

interface TableProps {
  data: GameListingData[];
}

export const Table: React.FC<TableProps> = ({ data }) => {
  return (
    <div
      className="rounded-lg overflow-hidden border"
      style={{
        backgroundColor: colors.black,
        borderColor: colors.gray3,
      }}
    >
      <div
        className="grid grid-cols-6 gap-4 px-6 py-3 text-xs uppercase tracking-wider border-b"
        style={{
          color: colors.gray1,
          borderColor: colors.gray3,
        }}
      >
        <div>User</div>
        <div>Location</div>
        <div>Plaform</div>
        <div>Looking for</div>
        <div>Offering</div>
        <div className="text-right">Date</div>
      </div>

      {data.map((row, idx) => (
        <TableRow key={idx} {...row} />
      ))}
    </div>
  );
};
