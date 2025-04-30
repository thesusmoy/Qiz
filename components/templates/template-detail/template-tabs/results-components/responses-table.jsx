'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  RotateCw,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Eye,
  Trash2,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export function ResponsesTable({
  responses,
  isLoading,
  error,
  onRefresh,
  onViewResponse,
  onDeleteResponse,
}) {
  const [sorting, setSorting] = useState({
    column: 'createdAt',
    direction: 'desc',
  });

  const handleSort = (column) => {
    setSorting((prev) => ({
      column,
      direction:
        prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const getSortIcon = (column) => {
    if (sorting.column !== column)
      return <ArrowUpDown className="h-4 w-4 ml-1" />;
    return sorting.direction === 'asc' ? (
      <ChevronUp className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1" />
    );
  };

  // Sort responses
  const sortedResponses = [...responses].sort((a, b) => {
    const { column, direction } = sorting;

    // For user name sorting
    if (column === 'user') {
      const nameA = a.user?.name || '';
      const nameB = b.user?.name || '';
      return direction === 'asc'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    }

    // For dates
    if (column === 'createdAt' || column === 'updatedAt') {
      const dateA = new Date(a[column]);
      const dateB = new Date(b[column]);
      return direction === 'asc' ? dateA - dateB : dateB - dateA;
    }

    // For status
    if (column === 'status') {
      const statusA = a.updatedAt !== a.createdAt ? 'Updated' : 'Submitted';
      const statusB = b.updatedAt !== b.createdAt ? 'Updated' : 'Submitted';
      return direction === 'asc'
        ? statusA.localeCompare(statusB)
        : statusB.localeCompare(statusA);
    }

    return 0;
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Form Responses</CardTitle>
          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : error ? (
          <div className="text-center text-destructive p-4">{error}</div>
        ) : responses.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>No responses yet</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('user')}
                  >
                    <div className="flex items-center">
                      User
                      {getSortIcon('user')}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center">
                      Submitted Date
                      {getSortIcon('createdAt')}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      Status
                      {getSortIcon('status')}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedResponses.map((response) => (
                  <TableRow key={response.id}>
                    <TableCell className="font-medium">
                      {response.user?.name || 'Unknown User'}
                    </TableCell>
                    <TableCell>{formatDate(response.createdAt)}</TableCell>
                    <TableCell>
                      {response.updatedAt !== response.createdAt ? (
                        <Badge variant="outline">Updated</Badge>
                      ) : (
                        <Badge variant="secondary">Submitted</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onViewResponse(response.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteResponse(response)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
