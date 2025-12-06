'use client';

import React from 'react';
import { SearchBar } from '@/components/ui/SearchBar';
import { GradientTitle } from '@/components/ui/GradientTitle';
import { colors } from '@/lib/colors';
import {
  ANIMATION_DURATION,
  ANIMATION_DELAY,
  ANIMATION_EASING,
} from '@/lib/constants';
import { motion } from 'motion/react';

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: ANIMATION_DURATION.SLOW,
          ease: ANIMATION_EASING,
        }}
      >
        <GradientTitle className="mb-5" style={{ lineHeight: '1.2' }}>
          Share your games
          <br />
          and make new friends
        </GradientTitle>
      </motion.div>

      {/* Subtitle */}
      <motion.h4
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: ANIMATION_DURATION.SLOW,
          delay: ANIMATION_DELAY.MEDIUM,
          ease: ANIMATION_EASING,
        }}
        className="mb-16"
        style={{ color: colors.gray1 }}
      >
        Connecting people through games has never been easier.
        <br className="hidden md:block" />
        Choose a platform, search a game and send a friend request.
      </motion.h4>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        className="flex justify-center mb-6"
      >
        <SearchBar
          showLocationFilter={true}
          onGameSelect={onGameSelect}
          onLocationChange={onLocationChange}
          selectedLocation={selectedLocation}
        />
      </motion.div>

      {/* Note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
        className="text-small-title upper"
        style={{ color: colors.gray1 }}
      >
        No registering - No sensitive info shared
      </motion.p>
    </div>
  );
};
