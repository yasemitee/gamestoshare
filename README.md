# GamesToShare

This project is a Next.js 16 (App Router, TypeScript) application integrating Steam data and a PostgreSQL database via Prisma. UI is built with Tailwind CSS.

## Overview

- Create and display Steam listings (looking for / offering)
- Steam ID verification (URL, vanity, numeric) with normalized username
- Auto-populate location, wishlist, and owned games
- Upsert by `steamId` (new post replaces previous for same ID)
- Listing expiration: 30 days (`expiresAt` + cleanup endpoint)
- Privacy control: `showSteamId` toggles displaying username

## Architecture

- Frontend: Next.js 16 (App Router, server/client components)
- Data Layer: Prisma ORM with PostgreSQL (Neon compatible)
- Steam Integration: server-side API routes for profile/wishlist/owned games
- Styling: Tailwind CSS with custom color system (`app/lib/colors.ts`) and variables (`app/global.css`)

## Project Structure

- `app/` pages, components, and API routes
- `app/api/listings/route.ts` — GET/POST listings (with upsert)
- `app/api/listings/cleanup/route.ts` — disable expired listings
- `app/api/steam/*` — Steam proxy endpoints (profile, wishlist, owned games)
- `app/listings/create/page.tsx` — listing creation UI
- `app/lib/steam/*` — Steam utilities and API wrappers
- `prisma/schema.prisma` — database schema and migrations
- `app/lib/db/db.ts` — Prisma client initialization

## Requirements

- Node.js 20+
- PostgreSQL database and `DATABASE_URL`
- Optional: `STEAM_API_KEY` if calling Steam directly (routes currently proxy server-side)

## Environment Variables

Create `.env` with:

```
DATABASE_URL="postgresql://<user>:<password>@<host>/<db>?sslmode=require"
CRON_SECRET="<your_secret_string>"
STEAM_API_KEY="<optional>"
```

## Installation & Commands

```bash
# install deps
npm install

# development
npm run dev

# prisma client
npx prisma generate

# migrations (development)
npx prisma migrate dev --name <migration_name>

# migrations (deploy)
npx prisma migrate deploy

# production build
npm run build
npm run start
```

## Database Models

- `Listing`:
  - `steamId` (unique), `username?`, `platform`, `steamProfileUrl`, `description?`, `location`, `showSteamId`, `isActive`, `expiresAt`, timestamps
  - Relation: `games` via `ListingGame`
- `Game`:
  - `steamAppId` (unique), `name`, `platform`, `iconUrl`, `headerImage?`
- `ListingGame`:
  - Links `Listing`↔`Game` with `type` in {`LOOKING_FOR`,`OFFERING`}

## Key API Routes

- `GET /api/listings` — active, non-expired listings with related games
- `POST /api/listings` — upsert listing by `steamId`; recreate game relations after upsert
- `POST /api/listings/cleanup` — set `isActive=false` for expired listings; requires `Authorization: Bearer <CRON_SECRET>`
- `GET /api/steam/profile` — Steam profile and normalized username
- `GET /api/steam/wishlist` — wishlist
- `GET /api/steam/owned-games` — owned games (filters free, sorts by release year)

## Listing Creation Flow

1. Input Steam ID (any format)
2. Verify: fetch profile, username, and autoload location/games
3. Select games for "Looking for" and "Offering"
4. Set privacy `showSteamId`
5. Submit: upsert listing, set `expiresAt` + 30 days

## Development Notes

- Colors/gradients: `app/lib/colors.ts`
- Hook: `useSteamVerification` centralizes Steam verification and data fetch
- Utilities: `extractCleanSteamId`, `normalizeSteamId`
- Prisma client logs reduced to `error|warn` in dev to avoid query noise

## Cleanup Job

Trigger periodically:

```bash
curl -X POST \
	-H "Authorization: Bearer $CRON_SECRET" \
	https://<host>/api/listings/cleanup
```

## Troubleshooting

- Upsert failing: ensure game relations are created after listing upsert (`app/api/listings/route.ts` handles this via `createMany`)
- Dev port conflicts: terminate other Next.js instances
  ```bash
  pkill -f "next dev"
  ```
- Excessive Prisma logs: confirm `log: ['error','warn']` in `app/lib/db/db.ts`

## License

Private project.
