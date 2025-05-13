import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { UserProfilePage } from '@/components/profile/user-profile-page';
import { PageContainer } from '@/components/layout/page-container';
import prisma from '@/lib/prisma/client';

export const metadata = {
  title: 'Profile',
  description: 'View and manage profile information',
};

export default async function ProfilePage({ searchParams }) {
  const session = await auth();

  if (!session?.user) {
    return redirect('/auth/signin');
  }

  const { userId } = await searchParams;
  let profileUser = session.user;
  let isAdminView = false;

  if (userId && userId !== session.user.id) {
    if (session.user.role !== 'ADMIN') {
      return redirect('/profile');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user) {
      return redirect('/admin/users');
    }

    profileUser = user;
    isAdminView = true;
  }

  const breadcrumbItems = isAdminView
    ? [
        { href: '/', label: 'Home' },
        { href: '/admin', label: 'Admin' },
        { href: '/admin/users', label: 'Users' },
        { label: profileUser.name || 'User Profile', isCurrent: true },
      ]
    : [
        { href: '/', label: 'Home' },
        { label: 'Profile', isCurrent: true },
      ];

  return (
    <PageContainer
      breadcrumbItems={breadcrumbItems}
      title={isAdminView ? `${profileUser.name}'s Profile` : 'My Profile'}
      description={
        isAdminView
          ? `View and manage user profile information`
          : 'View and manage your profile information'
      }
    >
      <UserProfilePage user={profileUser} isAdminView={isAdminView} />
    </PageContainer>
  );
}
