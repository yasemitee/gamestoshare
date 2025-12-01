import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const location = searchParams.get('location');
    const platform = searchParams.get('platform');
    const search = searchParams.get('search');

    const listings = await prisma.listing.findMany({
      where: {
        isActive: true,
        expiresAt: {
          gt: new Date(),
        },
        ...(location && { location }),
        ...(platform && { platform: platform as any }),
      },
      include: {
        games: {
          include: {
            game: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });

    return NextResponse.json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received listing data:', JSON.stringify(body, null, 2));
    
    const {
      steamId,
      username,
      avatarUrl,
      steamLevel,
      accountYears,
      platform,
      steamProfileUrl,
      description,
      location,
      showSteamId,
      lookingFor = [],
      offering = [],
    } = body;

    console.log('Parsed data:', { steamId, username, avatarUrl, location, lookingForCount: lookingFor.length, offeringCount: offering.length });

    if (!steamId || !steamProfileUrl || !location) {
      return NextResponse.json(
        { error: 'Missing required fields: steamId, steamProfileUrl, location' },
        { status: 400 }
      );
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const existingListing = await prisma.listing.findUnique({
      where: { steamId },
      include: { games: true },
    });

    if (existingListing) {
      await prisma.listingGame.deleteMany({
        where: { listingId: existingListing.id },
      });
    }

    const allGames = [...lookingFor, ...offering];
    
    // Validate all games have appId
    const invalidGames = allGames.filter((g: any) => !g.appId);
    if (invalidGames.length > 0) {
      console.error('Games without appId:', invalidGames);
      return NextResponse.json(
        { error: 'Some games are missing appId', details: invalidGames },
        { status: 400 }
      );
    }
    
    const gameRecords = await Promise.all(
      allGames.map(async (gameData: any) => {
        try {
          return await prisma.game.upsert({
            where: {
              steamAppId_platform: {
                steamAppId: gameData.appId,
                platform: platform || 'STEAM',
              },
            },
            update: {
              name: gameData.name,
              iconUrl: gameData.iconUrl,
              headerImage: gameData.headerImage || `https://cdn.cloudflare.steamstatic.com/steam/apps/${gameData.appId}/header.jpg`,
              releaseYear: gameData.releaseYear,
              priceInCents: gameData.priceInCents,
            },
            create: {
              steamAppId: gameData.appId,
              name: gameData.name,
              platform: platform || 'STEAM',
              iconUrl: gameData.iconUrl,
              headerImage: gameData.headerImage || `https://cdn.cloudflare.steamstatic.com/steam/apps/${gameData.appId}/header.jpg`,
              releaseYear: gameData.releaseYear,
              priceInCents: gameData.priceInCents,
            },
          });
        } catch (error) {
          console.error('Error upserting game:', gameData, error);
          throw error;
        }
      })
    );

    const listing = await prisma.listing.upsert({
      where: { steamId },
      update: {
        username: username || null,
        avatarUrl: avatarUrl || null,
        steamLevel: steamLevel || null,
        accountYears: accountYears || null,
        platform: platform || 'STEAM',
        steamProfileUrl,
        description: description || null,
        location,
        showSteamId: showSteamId || false,
        expiresAt,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      create: {
        steamId,
        username: username || null,
        avatarUrl: avatarUrl || null,
        steamLevel: steamLevel || null,
        accountYears: accountYears || null,
        platform: platform || 'STEAM',
        steamProfileUrl,
        description: description || null,
        location,
        showSteamId: showSteamId || false,
        expiresAt,
      },
    });

    // Deduplica i giochi per nome (case-insensitive) prima di creare le relazioni
    // Questo evita duplicati con stesso nome ma appId diversi (diverse edizioni/regioni)
    const uniqueLookingFor = Array.from(
      new Map(lookingFor.map((g: any) => [g.name.toLowerCase().trim(), g])).values()
    );
    const uniqueOffering = Array.from(
      new Map(offering.map((g: any) => [g.name.toLowerCase().trim(), g])).values()
    );

    // Crea le nuove relazioni con i giochi
    await prisma.listingGame.createMany({
      data: [
        ...uniqueLookingFor.map((gameData: any) => {
          const game = gameRecords.find(g => g.steamAppId === gameData.appId);
          return {
            listingId: listing.id,
            gameId: game!.id,
            type: 'LOOKING_FOR' as const,
          };
        }),
        ...uniqueOffering.map((gameData: any) => {
          const game = gameRecords.find(g => g.steamAppId === gameData.appId);
          return {
            listingId: listing.id,
            gameId: game!.id,
            type: 'OFFERING' as const,
          };
        }),
      ],
    });

    // Recupera il listing completo con i giochi
    const completeListing = await prisma.listing.findUnique({
      where: { id: listing.id },
      include: {
        games: {
          include: {
            game: true,
          },
        },
      },
    });

    return NextResponse.json(completeListing, { status: existingListing ? 200 : 201 });
  } catch (error) {
    console.error('Error creating/updating listing:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Failed to create/update listing', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}