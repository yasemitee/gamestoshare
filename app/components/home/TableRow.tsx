import React from 'react';
import { colors } from '@/lib/colors';
import { GameListingData } from '@/lib/db/types';

export const TableRow: React.FC<GameListingData> = ({
  user,
  showSteamId,
  location,
  platform,
  lookingFor,
  offering,
  postingDate,
}) => {
  const maxVisibleGames = 3;

  return (
    <div
      className="text-field-small grid grid-cols-6 items-center py-6 border-b hover:bg-opacity-50 transition-all"
      style={{
        borderColor: colors.gray2,
        gridTemplateColumns: '1.5fr 1fr 1fr 1.5fr 1.5fr 1fr',
      }}
    >
      <div style={{ color: colors.gray1 }}>
        {showSteamId && user ? user : 'Anonymous'}
      </div>

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
        {lookingFor.slice(0, maxVisibleGames).map((game, idx) => (
          <div
            key={idx}
            className="w-8 h-8 bg-cover bg-center flex-shrink-0"
            style={{
              backgroundImage: game.iconUrl ? `url(${game.iconUrl})` : 'none',
              backgroundColor: game.iconUrl ? 'transparent' : colors.gray2,
            }}
            title={game.name}
          />
        ))}
        {lookingFor.length > maxVisibleGames && (
          <span className="ml-1" style={{ color: colors.gray1 }}>
            +{lookingFor.length - maxVisibleGames}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1">
        {offering.slice(0, maxVisibleGames).map((game, idx) => (
          <div
            key={idx}
            className="w-8 h-8 bg-cover bg-center flex-shrink-0"
            style={{
              backgroundImage: game.iconUrl ? `url(${game.iconUrl})` : 'none',
              backgroundColor: game.iconUrl ? 'transparent' : colors.gray2,
            }}
            title={game.name}
          />
        ))}
        {offering.length > maxVisibleGames && (
          <span className="ml-1" style={{ color: colors.gray1 }}>
            +{offering.length - maxVisibleGames}
          </span>
        )}
      </div>

      <div style={{ color: colors.gray1 }}>{postingDate}</div>
    </div>
  );
};
