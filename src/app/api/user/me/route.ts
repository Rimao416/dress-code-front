export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get session
    const session = await getSession();
    
    // Check if user is authenticated
    if (!session.isAuthenticated || !session.userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Find user by ID
    const user = await prisma.user.findUnique({
      where: {
        id: String(session.userId), // Convert string to number for Prisma
      },
     select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        client: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
            dateOfBirth: true,
            gender: true,
          },
        },
      },
    });
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
