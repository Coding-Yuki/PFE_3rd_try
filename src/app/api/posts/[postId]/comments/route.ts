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

    const { postId, content } = await request.json();

    if (!postId || !content) {
      return NextResponse.json({ error: 'Post ID and content are required' }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        userId: session.id,
        postId: parseInt(postId),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            major: true,
          },
        },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Comment creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest, context: { params: Promise<{ postId: string }> }) {
  try {
    // Await params if Next.js 15 requires it, otherwise just use context.params
    const params = await context.params; 
    const rawPostId = params.postId;
    
    // Schema shows Post.id is Int, so use parseInt
    const queryId = parseInt(rawPostId, 10);

    console.log("=== DEBUG API ===");
    console.log("Raw Post ID:", rawPostId);
    console.log("Query ID Type:", typeof queryId);
    console.log("Query ID Value:", queryId);

    const comments = await prisma.comment.findMany({
      where: { postId: queryId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'asc' }
    });

    console.log("Comments found:", comments.length);
    console.log("Comments data:", comments);
    return NextResponse.json(comments);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json([]);
  }
}
