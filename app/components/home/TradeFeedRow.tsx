import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { colors } from '@/lib/colors';
import { GameListingData } from '@/lib/db/types';
import { CapsuleStrip } from '@/components/home/GameCapsule';
import { MOTION } from '@/lib/constants';

interface TradeFeedRowProps extends GameListingData {
  first?: boolean;
  index?: number;
  scrollRoot?: React.RefObject<HTMLElement | null>;
}

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
  index = 0,
  scrollRoot,
}) => {
  const reduce = useReducedMotion();
  const displayName = showSteamId && user ? user : 'Anonymous';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : MOTION.rise }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      viewport={{ once: true, margin: '-40px', root: scrollRoot }}
      transition={{ duration: 0.22, ease: MOTION.ease }}
    >
      <Link href={`/listings/${id}`} className="block">
        <div
          className="group flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-5 cursor-pointer transition-colors"
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
        <div className="flex items-center gap-3 lg:w-[210px] lg:flex-shrink-0">
          <div
            className="flex items-center justify-center flex-shrink-0 overflow-hidden"
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: colors.gray3,
              backgroundImage: avatarUrl ? `url(${avatarUrl})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
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

        <div className="flex-1 flex flex-row lg:items-center gap-3 lg:gap-8 min-w-0">
          <div className="flex-1 lg:flex-initial min-w-0">
            <CapsuleStrip games={offering} max={3} label="Offers" labelColor={colors.purple} />
          </div>
          <div className="hidden lg:block lg:flex-initial min-w-0">
            <CapsuleStrip games={lookingFor} max={3} label="Wants" />
          </div>
        </div>

        <div className="lg:w-24 lg:flex-shrink-0 lg:text-right flex lg:block items-center justify-between gap-3">
          <div className="lg:mb-2">
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
    </motion.div>
  );
};
