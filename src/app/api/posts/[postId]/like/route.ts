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

    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const postIdNum = parseInt(postId);
    const userId = session.id;

    // Check if like already exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId: postIdNum,
        },
      },
    });

    let liked: boolean;
    let count: number;

    if (existingLike) {
      // Unlike post
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId: postIdNum,
          },
        },
      });
      liked = false;
    } else {
      // Like post
      await prisma.like.create({
        data: {
          userId,
          postId: postIdNum,
        },
      });
      liked = true;
    }

    // Get updated like count
    const likeCount = await prisma.like.count({
      where: {
        postId: postIdNum,
      },
    });

    return NextResponse.json({ liked, count: likeCount });
  } catch (error) {
    console.error('Like toggle error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
