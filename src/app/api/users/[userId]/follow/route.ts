import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  context: { params: { userId: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Await params for Next.js 15
    const params = await context.params;
    const rawTargetUserId = params.userId;
    
    // Schema shows User.id is Int, so parse it
    const followingId = parseInt(rawTargetUserId, 10);
    const followerId = session.id;

    if (isNaN(followingId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    if (followerId === followingId) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 });
    }

    console.log("=== FOLLOW API DEBUG ===");
    console.log("Follower ID:", followerId);
    console.log("Target User ID:", followingId);

    // Check if already following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    let following: boolean;

    if (existingFollow) {
      // Unfollow
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId,
            followingId,
          },
        },
      });
      following = false;
      console.log("Unfollowed successfully");
    } else {
      // Follow
      await prisma.follow.create({
        data: {
          followerId,
          followingId,
        },
      });
      following = true;
      console.log("Followed successfully");
    }

    return NextResponse.json({ following });
  } catch (error) {
    console.error('Follow toggle error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
