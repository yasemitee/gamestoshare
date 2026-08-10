'use client';

import React, { useState } from 'react';
import { colors } from '@/lib/colors';
import { FeedGame } from '@/lib/db/types';

const WIDTH = 64;
const HEIGHT = 30;

interface GameCapsuleProps {
  game: FeedGame;
  onDead?: () => void;
}

export const GameCapsule: React.FC<GameCapsuleProps> = ({ game, onDead }) => {
  const staticSources = [
    game.headerImage,
    game.appId
      ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appId}/header.jpg`
      : undefined,
  ].filter(Boolean) as string[];
  const sources = [...new Set(staticSources)];

  const [idx, setIdx] = useState(0);
  const [resolved, setResolved] = useState<string | null>(null);
  const [triedApi, setTriedApi] = useState(false);
  const [dead, setDead] = useState(false);

  const die = () => {
    setDead(true);
    onDead?.();
  };

  const handleError = async () => {
    if (!resolved && idx < sources.length - 1) {
      setIdx((i) => i + 1);
      return;
    }
    if (!triedApi && game.appId) {
      setTriedApi(true);
      try {
        const res = await fetch(`/api/steam/header?appId=${game.appId}`);
        const data = await res.json();
        if (data?.headerImage) {
          setResolved(data.headerImage);
          return;
        }
      } catch {
        // fall through to dead state
      }
    }
    die();
  };

  const src = resolved ?? sources[idx];

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
  label: string;
  labelColor?: string;
}> = ({ games, max = 3, label, labelColor = colors.gray1 }) => {
  const [failed, setFailed] = useState<Set<number>>(new Set());

  // Wants is hidden on mobile, so Offers spans the full row width there.
  const MOBILE_MAX = 4;
  const available = games
    .map((game, i) => ({ game, i }))
    .filter(({ i }) => !failed.has(i));
  const visible = available.slice(0, max);
  const desktopOverflow = Math.max(0, available.length - max);
  const mobileOverflow = Math.max(0, available.length - MOBILE_MAX);

  const markFailed = (i: number) =>
    setFailed((prev) => {
      const next = new Set(prev);
      next.add(i);
      return next;
    });

  const overflowStyle = { color: colors.gray1, fontSize: 10 } as const;

  return (
    <div className="min-w-0">
      <div className="mb-1.5 flex items-center gap-1.5">
        <span
          style={{
            fontSize: 10,
            letterSpacing: '.12em',
            textTransform: 'uppercase',
            color: labelColor,
          }}
        >
          {label}
        </span>
        {mobileOverflow > 0 && (
          <span className="lg:hidden" style={overflowStyle}>
            +{mobileOverflow}
          </span>
        )}
        {desktopOverflow > 0 && (
          <span className="hidden lg:inline" style={overflowStyle}>
            +{desktopOverflow}
          </span>
        )}
      </div>
      {visible.length === 0 ? (
        games.length === 0 ? null : <GameCapsule game={games[0]} />
      ) : (
        <div className="flex items-center gap-1">
          {visible.map(({ game, i }, pos) => (
            <div
              key={game.appId ?? i}
              className={pos >= MOBILE_MAX ? 'hidden lg:block' : ''}
            >
              <GameCapsule game={game} onDead={() => markFailed(i)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
