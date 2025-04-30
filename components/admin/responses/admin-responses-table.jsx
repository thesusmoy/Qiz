'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
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
import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { deleteResponse } from '@/lib/actions/admin-actions';

export function AdminResponsesTable({ initialResponses }) {
  const router = useRouter();
  const { toast } = useToast();
  const [responses, setResponses] = useState(initialResponses);
  const [responseToDelete, setResponseToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!responseToDelete) return;

    setIsLoading(true);
    try {
      const result = await deleteResponse(responseToDelete.id);

      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
        return;
      }

      setResponses(responses.filter((r) => r.id !== responseToDelete.id));
      toast({
        title: 'Success',
        description: 'Response deleted successfully',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete response',
      });
    } finally {
      setIsLoading(false);
      setResponseToDelete(null);
    }
  };

  if (responses.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-muted-foreground">No responses found</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Template</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {responses.map((response) => (
              <TableRow key={response.id}>
                <TableCell>{response.template.title}</TableCell>
                <TableCell>{response.user.name}</TableCell>
                <TableCell>{formatDate(response.createdAt)}</TableCell>
                <TableCell>{formatDate(response.updatedAt)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          // Navigate to overview tab
                          router.push(
                            `/templates/${response.templateId}?tab=overview`
                          )
                        }
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Template
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          // Navigate to myResponse tab
                          router.push(
                            `/templates/${response.templateId}?tab=myResponse&responseId=${response.id}`
                          )
                        }
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Response
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setResponseToDelete(response)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={!!responseToDelete}
        onOpenChange={() => setResponseToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              response and its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
