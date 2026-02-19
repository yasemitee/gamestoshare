import { NextRequest, NextResponse } from 'next/server';

// Cleanup route disabled — listings no longer expire after 30 days.
export async function POST(request: NextRequest) {
  return NextResponse.json({
    message: 'Cleanup disabled — listings no longer expire.',
    deactivated: 0,
  });
}
