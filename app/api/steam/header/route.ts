import { NextRequest, NextResponse } from 'next/server';
import { getGameDetails } from '@/lib/steam/api';

export async function GET(request: NextRequest) {
  const appIdParam = request.nextUrl.searchParams.get('appId');
  const appId = Number(appIdParam);

  if (!appId || Number.isNaN(appId)) {
    return NextResponse.json({ headerImage: null }, { status: 400 });
  }

  const details = await getGameDetails(appId);
  const headerImage = details?.header_image ?? null;

  return NextResponse.json(
    { headerImage },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      },
    }
  );
}
