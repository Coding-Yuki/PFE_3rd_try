import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getSession();
    
    // Fetch users, excluding current user if logged in
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        major: true,
        studentId: true,
        avatarUrl: true,
      },
      where: session ? {
        id: {
          not: session.id,
        },
      } : undefined,
      take: 5, // Limit to 5 users
      orderBy: {
        createdAt: 'desc', // Show newest users first
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
