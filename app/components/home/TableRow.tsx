import React from 'react';
import { GameIcon } from './GameIcon';
import { colors } from '@/lib/colors';
import { GameListingData } from '@/lib/types';

export const TableRow: React.FC<GameListingData> = ({
  user,
  location,
  platform,
  games,
  offering,
  postingDate,
}) => {
  return (
    <div
      className="text-field-small grid grid-cols-6 items-center py-6 border-b hover:bg-opacity-50 transition-all"
      style={{
        borderColor: colors.gray2,
        gridTemplateColumns: '1.5fr 1fr 1fr 1.5fr 1.5fr 1fr',
      }}
    >
      <div style={{ color: colors.gray1 }}>{user}</div>

      <div className="flex items-center gap-2">
        <img
          src={`https://flagcdn.com/w20/${location.toLowerCase()}.png`}
          alt={location}
          className="w-5 h-4"
        />
        <span style={{ color: colors.gray1 }}>{location}</span>
      </div>

      <div>
        <span
          className="px-3 py-1.5"
          style={{
            backgroundColor: colors.purple,
            color: colors.black,
          }}
        >
          {platform}
        </span>
      </div>

      <div className="flex items-center gap-1">
        {games.map((game, idx) => (
          <GameIcon key={idx} color={game} />
        ))}
        <span className="ml-1" style={{ color: colors.gray1 }}>
          +{offering}
        </span>
      </div>

      <div className="flex items-center gap-1">
        {games.slice(0, 3).map((game, idx) => (
          <GameIcon key={idx} color={game} />
        ))}
        <span className="ml-1" style={{ color: colors.gray1 }}>
          +{offering}
        </span>
      </div>

      <div style={{ color: colors.gray1 }}>{postingDate}</div>
    </div>
  );
};
