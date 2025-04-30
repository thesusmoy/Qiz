'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Users, FileText, ClipboardList } from 'lucide-react';

const adminNavItems = [
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Templates',
    href: '/admin/templates',
    icon: FileText,
  },
  {
    title: 'Responses',
    href: '/admin/responses',
    icon: ClipboardList,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-muted p-6 border-r">
      <nav className="space-y-2">
        {adminNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent',
              pathname === item.href && 'bg-accent'
            )}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
