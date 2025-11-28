import { colors } from '@/lib/colors';
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
  // Colori mock per i fallback
  const mockColors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#FFA07A',
    '#98D8C8',
    '#F7DC6F',
    '#BB8FCE',
    '#85C1E2',
    '#F8B739',
    '#EC7063',
  ];

  return (
    <div className="">
      <div className="text-small-title mb-2" style={{ color: colors.gray1 }}>
        {games.length} GAMES
      </div>
      <div className="mt-7 min-h-[140px] max-h-[280px] bg-transparent overflow-y-auto overflow-x-hidden">
        <div className="flex flex-wrap gap-3">
          {games.map((game, index) => (
            <div key={game.id} className="relative group flex-shrink-0">
              {/* Icona del gioco */}
              <div
                className="w-18 h-18 flex items-center justify-center cursor-pointer transition-transform hover:scale-105 bg-cover bg-center"
                style={{
                  backgroundImage: game.iconUrl
                    ? `url(${game.iconUrl})`
                    : 'none',
                  backgroundColor: !game.iconUrl
                    ? mockColors[index % mockColors.length]
                    : 'transparent',
                }}
                title={game.name}
              >
                {/* Fallback text se non c'è icona */}
                {!game.iconUrl && (
                  <span className="text-white text-base font-bold">
                    {game.name.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Pulsante di rimozione */}
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(game.id)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  aria-label={`Remove ${game.name}`}
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              )}
            </div>
          ))}

          {/* Placeholder per nessun gioco */}
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
