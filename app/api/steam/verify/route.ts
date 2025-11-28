import { NextRequest, NextResponse } from 'next/server';
import { getSteamIdFromUrl, getProfileBio } from '@/lib/steam/api';
import { verifySecurityCode } from '@/lib/steam/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profileUrl, securityCode } = body;

    if (!profileUrl || !securityCode) {
      return NextResponse.json(
        { error: 'profileUrl and securityCode are required' },
        { status: 400 }
      );
    }

    const steamId = await getSteamIdFromUrl(profileUrl);

    if (!steamId) {
      return NextResponse.json(
        { error: 'Invalid Steam profile URL' },
        { status: 400 }
      );
    }

    const bio = await getProfileBio(steamId);
    const isVerified = verifySecurityCode(bio, securityCode);

    return NextResponse.json({
      verified: isVerified,
      steamId,
      bio: bio || null,
    });
  } catch (error: any) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify security code' },
      { status: 500 }
    );
  }
}