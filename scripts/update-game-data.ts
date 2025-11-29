/**
 * Script to update existing games in the database with releaseYear and priceInCents
 * Run with: npx tsx scripts/update-game-data.ts
 */

import { prisma } from '../app/lib/db/db';
import { getGameDetails } from '../app/lib/steam/api';

async function updateGameData() {
  console.log('Starting game data update...');
  
  // Get all games from database
  const games = await prisma.game.findMany({
    where: {
      OR: [
        { releaseYear: null },
        { priceInCents: null },
      ],
    },
  });

  console.log(`Found ${games.length} games to update`);

  let updated = 0;
  let failed = 0;

  for (const game of games) {
    try {
      console.log(`Updating ${game.name} (${game.steamAppId})...`);
      
      const details = await getGameDetails(game.steamAppId);
      
      if (details) {
        const releaseYear = details.release_date?.date 
          ? new Date(details.release_date.date).getFullYear()
          : null;
        
        const priceInCents = details.price_overview?.final || null;

        await prisma.game.update({
          where: { id: game.id },
          data: {
            releaseYear,
            priceInCents,
          },
        });

        console.log(`✓ Updated: releaseYear=${releaseYear}, priceInCents=${priceInCents}`);
        updated++;
      } else {
        console.log(`✗ No details found`);
        failed++;
      }

      // Wait a bit to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`✗ Failed to update ${game.name}:`, error);
      failed++;
    }
  }

  console.log('\n=== Update Complete ===');
  console.log(`Updated: ${updated}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${games.length}`);
  
  await prisma.$disconnect();
}

updateGameData().catch(console.error);
