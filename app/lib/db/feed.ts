import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db/db';

// The feed shows 3 capsules per side. A few spares cover capsules whose
// art fails to load (the strip drops those and moves on to the next game).
export const FEED_GAMES_PER_SIDE = 8;

export interface FeedGameRow {
  steamAppId: number;
  name: string;
  iconUrl: string | null;
  headerImage: string | null;
}

export interface FeedGames {
  lookingFor: FeedGameRow[];
  offering: FeedGameRow[];
  lookingForTotal: number;
  offeringTotal: number;
}

interface RankedRow extends FeedGameRow {
  listingId: string;
  type: 'LOOKING_FOR' | 'OFFERING';
  total: number;
}

/**
 * Top games per side for a page of listings, plus each side's full count.
 *
 * Loading every game of every listing cost ~1.9 MB per feed page (libraries
 * run to 1,000+ games) to draw six capsules a row. Ranking and trimming in
 * one query keeps it to a few rows per listing. Order matches the product's
 * "newest and priciest first" ranking (sortGamesByYearAndPrice).
 */
export async function getFeedGames(
  listingIds: string[]
): Promise<Map<string, FeedGames>> {
  const byListing = new Map<string, FeedGames>();
  for (const id of listingIds) {
    byListing.set(id, {
      lookingFor: [],
      offering: [],
      lookingForTotal: 0,
      offeringTotal: 0,
    });
  }
  if (listingIds.length === 0) return byListing;

  const rows = await prisma.$queryRaw<RankedRow[]>(Prisma.sql`
    SELECT "listingId", type, "steamAppId", name, "iconUrl", "headerImage", total
    FROM (
      SELECT
        lg."listingId",
        lg.type::text AS type,
        g."steamAppId",
        g.name,
        g."iconUrl",
        g."headerImage",
        ROW_NUMBER() OVER (
          PARTITION BY lg."listingId", lg.type
          ORDER BY g."releaseYear" DESC NULLS LAST,
                   g."priceInCents" DESC NULLS LAST,
                   lg.id
        ) AS rank,
        COUNT(*) OVER (PARTITION BY lg."listingId", lg.type)::int AS total
      FROM listing_games lg
      JOIN games g ON g.id = lg."gameId"
      WHERE lg."listingId" = ANY(${listingIds}::text[])
    ) ranked
    WHERE rank <= ${FEED_GAMES_PER_SIDE}
    ORDER BY "listingId", type, rank
  `);

  for (const row of rows) {
    const entry = byListing.get(row.listingId);
    if (!entry) continue;
    const game: FeedGameRow = {
      steamAppId: row.steamAppId,
      name: row.name,
      iconUrl: row.iconUrl,
      headerImage: row.headerImage,
    };
    if (row.type === 'OFFERING') {
      entry.offering.push(game);
      entry.offeringTotal = row.total;
    } else {
      entry.lookingFor.push(game);
      entry.lookingForTotal = row.total;
    }
  }

  return byListing;
}
