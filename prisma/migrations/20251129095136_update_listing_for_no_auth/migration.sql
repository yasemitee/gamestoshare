/*
  Warnings:

  - You are about to drop the column `userId` on the `listings` table. All the data in the column will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[steamId]` on the table `listings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expiresAt` to the `listings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `steamId` to the `listings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "listings" DROP CONSTRAINT "listings_userId_fkey";

-- AlterTable
ALTER TABLE "listings" DROP COLUMN "userId",
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "showSteamId" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "steamId" TEXT NOT NULL;

-- DropTable
DROP TABLE "users";

-- CreateIndex
CREATE UNIQUE INDEX "listings_steamId_key" ON "listings"("steamId");

-- CreateIndex
CREATE INDEX "listings_steamId_idx" ON "listings"("steamId");

-- CreateIndex
CREATE INDEX "listings_expiresAt_idx" ON "listings"("expiresAt");
