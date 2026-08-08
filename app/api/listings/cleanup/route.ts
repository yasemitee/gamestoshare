import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/db';

// Cleanup route disabled — listings no longer expire after 30 days.
export async function POST(request: NextRequest) {
  await prisma.listingManageToken.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });

  return NextResponse.json({
    message: 'Cleanup disabled — listings no longer expire.',
    deactivated: 0,
  });
}
