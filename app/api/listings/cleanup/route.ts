import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/db';

// Cleanup route disabled — listings no longer expire after 30 days.
export async function POST(request: NextRequest) {
  const now = new Date();
  await prisma.listingManageToken.deleteMany({
    where: { expiresAt: { lt: now } },
  });
  await prisma.listingManageChallenge.deleteMany({
    where: { expiresAt: { lt: now } },
  });

  return NextResponse.json({
    message: 'Cleanup disabled — listings no longer expire.',
    deactivated: 0,
  });
}
