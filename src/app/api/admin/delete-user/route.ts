import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // First delete all posts by this user
    await prisma.post.deleteMany({
      where: {
        authorId: parseInt(userId)
      }
    });

    // Then delete the user
    const deletedUser = await prisma.user.delete({
      where: {
        id: parseInt(userId)
      }
    });

    return NextResponse.json({ 
      message: 'User and their posts deleted successfully',
      user: deletedUser
    }, { status: 200 });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
