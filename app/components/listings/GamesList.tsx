'use client';

import { colors } from '@/lib/colors';
import { GameImage } from './GameImage';

interface Game {
  id: string;
  name: string;
  headerImage: string | null;
  iconUrl: string | null;
}

interface GamesListProps {
  title: string;
  games: Game[];
}

export function GamesList({ title, games }: GamesListProps) {
  return (
    <div>
      <div className="pb-5">
        <p
          className="text-small-title flex justify-between items-center"
          style={{ color: colors.white }}
        >
          {title}
          <span style={{ color: colors.gray1 }}>{games.length} GAMES</span>
        </p>
      </div>
      <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto custom-scrollbar">
        {games.map((game) => (
          <div
            key={game.id}
            className="flex-shrink-0 relative overflow-hidden"
            style={{
              backgroundColor: colors.gray2,
              aspectRatio: '21/9',
            }}
            title={game.name}
          >
            <GameImage
              headerImage={game.headerImage}
              iconUrl={game.iconUrl}
              name={game.name}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
