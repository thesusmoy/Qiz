'use client';

import { useEffect, useState } from 'react';
import { getUserResponses, deleteResponse } from '@/lib/actions/form-actions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  Eye,
  Edit,
  Trash2,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export function UserResponsesTable() {
  const [responses, setResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [responseToDelete, setResponseToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sorting, setSorting] = useState({
    column: 'createdAt',
    direction: 'desc',
  });

  useEffect(() => {
    async function loadResponses() {
      try {
        const result = await getUserResponses();
        if (result.data) {
          setResponses(result.data);
        } else if (result.error) {
          toast({
            title: 'Error',
            description: result.error,
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error loading responses:', error);
        toast({
          title: 'Error',
          description: 'Failed to load responses',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadResponses();
  }, [toast]);

  async function handleDelete() {
    if (!responseToDelete) return;

    setIsDeleting(true);
    try {
      const result = await deleteResponse(responseToDelete.id);

      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      } else {
        // Remove the deleted response from the state
        setResponses(responses.filter((r) => r.id !== responseToDelete.id));

        toast({
          title: 'Success',
          description: 'Response deleted successfully',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete response',
      });
    } finally {
      setIsDeleting(false);
      setResponseToDelete(null);
    }
  }

  // Handle sorting
  const handleSort = (column) => {
    setSorting((prev) => ({
      column,
      direction:
        prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Sort responses
  const sortedResponses = [...responses].sort((a, b) => {
    const { column, direction } = sorting;

    // Special handling for template title
    if (column === 'title') {
      const titleA = a.template?.title || '';
      const titleB = b.template?.title || '';
      return direction === 'asc'
        ? titleA.localeCompare(titleB)
        : titleB.localeCompare(titleA);
    }

    // For dates
    if (column === 'createdAt' || column === 'updatedAt') {
      const dateA = new Date(a[column]);
      const dateB = new Date(b[column]);
      return direction === 'asc' ? dateA - dateB : dateB - dateA;
    }

    return 0;
  });

  // Helper for sort indicator
  const getSortIcon = (column) => {
    if (sorting.column !== column)
      return <ArrowUpDown className="h-4 w-4 ml-1" />;
    return sorting.direction === 'asc' ? (
      <ChevronUp className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1" />
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Responses</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Skeleton className="h-4 w-[150px]" />
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <Skeleton className="h-4 w-[120px]" />
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <Skeleton className="h-4 w-[120px]" />
                  </TableHead>
                  <TableHead className="text-right">
                    <Skeleton className="h-4 w-[80px] ml-auto" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3, 4, 5].map((index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-5 w-[180px]" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-5 w-[100px]" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-5 w-[100px]" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : responses.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            You haven&apos;t submitted any responses yet
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center">
                      Form
                      {getSortIcon('title')}
                    </div>
                  </TableHead>
                  <TableHead
                    className="hidden md:table-cell cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center">
                      Submitted
                      {getSortIcon('createdAt')}
                    </div>
                  </TableHead>
                  <TableHead
                    className="hidden md:table-cell cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('updatedAt')}
                  >
                    <div className="flex items-center">
                      Last Updated
                      {getSortIcon('updatedAt')}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedResponses.map((response) => (
                  <TableRow key={response.id}>
                    <TableCell className="font-medium">
                      {response.template?.title || 'Unknown Template'}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(response.createdAt)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(response.updatedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link
                            href={`/templates/${response.templateId}/responses/${response.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link
                            href={`/templates/${response.templateId}?tab=myResponse`}
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setResponseToDelete(response)}
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
      {/* Delete confirmation dialog */}
      <AlertDialog
        open={!!responseToDelete}
        onOpenChange={(open) => !open && setResponseToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              response to &ldquo;
              {responseToDelete?.template?.title || 'this form'}&rdquo;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
