'use client';

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
import { useTemplateActions } from '@/hooks/use-template-actions';
import { Loader2 } from 'lucide-react';

export function DeleteTemplateDialog({ isOpen, template, onClose, onSuccess }) {
  // Use the template actions hook with custom configuration
  const { isDeleting, handleDelete } = useTemplateActions({
    template,
    onSuccessDelete: onSuccess, // Pass the success callback
    deleteAction: async (templateId) => {
      // We're using the default deleteTemplate function from the hook
      // but wrapping it to handle the dialog closing
      const result = await import('@/lib/actions/template-actions').then(
        (mod) => mod.deleteTemplate(templateId)
      );
      if (!result.error) {
        onClose();
      }
      return result;
    },
    shouldRefreshAfterDelete: false, // Let the parent component handle updates
  });

  if (!template) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            template &ldquo;{template?.title}&rdquo; and all associated
            responses.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
