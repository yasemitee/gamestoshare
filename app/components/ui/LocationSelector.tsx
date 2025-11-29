'use client';

import React from 'react';
import { colors, gradients } from '@/lib/colors';
import { COUNTRIES } from '@/lib/countries';

interface LocationSelectorProps {
  value: string;
  onChange: (location: string) => void;
  showAllOption?: boolean;
  showLabel?: boolean;
  gradient?: boolean;
  compact?: boolean;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  value,
  onChange,
  showAllOption = false,
  showLabel = false,
  gradient = false,
  compact = false,
}) => {
  return (
    <div className="relative">
      {showLabel && <label className="block mb-6 text-field">Location</label>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${
          compact ? 'text-field' : 'text-small-title'
        } appearance-none cursor-pointer p-4 pr-10`}
        style={{
          background: gradient ? gradients.main : colors.blue1,
          color: gradient ? colors.black : colors.white,
          minWidth: compact ? '100px' : showLabel ? 'auto' : '120px',
        }}
      >
        {showAllOption && <option value="">🌍 ALL</option>}
        {!showAllOption && !value && (
          <option value="" disabled>
            --
          </option>
        )}
        {COUNTRIES.map((country) => (
          <option key={country.code} value={country.code}>
            {country.emoji} {country.code}
          </option>
        ))}
      </select>
      <div
        className={`absolute pointer-events-none ${
          compact ? 'right-2 top-1/2 -translate-y-1/2' : 'right-3 top-[60px]'
        }`}
      >
        <img
          src="/Dropdown.svg"
          alt=""
          width={10}
          height={6}
          style={gradient ? { filter: 'brightness(0)' } : undefined}
        />
      </div>
    </div>
  );
};
