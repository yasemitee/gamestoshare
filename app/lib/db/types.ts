import { Listing, User, Game, ListingGame, Platform, ListingType } from '@prisma/client';

export type ListingWithRelations = Listing & {
  user: User;
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

// TODO: is the old type, will be removed later
export interface GameListingData {
  user: string;
  location: string;
  platform: string;
  games: string[];
  offering: number;
  postingDate: string;
}