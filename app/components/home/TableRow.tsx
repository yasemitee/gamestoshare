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
  date,
}) => {
  return (
    <div
      className="h4 grid grid-cols-6 gap-4 items-center px-6 py-4 border-b hover:bg-opacity-50 transition-all"
      style={{
        borderColor: colors.gray3,
        backgroundColor: 'transparent',
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
          className="text-field-small px-3 py-1 rounded font-medium"
          style={{
            backgroundColor: colors.purple,
            color: colors.black,
          }}
        >
          {platform}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {games.map((game, idx) => (
          <GameIcon key={idx} color={game} />
        ))}
        <span className="ml-1" style={{ color: colors.gray1 }}>
          +{offering}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {games.slice(0, 3).map((game, idx) => (
          <GameIcon key={idx} color={game} />
        ))}
        <span className="ml-1" style={{ color: colors.gray1 }}>
          +{offering}
        </span>
      </div>

      <div className="text-right" style={{ color: colors.gray1 }}>
        {date}
      </div>
    </div>
  );
};
