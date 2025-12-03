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
      <div
        className={`mt-7 ${
          games.length > 0 ? 'md:min-h-[140px]' : ''
        } max-h-[280px] bg-transparent overflow-y-auto overflow-x-hidden`}
      >
        {games.length === 0 ? (
          <div
            className="text-field w-full h-full flex items-center justify-center"
            style={{ color: colors.gray1 }}
          >
            No games selected
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(72px,72px))] gap-3 justify-start">
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
                      <img
                        src="/XIcon.svg"
                        alt="Remove"
                        className="w-8 h-8 relative z-10"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
