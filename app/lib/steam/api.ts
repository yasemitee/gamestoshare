// documentation: https://developer.valvesoftware.com/wiki/Steam_Web_API

import {
  SteamGame,
  SteamGameFormatted,
  SteamPlayerSummary,
  SteamBans,
  SteamProfileComplete,
  CompleteUserData,
} from './types';
import { calculateAccountAge, extractBioFromXML } from './utils';

const STEAM_API_KEY = process.env.STEAM_API_KEY;
const STEAM_API_BASE = 'https://api.steampowered.com';

if (!STEAM_API_KEY) {
  console.warn('STEAM_API_KEY not configured in .env');
}

export async function resolveVanityUrl(vanityUrl: string): Promise<string | null> {
  try {
    const response = await fetch(
      `${STEAM_API_BASE}/ISteamUser/ResolveVanityURL/v0001/?key=${STEAM_API_KEY}&vanityurl=${vanityUrl}`
    );

    const data = await response.json();

    if (data.response.success === 1) {
      return data.response.steamid;
    }

    return null;
  } catch (error) {
    console.error('Error resolving vanity URL:', error);
    return null;
  }
}

export async function getSteamIdFromUrl(url: string): Promise<string | null> {
  const { extractSteamId } = await import('./utils');
  const extracted = extractSteamId(url);

  if (!extracted) return null;

  if (/^\d{17}$/.test(extracted)) {
    return extracted;
  }

  return await resolveVanityUrl(extracted);
}

export async function getPlayerSummary(steamId: string): Promise<SteamPlayerSummary | null> {
  if (!STEAM_API_KEY) {
    throw new Error('Steam API key not configured');
  }

  try {
    const response = await fetch(
      `${STEAM_API_BASE}/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${steamId}`,
      { next: { revalidate: 3600 } }
    );

    const data = await response.json();

    if (data.response.players && data.response.players.length > 0) {
      return data.response.players[0];
    }

    return null;
  } catch (error) {
    console.error('Error fetching player summary:', error);
    return null;
  }
}

export async function getPlayerBans(steamId: string): Promise<SteamBans | null> {
  if (!STEAM_API_KEY) {
    throw new Error('Steam API key not configured');
  }

  try {
    const response = await fetch(
      `${STEAM_API_BASE}/ISteamUser/GetPlayerBans/v1/?key=${STEAM_API_KEY}&steamids=${steamId}`,
      { next: { revalidate: 3600 } }
    );

    const data = await response.json();

    if (data.players && data.players.length > 0) {
      return data.players[0];
    }

    return null;
  } catch (error) {
    console.error('Error fetching player bans:', error);
    return null;
  }
}

export async function getPlayerLevel(steamId: string): Promise<number> {
  if (!STEAM_API_KEY) {
    throw new Error('Steam API key not configured');
  }

  try {
    const response = await fetch(
      `${STEAM_API_BASE}/IPlayerService/GetSteamLevel/v1/?key=${STEAM_API_KEY}&steamid=${steamId}`,
      { next: { revalidate: 3600 } }
    );

    const data = await response.json();

    return data.response?.player_level || 0;
  } catch (error) {
    console.error('Error fetching player level:', error);
    return 0;
  }
}

export async function getProfileBio(steamId: string): Promise<string | undefined> {
  try {
    const response = await fetch(
      `https://steamcommunity.com/profiles/${steamId}?xml=1`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      return undefined;
    }

    const xmlText = await response.text();
    return extractBioFromXML(xmlText);
  } catch (error) {
    console.error('Error fetching profile bio:', error);
    return undefined;
  }
}

export async function getCompleteProfile(steamId: string): Promise<SteamProfileComplete> {
  const [summary, bans, level, bio] = await Promise.all([
    getPlayerSummary(steamId),
    getPlayerBans(steamId),
    getPlayerLevel(steamId),
    getProfileBio(steamId),
  ]);

  if (!summary) {
    throw new Error('Profile not found');
  }

  const accountAge = summary.timecreated
    ? calculateAccountAge(summary.timecreated)
    : { years: 0, months: 0, totalMonths: 0, createdAt: new Date() };

  return {
    steamId: summary.steamid,
    username: summary.personaname,
    avatar: summary.avatarfull,
    profileUrl: summary.profileurl,
    country: summary.loccountrycode,
    bio,
    level,
    accountAge,
    bans: {
      communityBanned: bans?.CommunityBanned || false,
      vacBanned: bans?.VACBanned || false,
      numberOfVACBans: bans?.NumberOfVACBans || 0,
      numberOfGameBans: bans?.NumberOfGameBans || 0,
      totalBans: (bans?.NumberOfVACBans || 0) + (bans?.NumberOfGameBans || 0),
    },
    isPublic: summary.communityvisibilitystate === 3,
  };
}

export async function getSteamGames(steamId: string): Promise<SteamGameFormatted[]> {
  if (!STEAM_API_KEY) {
    throw new Error('Steam API key not configured');
  }

  try {
    const response = await fetch(
      `${STEAM_API_BASE}/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_API_KEY}&steamid=${steamId}&format=json&include_appinfo=1&include_played_free_games=1`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      console.error(`Steam API error for games: ${response.status}`);
      return [];
    }

    const data = await response.json();

    if (!data.response || !data.response.games) {
      console.warn(`No games found for user ${steamId} - profile might be private`);
      return [];
    }

    return data.response.games.map((game: SteamGame) => ({
      appId: game.appid,
      name: game.name,
      playtimeMinutes: game.playtime_forever,
      iconUrl: `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`,
      logoUrl: game.img_logo_url
        ? `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_logo_url}.jpg`
        : null,
      headerImage: `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`,
    }));
  } catch (error) {
    console.error('Error fetching Steam games:', error);
    return [];
  }
}

export async function getCompleteUserData(steamId: string): Promise<CompleteUserData> {
  const [profile, games] = await Promise.all([
    getCompleteProfile(steamId),
    getSteamGames(steamId).catch(() => []),
  ]);

  return {
    profile,
    games,
    stats: {
      totalGames: games.length,
      totalPlaytime: games.reduce((sum, game) => sum + game.playtimeMinutes, 0),
    },
  };
}