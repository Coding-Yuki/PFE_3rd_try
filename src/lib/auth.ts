import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export interface User {
  id: number;
  name: string;
  email: string;
  studentId: string;
  major: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: Date;
}

export async function getSession(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session')?.value;

  if (!sessionId) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(sessionId) },
      select: {
        id: true,
        name: true,
        email: true,
        studentId: true,
        major: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    return user;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

export async function createSession(userId: number): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('session', userId.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function removeSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}
