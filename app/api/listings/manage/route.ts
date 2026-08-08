import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/db';
import { extractBearerToken, validateManageToken } from '@/lib/utils/manageToken';

export async function GET(request: NextRequest) {
  try {
    const token = extractBearerToken(request.headers.get('authorization'));
    const validated = await validateManageToken(token);

    if (!validated) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const listing = await prisma.listing.findUnique({
      where: { steamId: validated.steamId },
      include: {
        games: {
          include: { game: true },
        },
      },
    });

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ listing });
  } catch (error) {
    console.error('Error fetching manageable listing:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listing' },
      { status: 500 }
    );
  }
}
