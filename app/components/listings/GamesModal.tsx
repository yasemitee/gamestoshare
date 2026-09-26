'use client';

import { useId, useMemo, useState } from 'react';
import { colors } from '@/lib/colors';
import { BaseVerificationModal } from '@/components/verification/BaseVerificationModal';
import { GameImage } from './GameImage';

interface Game {
  id: string;
  name: string;
  headerImage: string | null;
  iconUrl: string | null;
  steamAppId: number;
}

export type GamesTab = 'wishlist' | 'library';

interface GamesModalProps {
  open: boolean;
  tab: GamesTab;
  onTabChange: (tab: GamesTab) => void;
  onClose: () => void;
  ownerName: string;
  wishlist: Game[];
  library: Game[];
}

const TABS: { id: GamesTab; label: string }[] = [
  { id: 'wishlist', label: 'Wishlist' },
  { id: 'library', label: 'Library' },
];

export function GamesModal(props: GamesModalProps) {
  return (
    <BaseVerificationModal
      isOpen={props.open}
      onClose={props.onClose}
      size="wide"
    >
      {/* Keyed by tab: the search resets when switching lists or reopening. */}
      <Gallery key={props.tab} {...props} />
    </BaseVerificationModal>
  );
}

function Gallery({
  tab,
  onTabChange,
  ownerName,
  wishlist,
  library,
}: GamesModalProps) {
  const [query, setQuery] = useState('');
  const filterId = useId();
  const games = tab === 'wishlist' ? wishlist : library;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? games.filter((g) => g.name.toLowerCase().includes(q)) : games;
  }, [games, query]);

  return (
    <>
      <h2 className="pr-10 mb-6" style={{ color: colors.white }}>
        {ownerName}&rsquo;s games
      </h2>

      <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-8 mb-6">
        <div role="tablist" aria-label="Game lists" className="flex gap-6">
          {TABS.map(({ id, label }) => {
            const selected = id === tab;
            const count = id === 'wishlist' ? wishlist.length : library.length;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => onTabChange(id)}
                className="text-small-title pb-2 cursor-pointer transition-colors"
                style={{
                  color: selected ? colors.white : colors.gray1,
                  borderBottom: `1px solid ${
                    selected ? colors.purple : 'transparent'
                  }`,
                }}
              >
                {label}{' '}
                <span style={{ color: selected ? colors.purple : colors.gray2 }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {games.length > 0 && (
          <div className="sm:ml-auto sm:w-72">
            <label htmlFor={filterId} className="sr-only">
              Find a game in {tab}
            </label>
            <input
              id={filterId}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find a game…"
              autoComplete="off"
              className="w-full px-3 py-2 text-field-small focus:outline-none focus:ring-1"
              style={
                {
                  backgroundColor: 'rgba(0, 0, 0, 0.25)',
                  color: colors.white,
                  '--tw-ring-color': colors.purple,
                } as React.CSSProperties
              }
            />
          </div>
        )}
      </div>

      <div
        role="tabpanel"
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain custom-scrollbar -mx-1 px-1"
      >
        {games.length === 0 ? (
          <p className="text-field-small py-10" style={{ color: colors.gray1 }}>
            No games listed.
          </p>
        ) : visible.length === 0 ? (
          <p
            role="status"
            className="text-field-small py-10"
            style={{ color: colors.gray1 }}
          >
            No match for &ldquo;{query.trim()}&rdquo;.
          </p>
        ) : (
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 md:gap-x-4 gap-y-5 pb-2">
            {visible.map((game) => (
              <li key={game.id}>
                <a
                  href={`https://store.steampowered.com/app/${game.steamAppId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                  aria-label={`${game.name} on the Steam store`}
                >
                  <div
                    className="relative overflow-hidden transition-shadow duration-200 group-hover:shadow-[0_0_12px_rgba(195,194,245,0.3),0_0_24px_rgba(195,194,245,0.15)]"
                    style={{
                      backgroundColor: colors.gray2,
                      aspectRatio: '460 / 215',
                    }}
                  >
                    <GameImage
                      headerImage={game.headerImage}
                      iconUrl={game.iconUrl}
                      appId={game.steamAppId}
                      name={game.name}
                    />
                  </div>
                  <p
                    className="text-field-small mt-2 line-clamp-2 transition-colors group-hover:text-[#C3C2F5]"
                    style={{ color: colors.white }}
                    title={game.name}
                  >
                    {game.name}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
