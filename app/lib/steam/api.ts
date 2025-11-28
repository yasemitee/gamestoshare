// documentation: https://developer.valvesoftware.com/wiki/Steam_Web_API

import {
  SteamGame,
  SteamGameFormatted,
  SteamWishlistGame,
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

export async function getSteamWishlist(steamId: string): Promise<SteamWishlistGame[]> {
  try {
    const url = `https://api.steampowered.com/IWishlistService/GetWishlist/v1/?steamid=${steamId}`;
    const response = await fetch(url, { next: { revalidate: 3600 } });
    
    if (!response.ok) {
      console.error("Wishlist fetch failed:", response.status);
      return [];
    }
    
    const data = await response.json();
    
    if (!data?.response?.items || !Array.isArray(data.response.items)) {
      return [];
    }

    const wishlistItems = data.response.items;

    if (wishlistItems.length === 0) {
      return [];
    }

    const appIds = wishlistItems.map((item: any) => item.appid);
    
    const gamesWithDetails = await Promise.all(
      appIds.slice(0, 100).map(async (appId: number) => {
        try {
          const details = await getGameDetails(appId);
          const headerImage = details?.header_image || `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg`;
          
          return {
            appId,
            name: details?.name || `Game ${appId}`,
            iconUrl: headerImage,
            headerImage: headerImage,
          };
        } catch (error) {
          const fallbackImage = `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg`;
          return {
            appId,
            name: `Game ${appId}`,
            iconUrl: fallbackImage,
            headerImage: fallbackImage,
          };
        }
      })
    );

    return gamesWithDetails;
  } catch (error) {
    console.error("Error fetching Steam wishlist:", error);
    return [];
  }
}

export async function getGameDetails(appId: number) {
  try {
    const response = await fetch(
      `https://store.steampowered.com/api/appdetails?appids=${appId}&l=english`,
      { next: { revalidate: 86400 } }
    );

    const data = await response.json();

    if (data[appId]?.success) {
      return data[appId].data;
    }

    return null;
  } catch (error) {
    console.error('Error fetching game details:', error);
    return null;
  }
}

export async function getOwnedGamesWithPrices(steamId: string, limit: number = 1000) {
  try {
    // Ottieni tutti i giochi posseduti
    const games = await getSteamGames(steamId);
    
    if (games.length === 0) {
      return [];
    }

    console.log(`Processing ${games.length} owned games for user ${steamId}`);

    // Ottieni i dettagli per ogni gioco
    // Processa in batch per evitare timeout
    const batchSize = 50;
    const allGamesWithPrices = [];
    
    for (let i = 0; i < Math.min(games.length, limit); i += batchSize) {
      const batch = games.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(async (game) => {
          try {
            const details = await getGameDetails(game.appId);
            
            // Controlla se il gioco è free-to-play
            const isFree = details?.is_free === true;
            
            // Il prezzo è in centesimi, quindi dividi per 100
            const priceInCents = details?.price_overview?.final || 0;
            const price = priceInCents / 100;
            
            // Se non ha price_overview ma non è marcato come free, potrebbe essere a pagamento
            // In questo caso usa un prezzo di default basso
            const finalPrice = !isFree && priceInCents === 0 ? 0.01 : price;
            
            return {
              id: game.appId.toString(),
              name: game.name,
              appId: game.appId,
              iconUrl: game.headerImage,
              price: finalPrice,
              isFree: isFree,
            };
          } catch (error) {
            console.error(`Error fetching details for game ${game.appId}:`, error);
            // Ritorna il gioco senza prezzo invece di null
            return {
              id: game.appId.toString(),
              name: game.name,
              appId: game.appId,
              iconUrl: game.headerImage,
              price: 0.01,
              isFree: false,
            };
          }
        })
      );
      allGamesWithPrices.push(...batchResults);
    }

    // Filtra giochi non free-to-play e ordina per prezzo decrescente
    const paidGames = allGamesWithPrices
      .filter((game): game is NonNullable<typeof game> => 
        game !== null && !game.isFree
      )
      .sort((a, b) => b.price - a.price);

    console.log(`Found ${paidGames.length} paid games, top 5 prices:`, 
      paidGames.slice(0, 5).map(g => ({ name: g.name, price: g.price })));

    return paidGames;
  } catch (error) {
    console.error('Error fetching owned games with prices:', error);
    return [];
  }
}

export async function getCompleteUserData(steamId: string): Promise<CompleteUserData> {
  const [profile, games, wishlist] = await Promise.all([
    getCompleteProfile(steamId),
    getSteamGames(steamId).catch(() => []),
    getSteamWishlist(steamId).catch(() => []),
  ]);

  return {
    profile,
    games,
    wishlist,
    stats: {
      totalGames: games.length,
      totalWishlist: wishlist.length,
      totalPlaytime: games.reduce((sum, game) => sum + game.playtimeMinutes, 0),
    },
  };
}