/**
 * Repair games stored under the importer's placeholder name ("Game <appId>").
 *
 * The wishlist importer falls back to that name when the store API lookup
 * fails (usually rate limiting). Game rows are shared across listings, so
 * the placeholder showed up everywhere that game was listed and made it
 * unsearchable. This looks each one up again and writes the real name.
 *
 * Dry-run (report only):  npx tsx scripts/fix-game-names.ts
 * Apply changes:          npx tsx scripts/fix-game-names.ts --apply
 */

import 'dotenv/config';
import { prisma } from '../app/lib/db/db';
import { getGameDetails } from '../app/lib/steam/api';

const APPLY = process.argv.includes('--apply');
const STORE_DELAY_MS = 800;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const games = await prisma.game.findMany({
    where: { name: { startsWith: 'Game ' } },
    select: { id: true, steamAppId: true, name: true },
  });
  const placeholders = games.filter((g) => /^Game \d+$/.test(g.name.trim()));

  console.log(
    `${placeholders.length} games with a placeholder name${APPLY ? '' : ' (dry run)'}`,
  );
  if (!APPLY) {
    for (const g of placeholders) console.log(`  ${g.steamAppId}  ${g.name}`);
    console.log('\nRe-run with --apply to look them up and fix them.');
    return;
  }

  let fixed = 0;
  let missing = 0;
  for (const g of placeholders) {
    const details = await getGameDetails(g.steamAppId, { fresh: true });
    if (details?.name) {
      await prisma.game.update({
        where: { id: g.id },
        data: { name: details.name },
      });
      console.log(`  ${g.steamAppId}  ${details.name}`);
      fixed++;
    } else {
      console.log(`  ${g.steamAppId}  (no store data, left as is)`);
      missing++;
    }
    await sleep(STORE_DELAY_MS);
  }
  console.log(`\nFixed ${fixed}, left ${missing}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
