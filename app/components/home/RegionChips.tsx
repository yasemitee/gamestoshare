'use client';

import React, { useEffect, useRef, useState } from 'react';
import { colors } from '@/lib/colors';
import { GlobeIcon } from '@/components/home/GlobeIcon';
import { TopLocationData } from '@/lib/db/types';
import { COUNTRIES, getCountryByCode } from '@/lib/countries';

interface RegionChipsProps {
  value: string;
  onChange: (code: string) => void;
  topLocations?: TopLocationData[];
}

export const RegionChips: React.FC<RegionChipsProps> = ({
  value,
  onChange,
  topLocations = [],
}) => {
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countryQuery, setCountryQuery] = useState('');
  const countryRef = useRef<HTMLDivElement>(null);
  const countryInputRef = useRef<HTMLInputElement>(null);

  const topRegions = topLocations.map((loc) => {
    const country = getCountryByCode(loc.code);
    return {
      code: loc.code,
      label: country ? country.name : loc.code,
      count: loc.count,
    };
  });

  const displayTopRegions =
    topRegions.length > 0
      ? topRegions
      : [
          { code: 'GB', label: 'UK', count: undefined },
          { code: 'DE', label: 'Germany', count: undefined },
          { code: 'US', label: 'USA', count: undefined },
          { code: 'FR', label: 'France', count: undefined },
          { code: 'IT', label: 'Italy', count: undefined },
        ];

  const isAllActive = value === '';
  const isTopSelected = displayTopRegions.some((r) => r.code === value);
  const isOtherSelected = Boolean(value && !isTopSelected);
  const selectedOtherCountry = isOtherSelected ? getCountryByCode(value) : null;

  const filteredCountries = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(countryQuery.trim().toLowerCase())
  );
  const showAllOption =
    countryQuery.trim() === '' ||
    'all countries'.includes(countryQuery.trim().toLowerCase());

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        countryRef.current &&
        !countryRef.current.contains(event.target as Node)
      ) {
        setIsCountryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCountrySelect = (code: string) => {
    onChange(code);
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
    <div className="flex flex-wrap items-center gap-2">
      {/* 1. All tab */}
      <button
        type="button"
        onClick={() => onChange('')}
        className="flex items-center gap-1.5 cursor-pointer transition-colors"
        style={{
          padding: '7px 13px',
          fontSize: '12px',
          border: `1px solid ${isAllActive ? colors.purple : colors.gray3}`,
          color: isAllActive ? colors.white : colors.gray1,
          background: isAllActive ? 'rgba(195,194,245,.10)' : 'transparent',
          minHeight: '32px',
        }}
      >
        <GlobeIcon size={16} />
        <span>All</span>
      </button>

      {/* 2. Top country tabs */}
      {displayTopRegions.map((region) => {
        const active = region.code === value;
        return (
          <button
            key={region.code}
            type="button"
            onClick={() => onChange(region.code)}
            className="flex items-stretch cursor-pointer transition-colors overflow-hidden"
            style={{
              fontSize: '12px',
              border: `1px solid ${active ? colors.purple : colors.gray3}`,
              color: active ? colors.white : colors.gray1,
              background: active ? 'rgba(195,194,245,.10)' : 'transparent',
              padding: 0,
              minHeight: '32px',
            }}
          >
            {region.count !== undefined && (
              <div
                className="flex items-center justify-center font-medium"
                style={{
                  background: active ? colors.purple : colors.gray3,
                  color: active ? colors.black : colors.white,
                  padding: '7px 10px',
                  minWidth: '38px',
                }}
              >
                {region.count}
              </div>
            )}
            <div
              className="flex items-center gap-1.5"
              style={{ padding: '7px 13px' }}
            >
              <img
                src={`https://flagcdn.com/${region.code.toLowerCase()}.svg`}
                alt={region.label}
                style={{ width: 16 }}
                className="flex-shrink-0"
              />
              <span>{region.label}</span>
            </div>
          </button>
        );
      })}

      {/* 3. Dropdown tab for all / other countries */}
      <div className="relative" ref={countryRef}>
        <button
          type="button"
          onClick={toggleCountry}
          className="flex items-center gap-2 cursor-pointer transition-colors"
          style={{
            padding: '7px 13px',
            fontSize: '12px',
            border: `1px solid ${isOtherSelected ? colors.purple : colors.gray3}`,
            color: isOtherSelected ? colors.white : colors.gray1,
            background: isOtherSelected ? 'rgba(195,194,245,.10)' : 'transparent',
            minHeight: '32px',
          }}
        >
          {selectedOtherCountry ? (
            <img
              src={`https://flagcdn.com/${selectedOtherCountry.code.toLowerCase()}.svg`}
              alt={selectedOtherCountry.name}
              style={{ width: 16 }}
              className="flex-shrink-0"
            />
          ) : (
            <GlobeIcon size={16} />
          )}
          <span className="whitespace-nowrap">
            {selectedOtherCountry ? selectedOtherCountry.name : 'More countries'}
          </span>
          <img
            src="/Dropdown.svg"
            alt=""
            className="w-2.5 h-2.5 brightness-[0.7] flex-shrink-0"
          />
        </button>

        {isCountryOpen && (
          <div
            className="absolute z-50 mt-1 overflow-hidden left-0 max-sm:left-auto max-sm:right-0"
            style={{
              background: '#1B1F24',
              minWidth: '220px',
              maxWidth: 'calc(100vw - 32px)',
              border: `1px solid ${colors.gray2}`,
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ borderBottom: `1px solid ${colors.gray2}` }}>
              <input
                ref={countryInputRef}
                type="text"
                placeholder="Type a country…"
                value={countryQuery}
                onChange={(e) => setCountryQuery(e.target.value)}
                className="w-full bg-transparent focus:outline-none"
                style={{
                  padding: '8px 12px',
                  color: colors.white,
                  fontSize: 13,
                }}
              />
            </div>
            <div className="max-h-60 overflow-y-auto overflow-x-hidden custom-scrollbar">
              {showAllOption && (
                <button
                  type="button"
                  onClick={() => handleCountrySelect('')}
                  className="w-full text-left flex items-center gap-2 hover:opacity-80 transition-opacity"
                  style={{
                    padding: '8px 12px',
                    color: colors.white,
                    fontSize: 13,
                  }}
                >
                  <GlobeIcon size={16} style={{ color: colors.gray1 }} />
                  <span>All countries</span>
                </button>
              )}
              {filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountrySelect(country.code)}
                  className="w-full text-left flex items-center gap-2 hover:opacity-80 transition-opacity"
                  style={{
                    padding: '8px 12px',
                    color: colors.white,
                    fontSize: 13,
                  }}
                >
                  <img
                    src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
                    alt={country.code}
                    style={{ width: 16 }}
                  />
                  <span className="whitespace-nowrap">{country.name}</span>
                </button>
              ))}
              {!showAllOption && filteredCountries.length === 0 && (
                <div
                  style={{
                    padding: '8px 12px',
                    color: colors.gray1,
                    fontSize: 13,
                  }}
                >
                  No country found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
