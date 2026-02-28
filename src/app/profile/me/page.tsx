import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

export default async function ProfileMePage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/register');
  }
  
  redirect(`/profile/${session.id}`);
}
