import { useState } from 'react';
import { normalizeSteamId } from '@/lib/steam/utils';

interface Game {
  id: string;
  name: string;
  iconUrl?: string;
  appId?: number;
}

interface SteamVerificationResult {
  isValid: boolean;
  username?: string;
  avatarUrl?: string;
  steamLevel?: number;
  accountYears?: number;
  location?: string;
  wishlist?: Game[];
  ownedGames?: Game[];
}

export function useSteamVerification() {
  const [isSteamIdValid, setIsSteamIdValid] = useState(false);
  const [isSteamIdInvalid, setIsSteamIdInvalid] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const verifySteamId = async (
    id: string
  ): Promise<SteamVerificationResult | null> => {
    if (!id.trim()) {
      setIsSteamIdValid(false);
      setIsSteamIdInvalid(false);
      return null;
    }

    setIsVerifying(true);
    setIsSteamIdValid(false);
    setIsSteamIdInvalid(false);
    try {
      const normalizedUrl = normalizeSteamId(id);

      const response = await fetch(
        `/api/steam/profile?profileUrl=${encodeURIComponent(normalizedUrl)}`
      );

      if (response.ok) {
        const data = await response.json();
        setIsSteamIdValid(true);
        setIsSteamIdInvalid(false);

        const result: SteamVerificationResult = {
          isValid: true,
          username: data.username,
          avatarUrl: data.avatar,
          steamLevel: data.level,
          accountYears: data.accountAge?.years,
          location: data.country?.toUpperCase(),
        };

        try {
          const [wishlistResponse, ownedGamesResponse] = await Promise.all([
            fetch(
              `/api/steam/wishlist?profileUrl=${encodeURIComponent(
                normalizedUrl
              )}`
            ),
            fetch(
              `/api/steam/owned-games?profileUrl=${encodeURIComponent(
                normalizedUrl
              )}&limit=1000`
            ),
          ]);

          if (wishlistResponse.ok) {
            const wishlistData = await wishlistResponse.json();

            if (
              wishlistData &&
              Array.isArray(wishlistData) &&
              wishlistData.length > 0
            ) {
              result.wishlist = wishlistData.slice(0, 10).map((game: any) => ({
                id: game.appId.toString(),
                name: game.name,
                iconUrl: game.iconUrl || game.headerImage,
                appId: game.appId,
              }));
            }
          }

          if (ownedGamesResponse.ok) {
            const ownedGamesData = await ownedGamesResponse.json();

            if (
              ownedGamesData &&
              Array.isArray(ownedGamesData) &&
              ownedGamesData.length > 0
            ) {
              result.ownedGames = ownedGamesData.map((game: any) => ({
                id: game.id,
                name: game.name,
                iconUrl: game.iconUrl,
                appId: game.appId,
              }));
            }
          }
        } catch (error) {
          console.error('Error fetching games data:', error);
        }

        return result;
      } else {
        setIsSteamIdValid(false);
        setIsSteamIdInvalid(true);
        return null;
      }
    } catch (error) {
      console.error('Error verifying Steam ID:', error);
      setIsSteamIdValid(false);
      setIsSteamIdInvalid(true);
      return null;
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    isSteamIdValid,
    isSteamIdInvalid,
    isVerifying,
    verifySteamId,
  };
}
