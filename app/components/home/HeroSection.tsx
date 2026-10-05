'use client';

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { HomeSearch } from '@/components/home/HomeSearch';
import { GradientTitle } from '@/components/ui/GradientTitle';
import { colors } from '@/lib/colors';
import { MOTION } from '@/lib/constants';

interface Game {
  appId: number;
  name: string;
  iconUrl: string;
}

interface HeroSectionProps {
  onGameSelect?: (game: Game | null) => void;
  onSearchTermChange?: (term: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onGameSelect,
  onSearchTermChange,
}) => {
  const reduce = useReducedMotion();
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: MOTION.stagger } },
  };
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : MOTION.rise },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: MOTION.duration, ease: MOTION.ease },
    },
  };

  return (
    <motion.div
      className="text-center mt-20 md:mt-32 mb-12"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item}>
        <GradientTitle className="mb-5" style={{ lineHeight: '1.2' }}>
          Share your games
          <br />
          and make new friends
        </GradientTitle>
      </motion.div>

      <motion.h4
        variants={item}
        className="mb-11"
        style={{ color: colors.gray1, lineHeight: '24px' }}
      >
        Find Steam players whose library matches your wishlist,{' '}
        <br className="hidden md:block" />
        then share games through Family Sharing. No account needed.
      </motion.h4>

      <motion.div variants={item}>
        <HomeSearch
          onGameSelect={onGameSelect}
          onSearchTermChange={onSearchTermChange}
        />
      </motion.div>
    </motion.div>
  );
};
