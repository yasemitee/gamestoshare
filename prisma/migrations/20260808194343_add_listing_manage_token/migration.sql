-- CreateTable
CREATE TABLE "listing_manage_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "steamId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "listing_manage_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "listing_manage_tokens_token_key" ON "listing_manage_tokens"("token");

-- CreateIndex
CREATE INDEX "listing_manage_tokens_steamId_idx" ON "listing_manage_tokens"("steamId");

-- CreateIndex
CREATE INDEX "listing_manage_tokens_expiresAt_idx" ON "listing_manage_tokens"("expiresAt");
