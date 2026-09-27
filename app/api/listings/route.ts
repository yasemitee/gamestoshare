import { NextRequest, NextResponse, after } from 'next/server';
import { revalidatePath } from 'next/cache';
import { Platform, Prisma } from '@prisma/client';
import { prisma } from '@/lib/db/db';
import { getSteamIdFromUrl } from '@/lib/steam/api';
import { MAX_LISTINGS_PER_PAGE } from '@/lib/constants';
import { getFeedGames } from '@/lib/db/feed';
import { resolveHeaderImages, saveGames, type IncomingGame } from '@/lib/db/games';
import { MANAGE_ENABLED } from '@/lib/featureFlags';
import { extractBearerToken, validateManageToken } from '@/lib/utils/manageToken';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const location = searchParams.get('location');
    const platform = searchParams.get('platform');
    const search = searchParams.get('search');
    const cursor = searchParams.get('cursor');
    const limitParam = searchParams.get('limit');

    const parsedLimit = limitParam ? Number.parseInt(limitParam, 10) : NaN;
    const normalizedLimit = Number.isFinite(parsedLimit)
      ? Math.min(Math.max(parsedLimit, 1), MAX_LISTINGS_PER_PAGE)
      : null;
    const usePagination = Boolean(cursor) || normalizedLimit !== null;
    const pageSize = normalizedLimit ?? MAX_LISTINGS_PER_PAGE;

    const where: Prisma.ListingWhereInput = {
      isActive: true,
      ...(location && { location }),
      ...(platform && { platform: platform as any }),
    };

    const searchTerm = search?.trim();
    if (searchTerm) {
      const searchConditions: Prisma.ListingWhereInput[] = [
        { id: searchTerm },
        { steamId: { contains: searchTerm } },
        {
          username: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          games: {
            some: {
              type: 'OFFERING',
              game: {
                name: {
                  contains: searchTerm,
                  mode: 'insensitive',
                },
              },
            },
          },
        },
      ];

      const numericSearch = Number.parseInt(searchTerm, 10);
      if (!Number.isNaN(numericSearch)) {
        searchConditions.push({
          games: {
            some: {
              type: 'OFFERING',
              game: {
                steamAppId: numericSearch,
              },
            },
          },
        });
      }

      where.OR = searchConditions;
    }

    const [listings, totalCount] = await Promise.all([
      prisma.listing.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        ...(usePagination && cursor
          ? {
            cursor: { id: cursor },
            skip: 1,
          }
          : {}),
        ...(usePagination ? { take: pageSize + 1 } : {}),
      }),
      prisma.listing.count({ where }),
    ]);

    let nextCursor: string | null = null;
    let pageItems = listings;

    if (usePagination) {
      const hasMore = listings.length > pageSize;
      if (hasMore) {
        pageItems = listings.slice(0, pageSize);
        nextCursor = pageItems[pageItems.length - 1]?.id ?? null;
      }
    }

    const feedGames = await getFeedGames(pageItems.map((l) => l.id));

    // Filter sensitive data for anonymous users
    const sanitizedListings = pageItems.map((listing) => {
      const withGames = { ...listing, ...feedGames.get(listing.id) };
      if (!listing.showSteamId) {
        // Remove sensitive data for anonymous listings (but keep avatarUrl)
        return {
          ...withGames,
          steamId: null,
          steamProfileUrl: null,
          username: null,
        };
      }
      return withGames;
    });

    // Add cache headers to reduce API calls
    return NextResponse.json(
      usePagination
        ? {
          items: sanitizedListings,
          nextCursor,
          totalCount,
        }
        : sanitizedListings,
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    );
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

    if (!steamId || !steamProfileUrl || !location) {
      return NextResponse.json(
        { error: 'Missing required fields: steamId, steamProfileUrl, location' },
        { status: 400 }
      );
    }

    // Convert any vanity URL or case-sensitive ID to numeric Steam64 ID
    const normalizedSteamId = await getSteamIdFromUrl(steamProfileUrl);

    if (!normalizedSteamId) {
      return NextResponse.json(
        { error: 'Invalid Steam ID or unable to resolve Steam profile' },
        { status: 400 }
      );
    }

    const existingListing = await prisma.listing.findUnique({
      where: { steamId: normalizedSteamId },
      include: { games: true },
    });

    // Overwriting an existing listing needs a manage token for that Steam
    // account. Only enforced while the manage flow is live, since that's the
    // only place tokens can be obtained.
    if (existingListing && MANAGE_ENABLED) {
      const token = extractBearerToken(request.headers.get('authorization'));
      const validated = await validateManageToken(token);

      if (!validated || validated.steamId !== normalizedSteamId) {
        return NextResponse.json(
          {
            error: 'A listing already exists for this Steam account',
            code: 'LISTING_EXISTS',
          },
          { status: 409 }
        );
      }
    }

    const allGames: IncomingGame[] = [...lookingFor, ...offering];

    // Validate before touching anything, so a bad payload can't leave the
    // existing listing half-rewritten.
    const invalidGames = allGames.filter((g) => !g.appId);
    if (invalidGames.length > 0) {
      return NextResponse.json(
        { error: 'Some games are missing appId', details: invalidGames },
        { status: 400 }
      );
    }

    const gamePlatform: Platform = platform || 'STEAM';
    const gameIdByAppId = await saveGames(allGames, gamePlatform);

    // Deduplicate by name (case-insensitive) before linking, so different
    // editions/regions of the same game don't show up twice.
    const uniqueByName = (games: IncomingGame[]) =>
      Array.from(
        new Map(games.map((g) => [g.name.toLowerCase().trim(), g])).values()
      );
    const links = (games: IncomingGame[], type: 'LOOKING_FOR' | 'OFFERING') =>
      uniqueByName(games).map((g) => ({
        gameId: gameIdByAppId.get(g.appId)!,
        type,
      }));
    const gameLinks = [
      ...links(lookingFor, 'LOOKING_FOR'),
      ...links(offering, 'OFFERING'),
    ];

    const listingData = {
      username: username || null,
      avatarUrl: avatarUrl || null,
      steamLevel: steamLevel || null,
      accountYears: accountYears || null,
      platform: gamePlatform,
      steamProfileUrl,
      description: description || null,
      location,
      showSteamId: showSteamId || false,
    };

    // One transaction: a failure part-way leaves the old listing intact
    // instead of a listing with no games.
    const listing = await prisma.$transaction(async (tx) => {
      if (existingListing) {
        await tx.listingGame.deleteMany({
          where: { listingId: existingListing.id },
        });
      }

      const saved = await tx.listing.upsert({
        where: { steamId: normalizedSteamId },
        // createdAt stays the original post date, so editing a listing
        // doesn't move it to the top of the feed. updatedAt is automatic.
        update: listingData,
        create: { steamId: normalizedSteamId, ...listingData },
      });

      await tx.listingGame.createMany({
        data: gameLinks.map((link) => ({ ...link, listingId: saved.id })),
        skipDuplicates: true,
      });

      return saved;
    });

    // Revalidate so the author sees their listing right away while other
    // visitors keep the cached page.
    revalidatePath('/');
    revalidatePath(`/listings/${listing.id}`);

    // Swap guessed header URLs for Steam's canonical ones without holding
    // up the response, then re-render the pages that show them.
    const listingId = listing.id;
    after(async () => {
      try {
        const updated = await resolveHeaderImages(
          allGames.map((g) => g.appId),
          gamePlatform
        );
        if (updated > 0) {
          revalidatePath('/');
          revalidatePath(`/listings/${listingId}`);
        }
      } catch (error) {
        console.error('Failed to resolve header images:', error);
      }
    });

    // The client only needs to know it worked; echoing back every game
    // (up to 1,000+) was wasted payload.
    return NextResponse.json(
      { id: listing.id },
      { status: existingListing ? 200 : 201 }
    );
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