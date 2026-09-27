import { Platform, Prisma, PrismaClient } from '@prisma/client';
import { prisma } from '@/lib/db/db';
import { getHeaderImages } from '@/lib/steam/api';

type DbClient = PrismaClient | Prisma.TransactionClient;

const constructedHeader = (appId: number) =>
  `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg`;

export interface IncomingGame {
  appId: number;
  name: string;
  iconUrl?: string | null;
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
      // A guess that works for most older games; resolveHeaderImages swaps
      // it for Steam's canonical URL right after the save.
      headerImage: constructedHeader(g.appId),
      releaseYear: g.releaseYear ?? null,
      priceInCents: g.priceInCents ?? null,
    })),
    skipDuplicates: true,
  });

  // Refresh existing rows. Missing values keep what's stored, and a
  // "Game <appId>" placeholder never replaces a real name: games are shared
  // by every listing. headerImage is never taken from the client — the
  // create page used to send the constructed URL, which overwrote every
  // repaired header on each save and re-broke exactly the games that needed
  // repairing. It's server-resolved only (resolveHeaderImages).
  await db.$executeRaw`
    UPDATE games AS g SET
      name = CASE WHEN v.name ~ '^Game [0-9]+$' THEN g.name ELSE v.name END,
      "iconUrl" = COALESCE(v.icon, g."iconUrl"),
      "releaseYear" = COALESCE(v.year, g."releaseYear"),
      "priceInCents" = COALESCE(v.price, g."priceInCents"),
      "updatedAt" = NOW()
    FROM UNNEST(
      ${unique.map((g) => g.appId)}::int[],
      ${unique.map((g) => g.name)}::text[],
      ${unique.map((g) => g.iconUrl ?? null)}::text[],
      ${unique.map((g) => g.releaseYear ?? null)}::int[],
      ${unique.map((g) => g.priceInCents ?? null)}::int[]
    ) AS v(app_id, name, icon, year, price)
    WHERE g."steamAppId" = v.app_id
      AND g.platform = ${platform}::"Platform"
  `;

  const rows = await db.game.findMany({
    where: { steamAppId: { in: [...byAppId.keys()] }, platform },
    select: { id: true, steamAppId: true },
  });
  return new Map(rows.map((r) => [r.steamAppId, r.id]));
}

/**
 * Replaces guessed header URLs with Steam's canonical ones, for the given
 * games only. The constructed `/steam/apps/<id>/header.jpg` path 404s (or
 * serves a blank 200) for many recent releases, whose art lives under a
 * content-hashed path only Steam's store knows. Rows already holding a
 * canonical URL are skipped, so each game is resolved once overall.
 *
 * Meant to run in `after()`. A failed lookup just leaves the row for the
 * next save (or the client-side repair) to pick up. Returns how many rows
 * changed.
 */
export async function resolveHeaderImages(
  appIds: number[],
  platform: Platform = 'STEAM'
): Promise<number> {
  if (appIds.length === 0) return 0;

  const pending = await prisma.game.findMany({
    where: {
      steamAppId: { in: appIds },
      platform,
      OR: [
        { headerImage: null },
        { headerImage: { startsWith: 'https://cdn.cloudflare.steamstatic.com/steam/apps/' } },
      ],
    },
    select: { steamAppId: true, headerImage: true },
  });
  const todo = pending
    .filter((g) => !g.headerImage || g.headerImage === constructedHeader(g.steamAppId))
    .map((g) => g.steamAppId);
  if (todo.length === 0) return 0;

  const headers = await getHeaderImages(todo);
  if (headers.size === 0) return 0;

  return prisma.$executeRaw`
    UPDATE games AS g SET "headerImage" = v.header, "updatedAt" = NOW()
    FROM UNNEST(
      ${[...headers.keys()]}::int[],
      ${[...headers.values()]}::text[]
    ) AS v(app_id, header)
    WHERE g."steamAppId" = v.app_id
      AND g.platform = ${platform}::"Platform"
  `;
}
