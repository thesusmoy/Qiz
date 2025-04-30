'use client';

import { useState } from 'react';
import { format } from 'date-fns';
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
import { MoreHorizontal, Eye, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
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
import { deleteResponse } from '@/lib/actions/form-actions';

export function ResponsesList({ templateId, initialResponses, questions }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState(initialResponses);
  const [responseToDelete, setResponseToDelete] = useState(null);

  const getAnswerValue = (response, questionId) => {
    const answer = response.answers.find((a) => a.questionId === questionId);
    return answer?.value || '-';
  };

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
        description: result.success,
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

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Respondent</TableHead>
              {questions.map((question) => (
                <TableHead key={question.id}>{question.text}</TableHead>
              ))}
              <TableHead>Submitted</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {responses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={questions.length + 3}
                  className="text-center text-muted-foreground h-24"
                >
                  No responses yet
                </TableCell>
              </TableRow>
            ) : (
              responses.map((response) => (
                <TableRow key={response.id}>
                  <TableCell className="font-medium">
                    {response.user.name}
                    <div className="text-sm text-muted-foreground">
                      {response.user.email}
                    </div>
                  </TableCell>
                  {questions.map((question) => (
                    <TableCell key={question.id}>
                      {getAnswerValue(response, question.id)}
                    </TableCell>
                  ))}
                  <TableCell>
                    {format(new Date(response.createdAt), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isLoading}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/templates/${templateId}/responses/${response.id}`
                            )
                          }
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            setResponseToDelete(response);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Response
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <AlertDialog
        open={!!responseToDelete}
        onOpenChange={() => setResponseToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              response.
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
