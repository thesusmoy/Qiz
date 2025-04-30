'use client';

import { Badge } from '@/components/ui/badge';
import { UserTableActions } from './user-table-actions';
import { formatDate } from '@/lib/utils';

export const usersTableColumns = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => (
      <Badge variant={row?.role === 'ADMIN' ? 'default' : 'secondary'}>
        {row?.role}
      </Badge>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Joined',
    cell: ({ row }) => formatDate(row?.createdAt),
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row?.isActive ? 'success' : 'destructive'}>
        {row?.isActive ? 'Active' : 'Blocked'}
      </Badge>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => <UserTableActions user={row} />,
  },
];
