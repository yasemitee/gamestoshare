import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, steamId, steamProfileUrl, location } = body;

    if (!username || !location) {
      return NextResponse.json(
        { error: 'Username and location are required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        username,
        steamId,
        steamProfileUrl,
        location,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Username or Steam ID already exists' },
        { status: 409 }
      );
    }
    
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}