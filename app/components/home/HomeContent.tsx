'use client';

import { useState } from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { Table } from '@/components/home/Table';
import { GameListingData } from '@/lib/db/types';

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
    </>
  );
}
