import { colors, gradients } from '@/lib/colors';
import { ANIMATION_DURATION, ANIMATION_DELAY } from '@/lib/constants';
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

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
            <AnimatePresence mode="popLayout">
              {games.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    transition: {
                      duration: ANIMATION_DURATION.QUICK,
                      delay: index * ANIMATION_DELAY.MINIMAL,
                    },
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.5,
                    transition: { duration: ANIMATION_DURATION.FAST },
                  }}
                  layout
                  className="relative group flex-shrink-0"
                >
                  {/* Game Icon */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-18 h-18 flex items-center justify-center cursor-pointer bg-cover bg-center relative overflow-hidden"
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
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
