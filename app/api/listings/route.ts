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
        ...(location && { location }),
        ...(platform && { platform: platform as any }),
      },
      include: {
        user: true,
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
    const {
      userId,
      platform,
      steamProfileUrl,
      description,
      location,
      lookingFor = [],
      offering = [],
    } = body;

    if (!userId || !steamProfileUrl || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const listing = await prisma.listing.create({
      data: {
        userId,
        platform: platform || 'STEAM',
        steamProfileUrl,
        description,
        location,
        games: {
          create: [
            ...lookingFor.map((steamAppId: number) => ({
              type: 'LOOKING_FOR' as const,
              game: {
                connectOrCreate: {
                  where: {
                    steamAppId_platform: {
                      steamAppId,
                      platform: platform || 'STEAM',
                    },
                  },
                  create: {
                    steamAppId,
                    name: `Game ${steamAppId}`, // TODO: Update with Steam API
                    platform: platform || 'STEAM',
                  },
                },
              },
            })),
            ...offering.map((steamAppId: number) => ({
              type: 'OFFERING' as const,
              game: {
                connectOrCreate: {
                  where: {
                    steamAppId_platform: {
                      steamAppId,
                      platform: platform || 'STEAM',
                    },
                  },
                  create: {
                    steamAppId,
                    name: `Game ${steamAppId}`, // TODO: Update with Steam API
                    platform: platform || 'STEAM',
                  },
                },
              },
            })),
          ],
        },
      },
      include: {
        user: true,
        games: {
          include: {
            game: true,
          },
        },
      },
    });

    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    console.error('Error creating listing:', error);
    return NextResponse.json(
      { error: 'Failed to create listing' },
      { status: 500 }
    );
  }
}