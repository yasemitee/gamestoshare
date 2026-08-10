import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/db';
import { getSteamIdFromUrl, getProfileBio } from '@/lib/steam/api';
import { verifySecurityCode } from '@/lib/steam/utils';
import { STEAM_VERIFICATION_CODE } from '@/lib/constants';
import { createManageToken } from '@/lib/utils/manageToken';
import { MANAGE_ENABLED } from '@/lib/featureFlags';

export async function POST(request: NextRequest) {
  if (!MANAGE_ENABLED) {
    return NextResponse.json(
      { error: 'Managing listings is not available yet' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { listingId, steamProfileUrl } = body;

    if (!listingId && !steamProfileUrl) {
      return NextResponse.json(
        { error: 'listingId or steamProfileUrl is required' },
        { status: 400 }
      );
    }

    const listing = listingId
      ? await prisma.listing.findUnique({ where: { id: listingId } })
      : await (async () => {
          const resolvedSteamId = await getSteamIdFromUrl(steamProfileUrl);
          if (!resolvedSteamId) return null;
          return prisma.listing.findUnique({
            where: { steamId: resolvedSteamId },
          });
        })();

    if (!listing) {
      return NextResponse.json(
        { error: 'No listing found for this Steam account' },
        { status: 404 }
      );
    }

    const bio = await getProfileBio(listing.steamId);
    const isVerified = verifySecurityCode(bio, STEAM_VERIFICATION_CODE);

    if (!isVerified) {
      return NextResponse.json({
        verified: false,
        error: 'Verification code not found in bio',
      });
    }

    const { token, expiresAt } = await createManageToken(listing.steamId);

    return NextResponse.json({
      verified: true,
      token,
      steamId: listing.steamId,
      listingId: listing.id,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error('Error verifying listing ownership:', error);
    return NextResponse.json(
      { error: 'Failed to verify listing ownership' },
      { status: 500 }
    );
  }
}
