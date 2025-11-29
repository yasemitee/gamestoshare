-- AlterTable
ALTER TABLE "games" ADD COLUMN     "priceInCents" INTEGER,
ADD COLUMN     "releaseYear" INTEGER;

-- CreateIndex
CREATE INDEX "games_releaseYear_idx" ON "games"("releaseYear");
