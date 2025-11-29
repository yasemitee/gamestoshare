'use client';

import React from 'react';
import { SearchBar } from '@/components/ui/SearchBar';
import { colors, gradients } from '@/lib/colors';

interface Game {
  appId: number;
  name: string;
  iconUrl: string;
}

interface HeroSectionProps {
  onGameSelect?: (game: Game | null) => void;
  onLocationChange?: (location: string) => void;
  selectedLocation?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onGameSelect,
  onLocationChange,
  selectedLocation = '',
}) => {
  return (
    <div className="text-center mt-32 mb-16">
      {/* Title */}
      <h1
        className="mb-5"
        style={{
          background: gradients.main,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: '1.2',
        }}
      >
        Share your games
        <br />
        and make new friends
      </h1>
      {/* Subtitle */}
      <h4 className="mb-16" style={{ color: colors.gray1 }}>
        Choose a platform, search a game and send a friend request.
        <br />
        Owning a large library of games has never been easier.
      </h4>
      {/* Search Bar */}
      <div className="flex justify-center mb-6">
        <SearchBar
          showLocationFilter={true}
          onGameSelect={onGameSelect}
          onLocationChange={onLocationChange}
          selectedLocation={selectedLocation}
        />
      </div>
      {/* Note */}
      <p className="text-small-title upper" style={{ color: colors.gray1 }}>
        No registering - No sensitive info shared
      </p>
    </div>
  );
};
