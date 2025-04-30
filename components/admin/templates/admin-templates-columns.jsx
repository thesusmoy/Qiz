
'use client';

import { Badge } from '@/components/ui/badge';
import { AdminTemplateActions } from './admin-template-actions';
import { formatDate } from '@/lib/utils';

export const adminTemplatesColumns = [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'author',
    header: 'Author',
    cell: ({ row }) => row?.author?.name || 'Unknown',
  },
  {
    accessorKey: 'topic',
    header: 'Topic',
    cell: ({ row }) => <Badge variant="secondary">{row?.topic}</Badge>,
  },
  {
    accessorKey: 'isPublic',
    header: 'Access',
    cell: ({ row }) => (
      <Badge variant={row?.isPublic ? 'default' : 'outline'}>
        {row?.isPublic ? 'Public' : 'Restricted'}
      </Badge>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => formatDate(row?.createdAt),
  },
  {
    accessorKey: '_count',
    header: 'Responses',
    cell: ({ row }) => row?._count?.responses || 0,
  },
  {
    id: 'actions',
    cell: ({ row }) => <AdminTemplateActions template={row} />,
  },
];
