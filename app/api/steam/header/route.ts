import { NextRequest, NextResponse } from 'next/server';
import { getGameDetails } from '@/lib/steam/api';
import { prisma } from '@/lib/db/db';
import { servesRealImage } from '@/lib/steam/images';

const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
};

export async function GET(request: NextRequest) {
  const appIdParam = request.nextUrl.searchParams.get('appId');
  const appId = Number(appIdParam);

  if (!appId || Number.isNaN(appId)) {
    return NextResponse.json({ headerImage: null }, { status: 400 });
  }

  const details = await getGameDetails(appId);
  const candidate = details?.header_image;

  // Steam answers a missing asset with a blank 200 rather than a 404, so the
  // URL has to be checked by what it serves before it's worth handing out.
  const headerImage =
    candidate && (await servesRealImage(candidate)) ? candidate : null;

  // Persist so this game costs one store API call overall rather than one
  // per viewer, and so the feed stops serving the broken URL.
  if (headerImage) {
    await prisma.game
      .updateMany({ where: { steamAppId: appId }, data: { headerImage } })
      .catch(() => undefined);
  }

  return NextResponse.json({ headerImage }, { headers: CACHE_HEADERS });
}
