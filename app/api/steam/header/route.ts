import { NextRequest, NextResponse, after } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getGameDetails, getHeaderImages } from '@/lib/steam/api';
import { prisma } from '@/lib/db/db';
import { servesRealImage } from '@/lib/steam/images';

// A hit is authoritative — it has been checked against the CDN and written
// back to the DB, so it is worth holding on to.
const HIT_CACHE = {
  'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
};
// A miss is usually transient (store API hiccup, delisted or region-gated
// app). Sharing the 24h header froze every miss for a full day for every
// visitor, while hits only ever lived in component state — so each reload
// could only lose ground, and the feed decayed a little more each time.
const MISS_CACHE = { 'Cache-Control': 'public, s-maxage=300' };

export async function GET(request: NextRequest) {
  const appIdParam = request.nextUrl.searchParams.get('appId');
  const appId = Number(appIdParam);

  if (!appId || Number.isNaN(appId)) {
    return NextResponse.json({ headerImage: null }, { status: 400 });
  }

  // Fresh lookup: this route only runs once the stored URL has already broken,
  // and a cached miss would otherwise be replayed for a day. GetItems first:
  // appdetails is throttled per game and, with many visitors repairing at
  // once, was the call most likely to come back empty.
  const candidate =
    (await getHeaderImages([appId], { fresh: true })).get(appId) ??
    (await getGameDetails(appId, { fresh: true }))?.header_image;

  // Steam answers a missing asset with a blank 200 rather than a 404, so the
  // URL has to be checked by what it serves before it's worth handing out.
  const headerImage =
    candidate && (await servesRealImage(candidate)) ? candidate : null;

  if (!headerImage) {
    return NextResponse.json({ headerImage: null }, { headers: MISS_CACHE });
  }

  // Persist so this game costs one store API call overall rather than one
  // per viewer, and so the feed stops serving the broken URL.
  const repaired = await prisma.game
    .updateMany({ where: { steamAppId: appId }, data: { headerImage } })
    .catch(() => null);

  // The homepage is `revalidate = false`, so a repaired row would keep
  // being served from the old static render without this.
  if (repaired && repaired.count > 0) {
    revalidatePath('/');

    // Listing pages are `revalidate = false` too and render the same art, so
    // they go stale the same way. Deferred: the client already has the
    // repaired URL, and this can fan out across many paths.
    after(async () => {
      try {
        const game = await prisma.game.findUnique({
          where: {
            steamAppId_platform: { steamAppId: appId, platform: 'STEAM' },
          },
          select: { id: true },
        });
        if (!game) return;

        const affected = await prisma.listingGame.findMany({
          where: { gameId: game.id },
          select: { listingId: true },
          distinct: ['listingId'],
        });

        for (const { listingId } of affected) {
          revalidatePath(`/listings/${listingId}`);
        }
      } catch (error) {
        console.error(
          `Failed to revalidate listings for appId ${appId}:`,
          error
        );
      }
    });
  }

  return NextResponse.json({ headerImage }, { headers: HIT_CACHE });
}
