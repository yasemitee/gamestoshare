import crypto from 'crypto';
import { prisma } from '@/lib/db/db';
import { STEAM_VERIFICATION_CODE } from '@/lib/constants';

export const MANAGE_TOKEN_TTL_HOURS = 24;
export const MANAGE_CHALLENGE_TTL_MINUTES = 15;

// No 0/O or 1/I, so the code survives being read off a screen and retyped.
const CHALLENGE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CHALLENGE_LENGTH = 6;

export async function createManageToken(
  steamId: string
): Promise<{ token: string; expiresAt: Date }> {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + MANAGE_TOKEN_TTL_HOURS * 60 * 60 * 1000);

  await prisma.listingManageToken.create({
    data: { token, steamId, expiresAt },
  });

  return { token, expiresAt };
}

export async function validateManageToken(
  token: string | null
): Promise<{ steamId: string } | null> {
  if (!token) return null;

  const record = await prisma.listingManageToken.findUnique({
    where: { token },
  });

  if (!record || record.expiresAt < new Date()) {
    return null;
  }

  return { steamId: record.steamId };
}

export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.slice('Bearer '.length).trim();
  return token || null;
}

function generateChallengeCode(): string {
  let suffix = '';
  for (let i = 0; i < CHALLENGE_LENGTH; i++) {
    suffix += CHALLENGE_ALPHABET[crypto.randomInt(CHALLENGE_ALPHABET.length)];
  }
  return `${STEAM_VERIFICATION_CODE}-${suffix}`;
}

// Issues a fresh one-time code for this Steam account. Any earlier pending
// code for the same account is dropped, so only the latest one can verify.
export async function createManageChallenge(
  steamId: string
): Promise<{ id: string; code: string; expiresAt: Date }> {
  const code = generateChallengeCode();
  const expiresAt = new Date(
    Date.now() + MANAGE_CHALLENGE_TTL_MINUTES * 60 * 1000
  );

  await prisma.listingManageChallenge.deleteMany({ where: { steamId } });
  const challenge = await prisma.listingManageChallenge.create({
    data: { steamId, code, expiresAt },
  });

  return { id: challenge.id, code, expiresAt };
}

export async function findActiveManageChallenge(
  id: string
): Promise<{ id: string; steamId: string; code: string } | null> {
  const challenge = await prisma.listingManageChallenge.findUnique({
    where: { id },
  });

  if (!challenge || challenge.expiresAt < new Date()) {
    return null;
  }

  return challenge;
}

// Deletes the challenge and reports whether this call was the one that
// removed it, so two concurrent verifications can't both mint a token.
export async function consumeManageChallenge(id: string): Promise<boolean> {
  const { count } = await prisma.listingManageChallenge.deleteMany({
    where: { id },
  });
  return count === 1;
}
