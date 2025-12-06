import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/db';
import { getSteamGames, resolveVanityUrl } from '@/lib/steam/api';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let { steamId } = await request.json();

    if (!steamId) {
      return NextResponse.json(
        { error: 'Steam ID is required' },
        { status: 400 }
      );
    }

    if (!/^\d{17}$/.test(steamId)) {
      const resolvedId = await resolveVanityUrl(steamId);
      if (!resolvedId) {
        return NextResponse.json({
          hasMatch: false,
          matchedGame: null,
          message: 'Invalid Steam ID or vanity URL',
        });
      }
      steamId = resolvedId;
    }

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        games: {
          include: {
            game: true,
          },
        },
      },
    });

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    const lookingForGames = listing.games
      .filter((g) => g.type === 'LOOKING_FOR')
      .map((g) => g.game.steamAppId);

    if (lookingForGames.length === 0) {
      return NextResponse.json({
        hasMatch: false,
        matchedGame: null,
        message: 'No wishlist games specified in listing',
      });
    }

    const userGames = await getSteamGames(steamId);

    if (userGames.length === 0) {
      return NextResponse.json({
        hasMatch: false,
        matchedGame: null,
        message: 'Unable to fetch user games. Profile might be private.',
      });
    }

    const userGameIds = userGames.map((g) => g.appId);
    const matchedGameId = lookingForGames.find((gameId) =>
      userGameIds.includes(gameId)
    );
    if (matchedGameId) {
      const matchedGame = userGames.find((g) => g.appId === matchedGameId);
      return NextResponse.json({
        hasMatch: true,
        matchedGame: {
          name: matchedGame?.name || 'Unknown Game',
          image: matchedGame?.headerImage || '',
        },
      });
    }

    return NextResponse.json({
      hasMatch: false,
      matchedGame: null,
      message: 'No games in common',
    });
  } catch (error) {
    console.error('Error checking games:', error);
    return NextResponse.json(
      { error: 'Failed to check games' },
      { status: 500 }
    );
  }
}
