export interface SteamGame {
  appid: number;
  name: string;
  playtime_forever: number;
  playtime_2weeks?: number;
  img_icon_url: string;
  img_logo_url?: string;
}

export interface SteamGameFormatted {
  appId: number;
  name: string;
  playtimeMinutes: number;
  iconUrl: string;
  logoUrl: string | null;
  headerImage: string;
}

export interface SteamWishlistGame {
  appId: number;
  name: string;
  iconUrl: string;
  headerImage: string;
}

export interface SteamPlayerSummary {
  steamid: string;
  personaname: string;
  profileurl: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
  personastate: number;
  communityvisibilitystate: number;
  profilestate?: number;
  lastlogoff?: number;
  loccountrycode?: string;
  timecreated?: number;
}

export interface SteamBans {
  SteamId: string;
  CommunityBanned: boolean;
  VACBanned: boolean;
  NumberOfVACBans: number;
  DaysSinceLastBan: number;
  NumberOfGameBans: number;
  EconomyBan: string;
}

export interface SteamProfileComplete {
  steamId: string;
  username: string;
  avatar: string;
  profileUrl: string;
  country?: string;
  bio?: string;
  level: number;
  accountAge: {
    years: number;
    months: number;
    totalMonths: number;
    createdAt: Date;
  };
  bans: {
    communityBanned: boolean;
    vacBanned: boolean;
    numberOfVACBans: number;
    numberOfGameBans: number;
    totalBans: number;
  };
  isPublic: boolean;
}

export interface CompleteUserData {
  profile: SteamProfileComplete;
  games: SteamGameFormatted[];
  wishlist: SteamWishlistGame[];
  stats: {
    totalGames: number;
    totalWishlist: number;
    totalPlaytime: number;
  };
}