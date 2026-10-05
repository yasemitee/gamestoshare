import { Listing, Game, ListingGame, Platform, ListingType } from '@prisma/client';

/**
 * Generic game representation used across components
 */
export interface GameData {
  id: string;
  name: string;
  iconUrl?: string;
  appId?: number;
}

export type ListingWithRelations = Listing & {
  games: (ListingGame & {
    game: Game;
  })[];
};

export interface CreateListingInput {
  userId: string;
  platform: Platform;
  steamProfileUrl: string;
  description?: string;
  location: string;
  lookingFor: number[]; 
  offering: number[];   
}


export interface ListingFilters {
  location?: string;
  platform?: Platform;
  search?: string;
}

export interface FeedGame {
  iconUrl: string;
  name: string;
  appId?: number;
  headerImage?: string;
}

export interface GameListingData {
  id: string;
  user: string | null;
  steamId: string;
  showSteamId: boolean;
  location: string;
  platform: string;
  lookingFor: FeedGame[];
  offering: FeedGame[];
  /** Full counts; the arrays above only hold the first few per side. */
  lookingForTotal: number;
  offeringTotal: number;
  postingDate: string;
  avatarUrl?: string | null;
  level?: number | null;
  years?: number | null;
}export interface TopLocationData { code: string; count: number; }
