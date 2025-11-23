import React from 'react';
import { SearchBar } from '@/components/ui/SearchBar';
import { colors } from '@/lib/colors';

export const HeroSection: React.FC = () => {
  return (
    <div className="text-center mb-16">
      <h1
        className="text-6xl font-bold mb-4 leading-tight"
        style={{ color: colors.white }}
      >
        share your games
        <br />
        and make new friends
      </h1>
      <p className="text-lg mb-2" style={{ color: colors.gray1 }}>
        Choose a platform, search a game and send a friend request.
      </p>
      <p className="text-lg mb-12" style={{ color: colors.gray1 }}>
        Owning a large library of games has never been easier.
      </p>

      <SearchBar />

      <p
        className="text-xs mt-4 uppercase tracking-wider"
        style={{ color: colors.gray2 }}
      >
        No registering - No sensitive info shared
      </p>
    </div>
  );
};
