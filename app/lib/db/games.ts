import { Platform, Prisma, PrismaClient } from '@prisma/client';
import { prisma } from '@/lib/db/db';

type DbClient = PrismaClient | Prisma.TransactionClient;

export interface IncomingGame {
  appId: number;
  name: string;
  iconUrl?: string | null;
  headerImage?: string | null;
  releaseYear?: number | null;
  priceInCents?: number | null;
}

/**
 * Makes sure every game exists in the shared games table and refreshes its
 * details, in two queries instead of one upsert per game (libraries run to
 * 1,000+ games). Returns steamAppId -> games.id.
 */
export async function saveGames(
  games: IncomingGame[],
  platform: Platform,
  db: DbClient = prisma
): Promise<Map<number, string>> {
  const byAppId = new Map(games.map((g) => [g.appId, g]));
  const unique = [...byAppId.values()];
  if (unique.length === 0) return new Map();

  await db.game.createMany({
    data: unique.map((g) => ({
      steamAppId: g.appId,
      name: g.name,
      platform,
      iconUrl: g.iconUrl ?? null,
      headerImage:
        g.headerImage ||
        `https://cdn.cloudflare.steamstatic.com/steam/apps/${g.appId}/header.jpg`,
      releaseYear: g.releaseYear ?? null,
      priceInCents: g.priceInCents ?? null,
    })),
    skipDuplicates: true,
  });

  // Refresh existing rows. Missing values keep what's stored (the client
  // never sends headerImage, and /api/steam/header may have repaired it),
  // and a "Game <appId>" placeholder never replaces a real name: games are
  // shared by every listing.
  await db.$executeRaw`
    UPDATE games AS g SET
      name = CASE WHEN v.name ~ '^Game [0-9]+$' THEN g.name ELSE v.name END,
      "iconUrl" = COALESCE(v.icon, g."iconUrl"),
      "headerImage" = COALESCE(v.header, g."headerImage"),
      "releaseYear" = COALESCE(v.year, g."releaseYear"),
      "priceInCents" = COALESCE(v.price, g."priceInCents"),
      "updatedAt" = NOW()
    FROM UNNEST(
      ${unique.map((g) => g.appId)}::int[],
      ${unique.map((g) => g.name)}::text[],
      ${unique.map((g) => g.iconUrl ?? null)}::text[],
      ${unique.map((g) => g.headerImage ?? null)}::text[],
      ${unique.map((g) => g.releaseYear ?? null)}::int[],
      ${unique.map((g) => g.priceInCents ?? null)}::int[]
    ) AS v(app_id, name, icon, header, year, price)
    WHERE g."steamAppId" = v.app_id
      AND g.platform = ${platform}::"Platform"
  `;

  const rows = await db.game.findMany({
    where: { steamAppId: { in: [...byAppId.keys()] }, platform },
    select: { id: true, steamAppId: true },
  });
  return new Map(rows.map((r) => [r.steamAppId, r.id]));
}
