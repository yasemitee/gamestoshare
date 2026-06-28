'use client';

import React from 'react';
import { colors } from '@/lib/colors';

interface RegionChipsProps {
  value: string;
  onChange: (code: string) => void;
}

const REGIONS = [
  { code: '', label: 'All' },
  { code: 'GB', label: 'UK' },
  { code: 'DE', label: 'Germany' },
  { code: 'US', label: 'USA' },
  { code: 'FR', label: 'France' },
  { code: 'IT', label: 'Italy' },
];

export const RegionChips: React.FC<RegionChipsProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mt-3.5">
      {REGIONS.map((region) => {
        const active = region.code === value;
        return (
          <button
            key={region.code || 'all'}
            type="button"
            onClick={() => onChange(region.code)}
            className="flex items-center gap-1.5 cursor-pointer transition-colors"
            style={{
              padding: '7px 13px',
              fontSize: '12px',
              border: `1px solid ${active ? colors.purple : colors.gray2}`,
              color: active ? colors.white : colors.gray1,
              background: active ? 'rgba(195,194,245,.10)' : 'transparent',
            }}
          >
            {region.code ? (
              <img
                src={`https://flagcdn.com/${region.code.toLowerCase()}.svg`}
                alt={region.label}
                style={{ width: 16 }}
                className="flex-shrink-0"
              />
            ) : (
              <span style={{ width: 16, fontSize: 11, textAlign: 'center' }}>
                ◍
              </span>
            )}
            {region.label}
          </button>
        );
      })}
    </div>
  );
};
