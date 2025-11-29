import { Listing, Game, ListingGame, Platform, ListingType } from '@prisma/client';

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

export interface GameListingData {
  id: string;
  user: string | null;
  steamId: string;
  showSteamId: boolean;
  location: string;
  platform: string;
  lookingFor: Array<{ iconUrl: string; name: string }>;
  offering: Array<{ iconUrl: string; name: string }>;
  postingDate: string;
}