'use client';

import React from 'react';
import { HomeSearch } from '@/components/home/HomeSearch';
import { RegionChips } from '@/components/home/RegionChips';
import { GradientTitle } from '@/components/ui/GradientTitle';
import { colors } from '@/lib/colors';

interface Game {
  appId: number;
  name: string;
  iconUrl: string;
}

interface HeroSectionProps {
  onGameSelect?: (game: Game | null) => void;
  onSearchTermChange?: (term: string) => void;
  onLocationChange: (location: string) => void;
  selectedLocation: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onGameSelect,
  onSearchTermChange,
  onLocationChange,
  selectedLocation,
}) => {
  return (
    <div className="text-center mt-32 mb-16">
      <GradientTitle className="mb-5" style={{ lineHeight: '1.2' }}>
        Share your games
        <br />
        and make new friends
      </GradientTitle>

      <h4 className="mb-11" style={{ color: colors.gray1, lineHeight: '24px' }}>
        Connecting people through games has never been easier.
        <br className="hidden md:block" />
        Choose a platform, search a game and send a friend request.
      </h4>

      <HomeSearch
        onGameSelect={onGameSelect}
        onSearchTermChange={onSearchTermChange}
        selectedLocation={selectedLocation}
        onLocationChange={onLocationChange}
      />

      <RegionChips value={selectedLocation} onChange={onLocationChange} />

      <p
        className="upper"
        style={{
          color: colors.gray1,
          fontSize: 11,
          letterSpacing: '.08em',
          marginTop: 22,
        }}
      >
        No registering — No sensitive info shared
      </p>
    </div>
  );
};
