'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { deleteTemplate } from '@/lib/actions/template-actions';

export function useTemplateActions(options = {}) {
  const {
    template,
    onSuccessDelete,
    shouldNavigateAfterDelete = false,
    navigatePath = '/templates',
    shouldRefreshAfterDelete = true,
    deleteAction = deleteTemplate,
  } = options;

  const router = useRouter();
  const { toast } = useToast();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [copied, setCopied] = useState(false);

  const handleDelete = async () => {
    if (!template?.id) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No template specified for deletion',
      });
      return false;
    }

    setIsDeleting(true);
    try {
      const result = await deleteAction(template.id);

      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
        return false;
      }

      toast({
        title: 'Success',
        description: 'Template deleted successfully',
      });

      if (onSuccessDelete) {
        onSuccessDelete(template.id);
      }

      if (shouldRefreshAfterDelete) {
        router.refresh();
      }

      if (shouldNavigateAfterDelete) {
        router.push(navigatePath);
      }

      return true;
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong while deleting the template',
      });
      return false;
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const copyLink = async (tabParam = 'myResponse') => {
    if (!template?.id) return false;

    const formUrl = `${window.location.origin}/templates/${template.id}${tabParam ? `?tab=${tabParam}` : ''}`;

    try {
      await navigator.clipboard.writeText(formUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      toast({
        title: 'Success',
        description: 'Form link copied to clipboard',
      });
      return true;
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to copy link',
      });
      return false;
    }
  };

  const navigateToEdit = () => {
    if (!template?.id) return;
    router.push(`/templates/${template.id}/edit`);
  };

  const navigateToResponses = () => {
    if (!template?.id) return;
    router.push(`/templates/${template.id}?tab=results`);
  };

  const navigateToForm = () => {
    if (!template?.id) return;
    router.push(`/templates/${template.id}?tab=myResponse`);
  };

  const navigateToPreview = () => {
    if (!template?.id) return;
    router.push(`/templates/${template.id}`);
  };

  return {
    showDeleteDialog,
    setShowDeleteDialog,
    isDeleting,
    copied,
    handleDelete,
    copyLink,
    navigateToEdit,
    navigateToResponses,
    navigateToForm,
    navigateToPreview,

    openDeleteDialog: () => setShowDeleteDialog(true),
    closeDeleteDialog: () => setShowDeleteDialog(false),
  };
}
