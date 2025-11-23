import React from 'react';
import { Search, Filter } from 'lucide-react';
import { colors } from '@/lib/colors';

export const SearchBar: React.FC = () => {
  return (
    <div className="relative w-full max-w-xl">
      <div className="relative flex items-center">
        <Search
          className="absolute left-4 pointer-events-none"
          size={20}
          style={{ color: colors.gray1 }}
        />
        <input
          type="text"
          placeholder="Search any game"
          className="w-full pl-12 pr-12 py-3 rounded border focus:outline-none focus:ring-2 transition-all"
          style={{
            backgroundColor: colors.gray3,
            borderColor: colors.gray2,
            color: colors.white,
          }}
        />
        <button
          className="absolute right-2 p-2 rounded hover:opacity-80 transition-opacity"
          style={{ backgroundColor: colors.purple }}
        >
          <Filter size={18} style={{ color: colors.black }} />
        </button>
      </div>
    </div>
  );
};
