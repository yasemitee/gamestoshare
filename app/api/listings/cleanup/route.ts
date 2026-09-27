import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/db';

// Deletes expired manage tokens and one-time bio codes. Listings themselves
// no longer expire. Runs daily via the cron in vercel.json (Vercel crons
// send GET). When CRON_SECRET is set, Vercel sends it as a bearer token and
// other callers are refused.
async function cleanup(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const [tokens, challenges] = await Promise.all([
    prisma.listingManageToken.deleteMany({
      where: { expiresAt: { lt: now } },
    }),
    prisma.listingManageChallenge.deleteMany({
      where: { expiresAt: { lt: now } },
    }),
  ]);

  return NextResponse.json({
    deletedTokens: tokens.count,
    deletedChallenges: challenges.count,
  });
}

export const GET = cleanup;
export const POST = cleanup;
