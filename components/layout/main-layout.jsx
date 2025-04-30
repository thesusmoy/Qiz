'use client';

import { MainNav } from '@/components/shared/main-nav';

export function MainLayout({ user, children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav user={user} />
      <main className="flex-1 container mx-auto py-6 px-4">{children}</main>
    </div>
  );
}
