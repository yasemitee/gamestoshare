-- Step 1 of 2. Stop depending on listings.expiresAt and listings.views
-- (never read; listings no longer expire, views was never counted) and drop
-- indexes that don't help any query.
--
-- The columns themselves are dropped in a follow-up migration, after this
-- release is live: the previous release still selects them while the new
-- build runs, so dropping them here would break production mid-deploy.

-- New code no longer writes expiresAt.
ALTER TABLE "listings" ALTER COLUMN "expiresAt" DROP NOT NULL;

-- Duplicate of the unique index listings_steamId_key.
DROP INDEX IF EXISTS "listings_steamId_idx";
-- Only STEAM exists and isActive is always true: no selectivity.
DROP INDEX IF EXISTS "listings_platform_idx";
DROP INDEX IF EXISTS "listings_isActive_idx";
-- Nothing filters on expiresAt anymore.
DROP INDEX IF EXISTS "listings_expiresAt_idx";

-- steamAppId alone was unique as well as (steamAppId, platform), which made
-- the platform half meaningless. Keep the pair.
DROP INDEX IF EXISTS "games_steamAppId_key";
