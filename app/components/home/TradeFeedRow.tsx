import React from 'react';
import Link from 'next/link';
import { colors } from '@/lib/colors';
import { GameListingData, FeedGame } from '@/lib/db/types';

interface TradeFeedRowProps extends GameListingData {
  first?: boolean;
}

function capsuleUrl(game: FeedGame): string | null {
  if (game.headerImage) return game.headerImage;
  if (game.appId)
    return `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appId}/header.jpg`;
  return null;
}

const CapsuleStrip: React.FC<{ games: FeedGame[]; max?: number }> = ({
  games,
  max = 3,
}) => (
  <div className="flex items-center gap-1">
    {games.slice(0, max).map((game, idx) => {
      const url = capsuleUrl(game);
      return (
        <div
          key={idx}
          title={game.name}
          className="flex-shrink-0 bg-cover bg-center"
          style={{
            width: 64,
            height: 30,
            backgroundColor: colors.gray2,
            backgroundImage: url ? `url(${url})` : undefined,
          }}
        />
      );
    })}
    {games.length > max && (
      <span style={{ color: colors.gray1, fontSize: 11 }} className="ml-1">
        +{games.length - max}
      </span>
    )}
  </div>
);

const Label: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children,
  color = colors.gray1,
}) => (
  <span
    style={{
      fontSize: 10,
      letterSpacing: '.12em',
      textTransform: 'uppercase',
      color,
    }}
  >
    {children}
  </span>
);

export const TradeFeedRow: React.FC<TradeFeedRowProps> = ({
  id,
  user,
  showSteamId,
  location,
  lookingFor,
  offering,
  postingDate,
  avatarUrl,
  level,
  years,
  first = false,
}) => {
  const displayName = showSteamId && user ? user : 'Anonymous';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <Link href={`/listings/${id}`}>
      <div
        className="group flex flex-col md:flex-row md:items-center gap-4 md:gap-5 cursor-pointer transition-colors"
        style={{
          padding: '18px 8px',
          borderTop: first ? 'none' : '1px solid rgba(255,255,255,.07)',
          background: first ? 'rgba(255,255,255,.02)' : 'transparent',
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = 'rgba(255,255,255,.04)')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = first
            ? 'rgba(255,255,255,.02)'
            : 'transparent')
        }
      >
        <div className="flex items-center gap-3 md:w-[210px] md:flex-shrink-0">
          <div
            className="flex items-center justify-center flex-shrink-0 bg-cover bg-center"
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: colors.gray3,
              backgroundImage: avatarUrl ? `url(${avatarUrl})` : undefined,
              color: colors.white,
              fontSize: 15,
            }}
          >
            {!avatarUrl && initial}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                style={{ color: colors.white, fontSize: 14 }}
                className="truncate"
              >
                {displayName}
              </span>
              <img
                src={`https://flagcdn.com/${location.toLowerCase()}.svg`}
                alt={location}
                style={{ width: 17 }}
                className="flex-shrink-0"
              />
            </div>
            <div className="mt-0.5">
              <Label>
                Lvl {level ?? '—'} · {years != null ? Math.floor(years) : '—'} yrs
              </Label>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center gap-4 md:gap-4 min-w-0">
          <div className="min-w-0">
            <div className="mb-1.5">
              <Label color={colors.purple}>Wants</Label>
            </div>
            <CapsuleStrip games={lookingFor} max={3} />
          </div>
          <span
            style={{ color: colors.gray2, fontSize: 20 }}
            className="self-end pb-1 flex-shrink-0"
          >
            →
          </span>
          <div className="min-w-0">
            <div className="mb-1.5">
              <Label>Offers</Label>
            </div>
            <CapsuleStrip games={offering} max={3} />
          </div>
        </div>

        <div className="md:w-24 md:flex-shrink-0 md:text-right flex md:block items-center justify-between gap-3">
          <div className="md:mb-2">
            <Label>{postingDate}</Label>
          </div>
          <span
            className="transition-colors group-hover:!text-[#C3C2F5]"
            style={{
              fontSize: 11,
              letterSpacing: '.08em',
              textTransform: 'uppercase',
              color: colors.white,
              borderBottom: `1px solid ${colors.purple}`,
              paddingBottom: 2,
            }}
          >
            View
          </span>
        </div>
      </div>
    </Link>
  );
};
