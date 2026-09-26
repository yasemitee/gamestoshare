import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/db';
import { getProfileBio } from '@/lib/steam/api';
import { verifySecurityCode } from '@/lib/steam/utils';
import {
  consumeManageChallenge,
  createManageToken,
  findActiveManageChallenge,
} from '@/lib/utils/manageToken';
import { MANAGE_ENABLED } from '@/lib/featureFlags';

export async function POST(request: NextRequest) {
  if (!MANAGE_ENABLED) {
    return NextResponse.json(
      { error: 'Managing listings is not available yet' },
      { status: 503 }
    );
  }

  try {
    const { challengeId } = await request.json();

    if (!challengeId) {
      return NextResponse.json(
        { error: 'challengeId is required' },
        { status: 400 }
      );
    }

    const challenge = await findActiveManageChallenge(challengeId);

    if (!challenge) {
      return NextResponse.json(
        { verified: false, error: 'Verification code expired' },
        { status: 410 }
      );
    }

    const bio = await getProfileBio(challenge.steamId);
    const isVerified = verifySecurityCode(bio, challenge.code);

    if (!isVerified) {
      return NextResponse.json({
        verified: false,
        error: 'Verification code not found in bio',
      });
    }

    if (!(await consumeManageChallenge(challenge.id))) {
      return NextResponse.json(
        { verified: false, error: 'Verification code expired' },
        { status: 410 }
      );
    }

    const listing = await prisma.listing.findUnique({
      where: { steamId: challenge.steamId },
    });

    if (!listing) {
      return NextResponse.json(
        { error: 'No listing found for this Steam account' },
        { status: 404 }
      );
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
