
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { MainNav } from '@/components/shared/main-nav';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <div className="flex flex-col min-h-screen">
      <MainNav user={session.user} />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
