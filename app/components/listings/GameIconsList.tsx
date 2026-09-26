import { colors } from '@/lib/colors';
import { ANIMATION_DURATION, ANIMATION_DELAY } from '@/lib/constants';
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

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
  /** Where the list came from, shown on the count line (e.g. "Imported from Steam"). */
  source?: string;
  /** Tile to scroll to and flash; `nonce` re-triggers it for the same game. */
  highlight?: { id: string; nonce: number } | null;
  emptyText?: string;
}

const microLabel: React.CSSProperties = {
  fontSize: 10,
  letterSpacing: '.12em',
  textTransform: 'uppercase',
};

export const GameIconsList: React.FC<GameIconsListProps> = ({
  games,
  onRemove,
  source,
  highlight,
  emptyText = 'No games yet. Search above to add one.',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!highlight) return;
    const el = scrollRef.current?.querySelector<HTMLElement>(
      `[data-game-id="${CSS.escape(highlight.id)}"]`
    );
    el?.scrollIntoView({
      block: 'nearest',
      behavior: reduce ? 'auto' : 'smooth',
    });
  }, [highlight, reduce]);

  return (
    <div>
      <div
        className="flex flex-wrap items-center gap-x-2 gap-y-1"
        style={{ ...microLabel, color: colors.gray1 }}
      >
        <span style={{ color: colors.white }}>{games.length} games</span>
        {source && games.length > 0 && (
          <>
            <span aria-hidden="true">·</span>
            <span>{source}</span>
          </>
        )}
        {onRemove && games.length > 0 && (
          <>
            <span aria-hidden="true">·</span>
            <span>
              <span className="[@media(hover:hover)]:hidden">
                Tap <span style={{ color: colors.white }}>×</span> to remove
              </span>
              <span className="hidden [@media(hover:hover)]:inline">
                Hover a game to remove it
              </span>
            </span>
          </>
        )}
      </div>
      <div
        ref={scrollRef}
        className={`mt-4 ${
          games.length > 0 ? 'md:min-h-[140px]' : ''
        } max-h-[296px] overflow-y-auto overflow-x-hidden custom-scrollbar -mx-2 px-2 py-2`}
      >
        {games.length === 0 ? (
          <div
            className="text-field w-full h-full flex items-center justify-center py-6"
            style={{ color: colors.gray1 }}
          >
            {emptyText}
          </div>
        ) : (
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(72px,72px))] gap-3 justify-start">
            <AnimatePresence mode="popLayout" initial={false}>
              {games.map((game, index) => {
                const isHighlighted = highlight?.id === game.id;
                return (
                  <motion.li
                    key={game.id}
                    data-game-id={game.id}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      transition: {
                        duration: ANIMATION_DURATION.QUICK,
                        delay: Math.min(index, 20) * ANIMATION_DELAY.MINIMAL,
                      },
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.92,
                      transition: { duration: ANIMATION_DURATION.FAST },
                    }}
                    layout={!reduce}
                    className="relative group w-18 h-18"
                    title={game.name}
                  >
                    <div
                      className="w-full h-full flex items-center justify-center bg-cover bg-center"
                      style={{
                        backgroundColor: colors.gray2,
                        backgroundImage: game.iconUrl
                          ? `url(${game.iconUrl})`
                          : 'none',
                      }}
                    >
                      {!game.iconUrl && (
                        <span className="text-white text-base font-bold">
                          {game.name.substring(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>

                    {isHighlighted && (
                      <span
                        key={highlight.nonce}
                        aria-hidden="true"
                        className="game-flash pointer-events-none absolute inset-0"
                      />
                    )}

                    {onRemove && (
                      <>
                        <button
                          type="button"
                          onClick={() => onRemove(game.id)}
                          aria-label={`Remove ${game.name}`}
                          className="peer absolute z-10 -top-2 -right-2 w-7 h-7 flex items-center justify-center cursor-pointer transition-opacity duration-150 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 focus-visible:opacity-100"
                        >
                          <span
                            className="w-5 h-5 flex items-center justify-center"
                            style={{
                              backgroundColor: colors.red,
                              border: '1px solid rgba(255,255,255,.2)',
                            }}
                          >
                            <img
                              src="/XIcon.svg"
                              alt=""
                              width={8}
                              height={8}
                            />
                          </span>
                        </button>
                        {/* Ember wash over the art while the × is hovered */}
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-150 peer-hover:opacity-70 peer-focus-visible:opacity-70"
                          style={{ backgroundColor: colors.red }}
                        />
                      </>
                    )}
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </div>
  );
};
