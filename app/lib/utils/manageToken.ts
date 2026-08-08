import crypto from 'crypto';
import { prisma } from '@/lib/db/db';

export const MANAGE_TOKEN_TTL_DAYS = 30;

export async function createManageToken(
  steamId: string
): Promise<{ token: string; expiresAt: Date }> {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + MANAGE_TOKEN_TTL_DAYS);

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
