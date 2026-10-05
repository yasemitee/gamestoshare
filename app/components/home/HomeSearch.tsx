'use client';

import React, { useEffect, useRef, useState } from 'react';
import { colors } from '@/lib/colors';

interface Game {
  appId: number;
  name: string;
  iconUrl: string;
}

interface HomeSearchProps {
  onGameSelect?: (game: Game | null) => void;
  onSearchTermChange?: (term: string) => void;
}

export const HomeSearch: React.FC<HomeSearchProps> = ({
  onGameSelect,
  onSearchTermChange,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Game[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchGames = async () => {
      if (query.trim().length < 1) {
        setResults([]);
        setShowResults(false);
        if (query.length === 0) {
          onGameSelect?.(null);
        }
        return;
      }
      try {
        const response = await fetch(
          `/api/steam/search?q=${encodeURIComponent(query)}`
        );
        const data = await response.json();
        setResults(data);
        setShowResults(true);
      } catch (error) {
        console.error('Error searching games:', error);
        setResults([]);
      }
    };

    const timeoutId = setTimeout(searchGames, 300);
    return () => clearTimeout(timeoutId);
  }, [query, onGameSelect]);

  const handleGameClick = (game: Game) => {
    setShowResults(false);
    setQuery(game.name);
    onGameSelect?.(game);
  };

  return (
    <div className="max-w-[680px] mx-auto" ref={searchRef}>
      <div
        className="flex items-stretch transition-shadow"
        style={{
          border: `1px solid ${colors.gray2}`,
          boxShadow: isFocused ? '0 0 16px rgba(195,194,245,.35)' : 'none',
        }}
      >
        <div
          className="flex-1 flex items-center gap-3 relative"
          style={{
            background: colors.gray3,
            padding: '0 18px',
            minHeight: '52px',
          }}
        >
          <img
            src="/Lens.svg"
            alt=""
            className="pointer-events-none flex-shrink-0"
            style={{ width: 17, opacity: 0.8 }}
          />
          <input
            type="text"
            placeholder="Search any game…"
            value={query}
            onChange={(e) => {
              const next = e.target.value;
              setQuery(next);
              onGameSelect?.(null);
              onSearchTermChange?.(next);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-transparent focus:outline-none"
            style={{ color: colors.white, fontSize: 14 }}
          />
        </div>
      </div>

      {showResults && results.length > 0 && (
        <div
          className="relative"
          style={{ zIndex: 50 }}
        >
          <div
            className="absolute left-0 right-0 mt-2 max-h-80 overflow-y-auto custom-scrollbar"
            style={{ background: colors.gray3, border: `1px solid ${colors.gray2}` }}
          >
            {results.map((game) => (
              <button
                key={game.appId}
                onClick={() => handleGameClick(game)}
                className="w-full flex items-center gap-2.5 p-2.5 text-left hover:opacity-80 transition-opacity cursor-pointer"
              >
                <img
                  src={game.iconUrl}
                  alt={game.name}
                  className="w-7 h-7 object-cover flex-shrink-0"
                  style={{ backgroundColor: colors.gray2 }}
                />
                <span style={{ color: colors.white, fontSize: 14 }}>{game.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
