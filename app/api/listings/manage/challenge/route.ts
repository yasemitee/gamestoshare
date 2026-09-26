import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/db';
import { getSteamIdFromUrl } from '@/lib/steam/api';
import { createManageChallenge } from '@/lib/utils/manageToken';
import { MANAGE_ENABLED } from '@/lib/featureFlags';

export async function POST(request: NextRequest) {
  if (!MANAGE_ENABLED) {
    return NextResponse.json(
      { error: 'Managing listings is not available yet' },
      { status: 503 }
    );
  }

  try {
    const { steamProfileUrl } = await request.json();

    if (!steamProfileUrl) {
      return NextResponse.json(
        { error: 'steamProfileUrl is required' },
        { status: 400 }
      );
    }

    const steamId = await getSteamIdFromUrl(steamProfileUrl);
    const listing = steamId
      ? await prisma.listing.findUnique({ where: { steamId } })
      : null;

    if (!listing) {
      return NextResponse.json(
        { error: 'No listing found for this Steam account' },
        { status: 404 }
      );
    }

    const challenge = await createManageChallenge(listing.steamId);

    return NextResponse.json({
      challengeId: challenge.id,
      code: challenge.code,
      steamId: listing.steamId,
      expiresAt: challenge.expiresAt.toISOString(),
    });
  } catch (error) {
    console.error('Error creating manage challenge:', error);
    return NextResponse.json(
      { error: 'Failed to start verification' },
      { status: 500 }
    );
  }
}
