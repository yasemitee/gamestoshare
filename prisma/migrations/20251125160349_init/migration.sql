-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('STEAM', 'EPIC', 'GOG', 'XBOX', 'PLAYSTATION', 'NINTENDO');

-- CreateEnum
CREATE TYPE "ListingType" AS ENUM ('LOOKING_FOR', 'OFFERING');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "steamId" TEXT,
    "steamProfileUrl" TEXT,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "platform" "Platform" NOT NULL DEFAULT 'STEAM',
    "steamProfileUrl" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "games" (
    "id" TEXT NOT NULL,
    "steamAppId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "iconUrl" TEXT,
    "headerImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listing_games" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "type" "ListingType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "listing_games_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_steamId_key" ON "users"("steamId");

-- CreateIndex
CREATE INDEX "listings_location_idx" ON "listings"("location");

-- CreateIndex
CREATE INDEX "listings_platform_idx" ON "listings"("platform");

-- CreateIndex
CREATE INDEX "listings_isActive_idx" ON "listings"("isActive");

-- CreateIndex
CREATE INDEX "listings_createdAt_idx" ON "listings"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "games_steamAppId_key" ON "games"("steamAppId");

-- CreateIndex
CREATE INDEX "games_name_idx" ON "games"("name");

-- CreateIndex
CREATE UNIQUE INDEX "games_steamAppId_platform_key" ON "games"("steamAppId", "platform");

-- CreateIndex
CREATE UNIQUE INDEX "listing_games_listingId_gameId_type_key" ON "listing_games"("listingId", "gameId", "type");

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listing_games" ADD CONSTRAINT "listing_games_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listing_games" ADD CONSTRAINT "listing_games_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;
