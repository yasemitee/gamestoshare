'use client';

import { colors } from '@/lib/colors';
import { GameImage } from './GameImage';
import { motion } from 'motion/react';

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
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-hidden overflow-y-visible md:overflow-y-auto max-h-none md:max-h-[400px] custom-scrollbar">
        {games.map((game) => (
          <motion.div
            key={game.id}
            whileHover={{
              boxShadow:
                '0 0 20px rgba(195, 194, 245, 0.6), 0 0 40px rgba(195, 194, 245, 0.3)',
              scale: 1.05,
              zIndex: 10,
            }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 relative overflow-hidden w-[200px] md:w-auto"
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
          </motion.div>
        ))}
      </div>
    </div>
  );
}
