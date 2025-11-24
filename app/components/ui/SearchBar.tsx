import React from 'react';
import { colors, gradients } from '@/lib/colors';
import { FilterIcon } from './FilterIcon';

export const SearchBar: React.FC = () => {
  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1 flex items-center">
          <img
            src="/Lens.svg"
            alt=""
            className="absolute left-4 pointer-events-none w-5 h-5"
          />
          <input
            type="text"
            placeholder="Search any game"
            className="text-field w-full pl-12 pr-4 py-4 focus:outline-none transition-all"
            style={{
              backgroundColor: colors.blue1,
              color: colors.gray1,
            }}
          />
        </div>

        <button
          className="hover:opacity-80 transition-opacity flex items-center justify-center"
          style={{
            background: gradients.main,
            minWidth: '48px',
            height: '48px',
          }}
        >
          <FilterIcon color={colors.black} />
        </button>
      </div>
    </div>
  );
};
