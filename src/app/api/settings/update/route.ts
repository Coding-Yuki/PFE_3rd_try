import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, major } = await request.json();

    if (!name || !major) {
      return NextResponse.json({ error: 'Name and major are required' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: session.id,
      },
      data: {
        name: name.trim(),
        major: major.trim(),
      },
    });

    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      major: updatedUser.major,
      studentId: updatedUser.studentId,
      avatarUrl: updatedUser.avatarUrl,
    });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
