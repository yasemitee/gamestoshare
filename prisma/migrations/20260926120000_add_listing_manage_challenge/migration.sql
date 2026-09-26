-- CreateTable
CREATE TABLE "listing_manage_challenges" (
    "id" TEXT NOT NULL,
    "steamId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "listing_manage_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "listing_manage_challenges_steamId_idx" ON "listing_manage_challenges"("steamId");

-- CreateIndex
CREATE INDEX "listing_manage_challenges_expiresAt_idx" ON "listing_manage_challenges"("expiresAt");
