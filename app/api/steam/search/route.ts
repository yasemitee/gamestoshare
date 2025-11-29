import { NextRequest, NextResponse } from 'next/server';

const STEAM_STORE_API = 'https://store.steampowered.com/api';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.trim().length < 1) {
      return NextResponse.json([]);
    }

    const response = await fetch(
      `${STEAM_STORE_API}/storesearch/?term=${encodeURIComponent(query)}&l=english&cc=US`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      console.error('Steam search API error:', response.status);
      return NextResponse.json([]);
    }

    const data = await response.json();
    const items = data?.items || [];

    const games = items
      .filter((item: any) => item.type === 'app')
      .slice(0, 5)
      .map((item: any) => ({
        appId: item.id,
        name: item.name,
        iconUrl: item.tiny_image,
      }));

    return NextResponse.json(games);
  } catch (error) {
    console.error('Error searching Steam games:', error);
    return NextResponse.json([]);
  }
}
