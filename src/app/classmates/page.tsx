import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/auth';
import ClassmatesClient from './ClassmatesClient';

const prisma = new PrismaClient();

async function getAllUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      major: true,
      studentId: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return users;
}

export default async function ClassmatesPage() {
  const session = await getSession();
  const users = await getAllUsers();

  return <ClassmatesClient users={users} currentUserId={session?.id} />;
}
