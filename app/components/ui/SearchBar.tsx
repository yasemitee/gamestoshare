import React from 'react';
import { colors, gradients } from '@/lib/colors';
import { FilterIcon } from './FilterIcon';

interface SearchBarProps {
  placeholder?: string;
  showFilter?: boolean;
}
export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search any game',
  showFilter = false,
}) => {
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
            placeholder={placeholder}
            className="text-field w-full pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all"
            style={
              {
                backgroundColor: colors.blue1,
                color: colors.gray1,
                '--tw-ring-color': colors.purple,
              } as React.CSSProperties
            }
          />
        </div>

        {showFilter && (
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
        )}
      </div>
    </div>
  );
};
