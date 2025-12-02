import { NextRequest, NextResponse } from 'next/server';
import { getSteamIdFromUrl, getSteamWishlist } from '@/lib/steam/api';

// Cache wishlist for 10 minutes - wishlist doesn't change frequently
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

    const data = await getSteamWishlist(steamId);

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
      },
    });
  } catch (error: any) {
    console.error('Steam API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user wishlist' },
      { status: 500 }
    );
  }
}