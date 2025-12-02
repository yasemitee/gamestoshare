import React from 'react';
import Link from 'next/link';
import { colors } from '@/lib/colors';
import { GameListingData } from '@/lib/db/types';

export const TableRow: React.FC<GameListingData> = ({
  id,
  user,
  showSteamId,
  location,
  platform,
  lookingFor,
  offering,
  postingDate,
}) => {
  return (
    <Link
      href={`/listings/${id}`}
      className="text-field-small grid items-center py-6 border-b hover:bg-opacity-50 transition-all cursor-pointer table-row-grid"
      style={{
        borderColor: colors.gray2,
        gridTemplateColumns: '1.4fr 1fr 1fr',
      }}
    >
      <style>{`
        @media (min-width: 768px) {
          .table-row-grid {
            grid-template-columns: 1.5fr 1fr 1.5fr 1.5fr 120px !important;
          }
        }
      `}</style>
      <div className="flex items-center gap-2 truncate pr-10">
        <span className="truncate" style={{ color: colors.gray1 }}>
          {showSteamId && user ? user : 'Anonymous'}
        </span>
        <img
          src={`https://flagcdn.com/${location.toLowerCase()}.svg`}
          alt={location}
          className="w-5 h-4 flex-shrink-0 md:hidden"
        />
      </div>

      <div className="hidden md:flex items-center gap-2 min-w-0 md:pl-1">
        <img
          src={`https://flagcdn.com/${location.toLowerCase()}.svg`}
          alt={location}
          className="w-5 h-4 flex-shrink-0"
        />
        <span className="truncate" style={{ color: colors.gray1 }}>
          {location}
        </span>
      </div>

      <div className="flex items-center gap-1">
        {lookingFor.slice(0, 3).map((game, idx) => (
          <div
            key={idx}
            className="w-8 h-8 bg-cover bg-center flex-shrink-0 hidden md:block"
            style={{
              backgroundImage: game.iconUrl ? `url(${game.iconUrl})` : 'none',
              backgroundColor: game.iconUrl ? 'transparent' : colors.gray2,
            }}
            title={game.name}
          />
        ))}
        {lookingFor.slice(0, 2).map((game, idx) => (
          <div
            key={idx}
            className="w-8 h-8 bg-cover bg-center flex-shrink-0 md:hidden"
            style={{
              backgroundImage: game.iconUrl ? `url(${game.iconUrl})` : 'none',
              backgroundColor: game.iconUrl ? 'transparent' : colors.gray2,
            }}
            title={game.name}
          />
        ))}
        <span className="ml-1 hidden md:inline" style={{ color: colors.gray1 }}>
          {lookingFor.length > 3 && `+${lookingFor.length - 3}`}
        </span>
        <span className="ml-1 md:hidden" style={{ color: colors.gray1 }}>
          {lookingFor.length > 2 && `+${lookingFor.length - 2}`}
        </span>
      </div>

      <div className="flex items-center gap-1">
        {offering.slice(0, 3).map((game, idx) => (
          <div
            key={idx}
            className="w-8 h-8 bg-cover bg-center flex-shrink-0 hidden md:block"
            style={{
              backgroundImage: game.iconUrl ? `url(${game.iconUrl})` : 'none',
              backgroundColor: game.iconUrl ? 'transparent' : colors.gray2,
            }}
            title={game.name}
          />
        ))}
        {offering.slice(0, 2).map((game, idx) => (
          <div
            key={idx}
            className="w-8 h-8 bg-cover bg-center flex-shrink-0 md:hidden"
            style={{
              backgroundImage: game.iconUrl ? `url(${game.iconUrl})` : 'none',
              backgroundColor: game.iconUrl ? 'transparent' : colors.gray2,
            }}
            title={game.name}
          />
        ))}
        <span className="ml-1 hidden md:inline" style={{ color: colors.gray1 }}>
          {offering.length > 3 && `+${offering.length - 3}`}
        </span>
        <span className="ml-1 md:hidden" style={{ color: colors.gray1 }}>
          {offering.length > 2 && `+${offering.length - 2}`}
        </span>
      </div>

      <div className="hidden md:block" style={{ color: colors.gray1 }}>
        {postingDate}
      </div>
    </Link>
  );
};
