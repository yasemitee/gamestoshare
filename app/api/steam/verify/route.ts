import { NextRequest, NextResponse } from 'next/server';
import { getSteamIdFromUrl, getProfileBio, resolveVanityUrl } from '@/lib/steam/api';
import { verifySecurityCode } from '@/lib/steam/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { steamId, verificationCode, profileUrl, securityCode } = body;

    const code = verificationCode || securityCode;
    let id = steamId;

    console.log('[Verify] Initial steamId:', steamId, 'profileUrl:', profileUrl);

    if (!id && profileUrl) {
      id = await getSteamIdFromUrl(profileUrl);
      console.log('[Verify] Resolved from profileUrl:', id);
    }

    if (id && !/^\d{17}$/.test(id)) {
      console.log('[Verify] Resolving vanity URL:', id);
      const resolvedId = await resolveVanityUrl(id);
      if (resolvedId) {
        id = resolvedId;
        console.log('[Verify] Resolved to Steam64 ID:', id);
      } else {
        console.log('[Verify] Failed to resolve vanity URL');
        return NextResponse.json(
          { 
            verified: false, 
            error: 'Invalid Steam ID or custom URL' 
          },
          { status: 200 }
        );
      }
    }

    if (!id || !code) {
      return NextResponse.json(
        { error: 'Steam ID and verification code are required' },
        { status: 400 }
      );
    }

    console.log('[Verify] Fetching bio for Steam64 ID:', id);
    const bio = await getProfileBio(id);
    
    if (!bio) {
      return NextResponse.json(
        { 
          verified: false, 
          error: 'Could not fetch Steam bio or bio is empty' 
        },
        { status: 200 }
      );
    }

    const isVerified = verifySecurityCode(bio, code);

    return NextResponse.json({
      verified: isVerified,
      steamId: id,
      bio: bio || null,
      message: isVerified 
        ? 'Verification successful' 
        : 'Verification code not found in bio',
    });
  } catch (error: any) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify security code' },
      { status: 500 }
    );
  }
}