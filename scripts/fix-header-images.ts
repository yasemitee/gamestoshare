/**
 * Backfill broken game header images.
 *
 * For each game, checks whether its stored header image URL actually resolves.
 * If it 404s (common for recent titles whose assets live under a hashed path),
 * fetches the real header_image from the Steam store API and updates the DB.
 *
 * Dry-run (report only):  npx tsx scripts/fix-header-images.ts
 * Apply changes:          npx tsx scripts/fix-header-images.ts --apply
 */

import { prisma } from '../app/lib/db/db';
import { getGameDetails } from '../app/lib/steam/api';

const APPLY = process.argv.includes('--apply');
const HEAD_CONCURRENCY = 12;
const STORE_DELAY_MS = 800;

const constructed = (appId: number) =>
  `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg`;

async function head(url: string): Promise<number> {
  try {
    const r = await fetch(url, { method: 'HEAD' });
    return r.status;
  } catch {
    return 0;
  }
}

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

  const games = await prisma.game.findMany({
    select: { id: true, steamAppId: true, headerImage: true, name: true },
  });
  console.log(`Loaded ${games.length} games. Checking current header URLs...`);

  const broken: typeof games = [];
  let okCount = 0;
  await pool(games, HEAD_CONCURRENCY, async (g) => {
    const url = g.headerImage || constructed(g.steamAppId);
    const status = await head(url);
    if (status === 200) okCount++;
    else broken.push(g);
  });

  console.log(`OK: ${okCount} | Broken: ${broken.length}`);
  if (broken.length === 0) {
    console.log('Nothing to fix.');
    await prisma.$disconnect();
    return;
  }

  // Phase 1: resolve real URLs over the network (no DB writes here).
  const updates: { id: string; real: string }[] = [];
  let unresolved = 0;
  for (const g of broken) {
    const details = await getGameDetails(g.steamAppId);
    const real: string | undefined = details?.header_image;
    if (real && (await head(real)) === 200) {
      console.log(`✓ ${g.steamAppId} ${g.name?.slice(0, 32)} -> ${real.split('?')[0]}`);
      updates.push({ id: g.id, real });
    } else {
      console.log(`✗ ${g.steamAppId} ${g.name?.slice(0, 32)} — no working header`);
      unresolved++;
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
  if (!APPLY) console.log('\nRe-run with --apply to write these changes.');

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
