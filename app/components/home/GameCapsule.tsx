'use client';

import React, { useEffect, useState } from 'react';
import { colors } from '@/lib/colors';
import { FeedGame } from '@/lib/db/types';
import { useResilientGameImage } from '@/hooks/useResilientGameImage';

const WIDTH = 64;
const HEIGHT = 30;

interface GameCapsuleProps {
  game: FeedGame;
  onDead?: () => void;
}

export const GameCapsule: React.FC<GameCapsuleProps> = ({ game, onDead }) => {
  const { src, handleError, dead } = useResilientGameImage({
    headerImage: game.headerImage,
    iconUrl: game.iconUrl,
    appId: game.appId,
  });

  useEffect(() => {
    if (dead) onDead?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dead]);

  if (dead || !src) {
    // When a substitution handler is provided, render nothing — the parent
    // swaps in another game instead of showing a grey/name placeholder.
    if (onDead) return null;
    return (
      <div
        title={game.name}
        className="flex-shrink-0 flex items-center justify-center overflow-hidden"
        style={{
          width: WIDTH,
          height: HEIGHT,
          backgroundColor: colors.gray2,
          padding: '0 4px',
        }}
      >
        <span
          className="truncate"
          style={{ color: colors.white, fontSize: 9, lineHeight: 1.1, textAlign: 'center' }}
        >
          {game.name}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={game.name}
      title={game.name}
      onError={handleError}
      className="flex-shrink-0 object-cover"
      style={{ width: WIDTH, height: HEIGHT, backgroundColor: colors.gray2 }}
    />
  );
};

export const CapsuleStrip: React.FC<{
  games: FeedGame[];
  max?: number;
  onOverflowChange?: (overflow: number) => void;
}> = ({ games, max = 3, onOverflowChange }) => {
  const [failed, setFailed] = useState<Set<number>>(new Set());

  const available = games
    .map((game, i) => ({ game, i }))
    .filter(({ i }) => !failed.has(i));
  const visible = available.slice(0, max);
  const overflow = available.length - visible.length;

  // Games drop out of the strip as their images fail to resolve, so this
  // count is only final once that settles — report it up rather than let
  // the caller derive a stale number from `games`.
  useEffect(() => {
    onOverflowChange?.(overflow);
  }, [overflow, onOverflowChange]);

  const markFailed = (i: number) =>
    setFailed((prev) => {
      const next = new Set(prev);
      next.add(i);
      return next;
    });

  if (visible.length === 0) {
    if (games.length === 0) return null;
    return <GameCapsule game={games[0]} />;
  }

  return (
    <div className="flex items-center gap-1">
      {visible.map(({ game, i }) => (
        <GameCapsule
          key={game.appId ?? i}
          game={game}
          onDead={() => markFailed(i)}
        />
      ))}
      {overflow > 0 && (
        <span
          style={{ color: colors.gray1, fontSize: 11 }}
          className="ml-1 hidden md:inline"
        >
          +{overflow}
        </span>
      )}
    </div>
  );
};
