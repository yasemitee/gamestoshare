/**
 * Backfill broken game header images.
 *
 * NOTE: an earlier version of this script treated any HTTP 200 as proof the
 * stored URL was fine. It isn't — when a game has no art at the requested
 * path Steam replies 200 with a ~1.4KB blank placeholder JPEG instead of a
 * 404, so genuinely broken games (Battlefield 6 among them) were reported
 * healthy and skipped. Health is now judged by response size, and only
 * games that fail that check cost a store API call.
 *
 * Dry-run (report only):  npx tsx scripts/fix-header-images.ts
 * Apply changes:          npx tsx scripts/fix-header-images.ts --apply
 * Every game, not just those on live listings:  ... --all
 */

import 'dotenv/config';
import { prisma } from '../app/lib/db/db';
import { getGameDetails } from '../app/lib/steam/api';
import { servesRealImage } from '../app/lib/steam/images';

const APPLY = process.argv.includes('--apply');
const HEAD_CONCURRENCY = 12;
const STORE_DELAY_MS = 800;

const constructed = (appId: number) =>
  `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg`;

async function pool<T>(items: T[], size: number, fn: (item: T) => Promise<void>) {
  let i = 0;
  const workers = Array.from({ length: size }, async () => {
    while (i < items.length) {
      const idx = i++;
      await fn(items[idx]);
    }
  });
  await Promise.all(workers);
}

async function main() {
  console.log(`Mode: ${APPLY ? 'APPLY (writing to DB)' : 'DRY-RUN (no writes)'}`);

  // Only games on live listings are worth spending store API calls on.
  const onlyActive = !process.argv.includes('--all');
  const games = await prisma.game.findMany({
    where: onlyActive
      ? { listings: { some: { listing: { isActive: true } } } }
      : undefined,
    select: { id: true, steamAppId: true, headerImage: true, name: true },
  });
  console.log(
    `Loaded ${games.length} games${onlyActive ? ' (active listings only; pass --all for every game)' : ''}. Checking what each URL actually serves...`
  );

  const broken: typeof games = [];
  let okCount = 0;
  await pool(games, HEAD_CONCURRENCY, async (g) => {
    const url = g.headerImage || constructed(g.steamAppId);
    if (await servesRealImage(url)) okCount++;
    else broken.push(g);
  });

  console.log(`Already usable: ${okCount} | Serving blank/missing: ${broken.length}`);
  if (broken.length === 0) {
    console.log('Nothing to fix.');
    await prisma.$disconnect();
    return;
  }

  // Phase 1: resolve real URLs over the network (no DB writes here).
  const updates: { id: string; real: string }[] = [];
  let unresolved = 0;
  let done = 0;
  for (const g of broken) {
    const details = await getGameDetails(g.steamAppId);
    const real: string | undefined = details?.header_image;
    if (real && (await servesRealImage(real))) {
      console.log(`✓ ${g.steamAppId} ${g.name?.slice(0, 40)}`);
      updates.push({ id: g.id, real });
    } else {
      console.log(`✗ ${g.steamAppId} ${g.name?.slice(0, 40)} — no working header`);
      unresolved++;
    }
    if (++done % 25 === 0) {
      console.log(`  ...${done}/${broken.length} checked (${updates.length} resolved)`);
    }
    await new Promise((r) => setTimeout(r, STORE_DELAY_MS));
  }

  // Phase 2: write all updates in a tight loop with retry/reconnect.
  let fixed = 0;
  if (APPLY && updates.length > 0) {
    console.log(`\nWriting ${updates.length} updates to DB...`);
    for (const u of updates) {
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          await prisma.game.update({
            where: { id: u.id },
            data: { headerImage: u.real },
          });
          fixed++;
          break;
        } catch (err) {
          if (attempt === 3) {
            console.error(`  failed to update ${u.id} after 3 tries`);
          } else {
            await new Promise((r) => setTimeout(r, 1500 * attempt));
          }
        }
      }
    }
  }

  console.log('\n=== Summary ===');
  console.log(`Broken checked: ${broken.length}`);
  console.log(`Resolved: ${updates.length}`);
  console.log(`${APPLY ? 'Updated' : 'Would update'}: ${APPLY ? fixed : updates.length}`);
  console.log(`Still unresolved: ${unresolved}`);
  if (!APPLY) {
    console.log('\nRe-run with --apply to write these changes.');
  } else if (fixed > 0) {
    console.log(
      '\nNOTE: the homepage is `revalidate = false`, so it will keep serving\n' +
        'the previous render until it is revalidated — redeploy (or trigger an\n' +
        'on-demand revalidation of "/") for these images to appear.'
    );
  }

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
