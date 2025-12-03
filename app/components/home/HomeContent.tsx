'use client';

import { useState } from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { Table } from '@/components/home/Table';
import { FAQItem } from '@/components/home/FAQItem';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { Footer } from '@/components/layout/Footer';
import { GradientTitle } from '@/components/ui/GradientTitle';
import { GameListingData } from '@/lib/db/types';
import { colors } from '@/lib/colors';

interface Game {
  appId: number;
  name: string;
  iconUrl: string;
}

interface HomeContentProps {
  listings: GameListingData[];
}

export function HomeContent({ listings }: HomeContentProps) {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  const filteredListings = listings.filter((listing) => {
    if (selectedGame) {
      const hasInOffering = listing.offering.some((game) =>
        game.name.toLowerCase().includes(selectedGame.name.toLowerCase())
      );
      if (!hasInOffering) {
        return false;
      }
    }

    if (selectedLocation && listing.location !== selectedLocation) {
      return false;
    }

    return true;
  });

  return (
    <>
      <HeroSection
        onGameSelect={setSelectedGame}
        onLocationChange={setSelectedLocation}
        selectedLocation={selectedLocation}
      />
      <Table data={filteredListings} />
      <div className="mt-32">
        <GradientTitle className="text-center mb-12">FAQ</GradientTitle>
        <div className="mx-auto">
          <FAQItem
            question="HOW DO I ENABLE FAMILY SHARING?"
            answer="Log into Steam > Settings > Family > Authorize Library Sharing on this device."
          />
          <FAQItem
            question="HOW CAN I ADD PEOPLE TO MY STEAM FAMILY?"
            answer="You need to be friends first. You will see the eligible accounts under Settings > Family."
          />
          <FAQItem
            question="IS THERE A LIMIT TO THE NUMBER OF ACCOUNTS I CAN SHARE MY LIBRARY WITH?"
            answer="Yes, a Family Library can be shared with up to 5 accounts and up to 10 devices in 90 days."
          />
          <FAQItem
            question="CAN I SHARE A SPECIFIC GAME?"
            answer="Yes, you can share a specific game by flagging all the other games as private. Check the guide here for further information."
          />
          <FAQItem
            question="CAN I GET BANNED FROM FAMILY SHARING?"
            answer="Offline and solo games are 100% safe, but you can get a VAC ban if you're sharing a game with someone who cheats or hacks a multiplayer or online game. We encourage our community to be mindful."
          />
        </div>
      </div>

      {/* Discord CTA */}
      <div className="mt-16 text-center">
        <h2 className="mb-4" style={{ color: colors.white }}>
          Still unsure?
        </h2>
        <p
          className="text-small-title mb-8"
          style={{ color: colors.gray1, lineHeight: '24px' }}
        >
          JOIN OUR COMMUNITY ON DISCORD AND GET TO KNOW US
        </p>
        <AnimatedButton
          href="https://discord.gg/mavhKaDRCv"
          className="inline-flex items-center gap-1.5 text-button"
        >
          <img src="/Discord.svg" alt="Discord" width={16} height={16} />
          <span className="text-button">JOIN OUR SERVER</span>
        </AnimatedButton>
      </div>
      <Footer />
    </>
  );
}
