import { colors, gradients } from '@/lib/colors';
import React from 'react';

interface Game {
  id: string;
  name: string;
  iconUrl?: string;
  appId?: number;
}

interface GameIconsListProps {
  games: Game[];
  onRemove?: (id: string) => void;
  maxGames?: number;
}

export const GameIconsList: React.FC<GameIconsListProps> = ({
  games,
  onRemove,
  maxGames = 10,
}) => {
  return (
    <div className="">
      <div className="text-small-title mb-2" style={{ color: colors.gray1 }}>
        {games.length} GAMES
      </div>
      <div className="mt-7 min-h-[140px] max-h-[280px] bg-transparent overflow-y-auto overflow-x-hidden">
        <div className="flex flex-wrap gap-3">
          {games.map((game, index) => (
            <div key={game.id} className="relative group flex-shrink-0">
              {/* Game Icon */}
              <div
                className="w-18 h-18 flex items-center justify-center cursor-pointer transition-transform hover:scale-105 bg-cover bg-center relative overflow-hidden"
                style={{
                  backgroundImage: game.iconUrl
                    ? `url(${game.iconUrl})`
                    : 'none',
                }}
                title={game.name}
                onClick={() => onRemove && onRemove(game.id)}
              >
                {/* Fallback text if no icon */}
                {!game.iconUrl && (
                  <span className="text-white text-base font-bold">
                    {game.name.substring(0, 2).toUpperCase()}
                  </span>
                )}

                {/* Red gradient overlay and X icon on hover */}
                {onRemove && (
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-90 transition-opacity flex items-center justify-center"
                    style={{
                      background: gradients.red,
                    }}
                  >
                    <svg
                      className="w-8 h-8 text-white relative z-10"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Placeholder for no games */}
          {games.length === 0 && (
            <div className="text-gray-500 text-sm w-full text-center py-8">
              No games selected
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
