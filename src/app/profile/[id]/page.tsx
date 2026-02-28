import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/auth';
import ProfileClient from './ProfileClient';

const prisma = new PrismaClient();

async function getUserProfile(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      studentId: true,
      major: true,
      bio: true,
      avatarUrl: true,
      createdAt: true,
      posts: {
        include: {
          likes: {
            select: {
              userId: true,
            },
          },
          comments: {
            select: {
              id: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  return user;
}

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const userId = parseInt(resolvedParams.id);
  
  if (isNaN(userId)) {
    return <div>Invalid User ID</div>;
  }

  const session = await getSession();
  const profile = await getUserProfile(userId);

  if (!profile) {
    notFound();
  }

  const isOwnProfile = session?.id === profile.id;

  return <ProfileClient profile={profile} isOwnProfile={isOwnProfile} />;
}
