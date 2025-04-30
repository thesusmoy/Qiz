
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { UserProfilePage } from '@/components/profile/user-profile-page';

export const metadata = {
  title: 'My Profile',
  description: 'View and manage your profile information',
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    return redirect('/auth/signin');
  }

  return <UserProfilePage user={session.user} />;
}
