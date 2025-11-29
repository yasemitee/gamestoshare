import { NextRequest, NextResponse } from 'next/server';
import { getSteamIdFromUrl, getCompleteProfile } from '@/lib/steam/api';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const profileUrl = searchParams.get('profileUrl');

    if (!profileUrl) {
      return NextResponse.json(
        { error: 'profileUrl parameter is required' },
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

    const profile = await getCompleteProfile(steamId);

    // Check if profile is private
    if (!profile.isPublic) {
      return NextResponse.json(
        { error: 'Steam profile is private. Please make your profile public to use this service.' },
        { status: 403 }
      );
    }

    return NextResponse.json(profile);
  } catch (error: any) {
    console.error('Steam API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch Steam profile' },
      { status: 500 }
    );
  }
}