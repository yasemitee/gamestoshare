'use client';

import React, { useEffect, useRef, useState } from 'react';
import { colors } from '@/lib/colors';
import { COUNTRIES } from '@/lib/countries';
import { GlobeIcon } from '@/components/home/GlobeIcon';

interface Game {
  appId: number;
  name: string;
  iconUrl: string;
}

interface HomeSearchProps {
  onGameSelect?: (game: Game | null) => void;
  onSearchTermChange?: (term: string) => void;
  selectedLocation: string;
  onLocationChange: (location: string) => void;
}

export const HomeSearch: React.FC<HomeSearchProps> = ({
  onGameSelect,
  onSearchTermChange,
  selectedLocation,
  onLocationChange,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Game[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countryQuery, setCountryQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const countryRef = useRef<HTMLDivElement>(null);
  const countryInputRef = useRef<HTMLInputElement>(null);

  const selectedCountry = COUNTRIES.find((c) => c.code === selectedLocation);
  const filteredCountries = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(countryQuery.trim().toLowerCase())
  );
  const showAllOption =
    countryQuery.trim() === '' ||
    'all countries'.includes(countryQuery.trim().toLowerCase());

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
      if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
        setIsCountryOpen(false);
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

  const handleCountrySelect = (code: string) => {
    onLocationChange(code);
    setIsCountryOpen(false);
    setCountryQuery('');
  };

  const toggleCountry = () => {
    setIsCountryOpen((open) => {
      const next = !open;
      if (next) {
        setCountryQuery('');
        setTimeout(() => countryInputRef.current?.focus(), 0);
      }
      return next;
    });
  };

  return (
    <div className="max-w-[680px] mx-auto" ref={searchRef}>
      <div
        className="flex items-stretch flex-col sm:flex-row transition-shadow"
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

        <div className="relative" ref={countryRef}>
          <button
            type="button"
            onClick={toggleCountry}
            className="w-full sm:w-auto h-full flex items-center gap-2.5 cursor-pointer"
            style={{
              background: '#1B1F24',
              borderLeft: `1px solid ${colors.gray2}`,
              padding: '14px 18px',
            }}
          >
            {selectedCountry ? (
              <img
                src={`https://flagcdn.com/${selectedCountry.code.toLowerCase()}.svg`}
                alt={selectedCountry.code}
                style={{ width: 20 }}
                className="flex-shrink-0"
              />
            ) : (
              <GlobeIcon size={20} style={{ color: colors.gray1 }} />
            )}
            <span style={{ color: colors.white, fontSize: 14 }} className="whitespace-nowrap">
              {selectedCountry ? selectedCountry.name : 'All countries'}
            </span>
            <img
              src="/Dropdown.svg"
              alt=""
              className="w-3 h-3 brightness-[0.6] flex-shrink-0"
            />
          </button>

          {isCountryOpen && (
            <div
              className="absolute z-50 mt-1 overflow-hidden"
              style={{ right: -1, background: '#1B1F24', minWidth: '100%', border: `1px solid ${colors.gray2}` }}
            >
              <div style={{ borderBottom: `1px solid ${colors.gray2}` }}>
                <input
                  ref={countryInputRef}
                  type="text"
                  placeholder="Type a country…"
                  value={countryQuery}
                  onChange={(e) => setCountryQuery(e.target.value)}
                  className="w-full bg-transparent focus:outline-none"
                  style={{ padding: '10px 14px', color: colors.white, fontSize: 14 }}
                />
              </div>
              <div className="max-h-60 overflow-y-auto overflow-x-hidden custom-scrollbar">
                {showAllOption && (
                  <button
                    type="button"
                    onClick={() => handleCountrySelect('')}
                    className="w-full text-left flex items-center gap-2 hover:opacity-80 transition-opacity"
                    style={{ padding: '10px 14px', color: colors.white, fontSize: 14 }}
                  >
                    <GlobeIcon size={20} style={{ color: colors.gray1 }} />
                    <span>All countries</span>
                  </button>
                )}
                {filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleCountrySelect(country.code)}
                    className="w-full text-left flex items-center gap-2 hover:opacity-80 transition-opacity"
                    style={{ padding: '10px 14px', color: colors.white, fontSize: 14 }}
                  >
                    <img
                      src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
                      alt={country.code}
                      style={{ width: 20 }}
                    />
                    <span className="whitespace-nowrap">{country.name}</span>
                  </button>
                ))}
                {!showAllOption && filteredCountries.length === 0 && (
                  <div
                    style={{ padding: '10px 14px', color: colors.gray1, fontSize: 14 }}
                  >
                    No country found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {showResults && results.length > 0 && (
        <div
          className="relative"
          style={{ zIndex: 50 }}
        >
          <div
            className="absolute left-0 right-0 mt-2 max-h-80 overflow-y-auto custom-scrollbar"
            style={{ background: colors.blue1, border: `1px solid ${colors.gray2}` }}
          >
            {results.map((game) => (
              <button
                key={game.appId}
                onClick={() => handleGameClick(game)}
                className="w-full flex items-center gap-2.5 p-2.5 text-left hover:opacity-80 transition-opacity"
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
