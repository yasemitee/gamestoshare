'use client';

import { colors } from '@/lib/colors';
import { GameImage } from './GameImage';

interface Game {
  id: string;
  name: string;
  headerImage: string | null;
  iconUrl: string | null;
  steamAppId: number;
}

interface GamesListProps {
  title: string;
  games: Game[];
  /** Opens the full gallery; the link only shows when this is provided. */
  onViewAll?: () => void;
}

export function GamesList({ title, games, onViewAll }: GamesListProps) {
  const scrolls = games.length > 3;

  return (
    <div className="min-w-0">
      <div className="pb-5">
        <p
          className="text-small-title flex justify-between items-center"
          style={{ color: colors.white }}
        >
          {title}
          <span className="flex items-center gap-3">
            <span style={{ color: colors.gray1 }}>
              {games.length} {games.length === 1 ? 'GAME' : 'GAMES'}
            </span>
            {onViewAll && games.length > 0 && (
              <button
                type="button"
                onClick={onViewAll}
                aria-label={`View all ${title.toLowerCase()} games`}
                className="uppercase cursor-pointer transition-colors hover:!text-[#C3C2F5]"
                style={{
                  color: colors.white,
                  borderBottom: `1px solid ${colors.purple}`,
                  paddingBottom: 2,
                }}
              >
                View all
              </button>
            )}
          </span>
        </p>
      </div>

      {games.length === 0 ? (
        <p className="text-field-small py-6" style={{ color: colors.gray1 }}>
          No games listed.
        </p>
      ) : (
        <div
          className={`flex md:flex-col gap-2 overflow-x-auto md:overflow-x-hidden overflow-y-visible md:overflow-y-auto max-h-none md:max-h-[400px] custom-scrollbar md:pb-6 ${
            scrolls ? 'games-scroll-fade' : ''
          }`}
        >
          {games.map((game) => (
            <div
              key={game.id}
              className="tile-hover flex-shrink-0 relative overflow-hidden w-[200px] md:w-auto"
              style={{
                backgroundColor: colors.gray2,
                aspectRatio: '21/9',
              }}
              title={game.name}
            >
              <GameImage
                headerImage={game.headerImage}
                iconUrl={game.iconUrl}
                appId={game.steamAppId}
                name={game.name}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
