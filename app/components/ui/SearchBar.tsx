'use client';

import React, { useState, useEffect, useRef } from 'react';
import { colors, gradients } from '@/lib/colors';
import { LocationSelector } from './LocationSelector';
import { motion, AnimatePresence } from 'motion/react';

interface Game {
  appId: number;
  name: string;
  iconUrl: string;
}

interface SearchBarProps {
  placeholder?: string;
  showLocationFilter?: boolean;
  onGameSelect?: (game: Game | null) => void;
  onLocationChange?: (location: string) => void;
  selectedLocation?: string;
  clearOnSelect?: boolean;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search any game',
  showLocationFilter = false,
  onGameSelect,
  onLocationChange,
  selectedLocation = '',
  clearOnSelect = false,
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Game[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
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
        if (query.length === 0 && onGameSelect) {
          onGameSelect(null);
        }
        return;
      }

      setIsSearching(true);
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
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(searchGames, 300);
    return () => clearTimeout(timeoutId);
  }, [query, onGameSelect]);

  const handleGameClick = (game: Game) => {
    setShowResults(false);
    if (clearOnSelect) {
      setQuery('');
    } else {
      setQuery(game.name);
    }
    if (onGameSelect) {
      onGameSelect(game);
    }
  };

  return (
    <div
      className={`relative w-full ${className ? '' : 'max-w-2xl'}`}
      ref={searchRef}
    >
      <div className="relative flex items-center gap-2">
        <motion.div
          animate={{
            boxShadow: isFocused
              ? '0 0 20px rgba(195, 194, 245, 0.4), 0 0 40px rgba(195, 194, 245, 0.2)'
              : '0 0 0px rgba(195, 194, 245, 0)',
          }}
          whileHover={{
            boxShadow:
              '0 0 15px rgba(195, 194, 245, 0.3), 0 0 30px rgba(195, 194, 245, 0.15)',
          }}
          transition={{ duration: 0.3 }}
          className="relative flex-1 flex items-center"
        >
          <img
            src="/Lens.svg"
            alt=""
            className="absolute left-4 pointer-events-none w-5 h-5"
          />
          <input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="text-field w-full pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all"
            style={
              {
                backgroundColor: colors.blue1,
                color: colors.white,
                '--tw-ring-color': colors.purple,
              } as React.CSSProperties
            }
          />
        </motion.div>

        {showLocationFilter && onLocationChange && (
          <LocationSelector
            value={selectedLocation}
            onChange={onLocationChange}
            showAllOption={true}
            gradient={true}
            compact={true}
          />
        )}
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {showResults && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
            className="absolute top-full left-0 right-0 mt-2 max-h-80 overflow-y-auto"
            style={{
              backgroundColor: colors.blue1,
              border: `1px solid ${colors.gray2}`,
              zIndex: 50,
            }}
          >
            {results.map((game, index) => (
              <motion.button
                key={game.appId}
                whileHover={{
                  boxShadow:
                    '0 0 12px rgba(195, 194, 245, 0.3), 0 0 24px rgba(195, 194, 245, 0.15)',
                }}
                transition={{ duration: 0.2 }}
                onClick={() => handleGameClick(game)}
                className="w-full flex items-center gap-2.5 p-2.5 text-left"
                style={{
                  backgroundColor: 'transparent',
                }}
              >
                <img
                  src={game.iconUrl}
                  alt={game.name}
                  className="w-7 h-7 object-cover flex-shrink-0"
                  style={{ backgroundColor: colors.gray2 }}
                />
                <span className="text-field" style={{ color: colors.white }}>
                  {game.name}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
