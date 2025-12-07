'use client';

import React, { useState, useRef, useEffect } from 'react';
import { colors, gradients } from '@/lib/colors';
import { COUNTRIES } from '@/lib/countries';
import { motion } from 'motion/react';

interface LocationSelectorProps {
  value: string;
  onChange: (location: string) => void;
  showAllOption?: boolean;
  showLabel?: boolean;
  gradient?: boolean;
  compact?: boolean;
  width?: string;
  hasError?: boolean;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  value,
  onChange,
  showAllOption = false,
  showLabel = false,
  gradient = false,
  compact = false,
  width,
  hasError = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCountry = COUNTRIES.find((c) => c.code === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: string) => {
    onChange(code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {showLabel && <label className="block mb-6 text-field">Location</label>}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{
          boxShadow: gradient
            ? '0 0 15px rgba(195, 194, 245, 0.4), 0 0 30px rgba(195, 194, 245, 0.2)'
            : '0 0 15px rgba(195, 194, 245, 0.3), 0 0 30px rgba(195, 194, 245, 0.15)',
        }}
        transition={{ duration: 0.3 }}
        className={`${
          compact ? 'text-field' : 'text-small-title'
        } appearance-none cursor-pointer p-4 pr-10 text-left flex items-center gap-2`}
        style={{
          background: gradient ? gradients.main : colors.blue1,
          color: gradient ? colors.black : colors.white,
          width: width || (compact ? '100px' : '120px'),
          boxShadow: hasError ? `inset 0 0 0 1px ${colors.error}` : 'none',
        }}
      >
        {value && selectedCountry ? (
          <>
            <img
              src={`https://flagcdn.com/${value.toLowerCase()}.svg`}
              alt={value}
              className="w-5 h-4"
            />
            <span>{value}</span>
          </>
        ) : showAllOption ? (
          <>
            <svg
              className="w-5 h-4 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />

              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span>ALL</span>
          </>
        ) : (
          <span>--</span>
        )}
      </motion.button>
      <div
        className={`absolute pointer-events-none ${
          compact
            ? 'right-2 top-1/2 -translate-y-1/2'
            : showLabel
            ? 'right-3 top-[60px]'
            : 'right-3 top-1/2 -translate-y-1/2'
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

      {isOpen && (
        <div
          className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto custom-scrollbar"
          style={{
            background: gradient ? gradients.main : colors.blue1,
            color: gradient ? colors.black : colors.white,
          }}
        >
          {showAllOption && (
            <button
              type="button"
              onClick={() => handleSelect('')}
              className="w-full text-left p-3 hover:opacity-80 transition-opacity flex items-center gap-2"
              style={{
                borderBottom: `1px solid ${
                  gradient ? 'rgba(0,0,0,0.1)' : colors.gray2
                }`,
              }}
            >
              <svg
                className="w-5 h-4 flex-shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />

                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span>ALL</span>
            </button>
          )}
          {COUNTRIES.map((country) => (
            <button
              key={country.code}
              type="button"
              onClick={() => handleSelect(country.code)}
              className={`w-full text-left p-3 hover:opacity-80 transition-opacity flex items-center gap-2 ${
                compact ? 'text-field' : 'text-small-title'
              }`}
              style={{
                borderBottom: `1px solid ${
                  gradient ? 'rgba(0,0,0,0.1)' : colors.gray2
                }`,
              }}
            >
              <img
                src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
                alt={country.code}
                className="w-5 h-4"
              />
              <span>{country.code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
