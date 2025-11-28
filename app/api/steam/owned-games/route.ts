import { NextRequest, NextResponse } from 'next/server';
import { getSteamIdFromUrl, getOwnedGamesWithPrices } from '@/lib/steam/api';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const profileUrl = searchParams.get('profileUrl');
    const limit = parseInt(searchParams.get('limit') || '50');

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

    const data = await getOwnedGamesWithPrices(steamId, limit);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Steam API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch owned games' },
      { status: 500 }
    );
  }
}
