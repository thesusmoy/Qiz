// hooks/use-template-actions.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { deleteTemplate } from '@/lib/actions/template-actions';

/**
 * Custom hook for managing template actions like delete, copy link, etc.
 * @param {Object} options - Configuration options
 * @param {Object} options.template - The template object to perform actions on
 * @param {Function} options.onSuccessDelete - Callback to run after successful deletion
 * @param {boolean} options.shouldNavigateAfterDelete - Whether to navigate after deletion
 * @param {string} options.navigatePath - Path to navigate to after deletion
 * @param {boolean} options.shouldRefreshAfterDelete - Whether to refresh the page after deletion
 * @returns {Object} Action handlers and state
 */
export function useTemplateActions(options = {}) {
  const {
    template,
    onSuccessDelete,
    shouldNavigateAfterDelete = false,
    navigatePath = '/templates',
    shouldRefreshAfterDelete = true,
    deleteAction = deleteTemplate, // Can be admin's deleteTemplate or regular
  } = options;

  const router = useRouter();
  const { toast } = useToast();

  // Deletion state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Copy link state
  const [copied, setCopied] = useState(false);

  /**
   * Handles template deletion
   * @returns {Promise<boolean>} Success status
   */
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

      // Handle post-deletion actions
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

  /**
   * Copies the template link to clipboard
   * @param {string} tabParam - Optional tab parameter for the copied URL
   * @returns {Promise<boolean>} Success status
   */
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

  /**
   * Navigates to edit template page
   */
  const navigateToEdit = () => {
    if (!template?.id) return;
    router.push(`/templates/${template.id}/edit`);
  };

  /**
   * Navigates to view template responses
   */
  const navigateToResponses = () => {
    if (!template?.id) return;
    router.push(`/templates/${template.id}?tab=results`);
  };

  /**
   * Navigates to fill form/update response
   */
  const navigateToForm = () => {
    if (!template?.id) return;
    router.push(`/templates/${template.id}?tab=myResponse`);
  };

  /**
   * Navigates to preview template
   */
  const navigateToPreview = () => {
    if (!template?.id) return;
    router.push(`/templates/${template.id}`);
  };

  return {
    // State
    showDeleteDialog,
    setShowDeleteDialog,
    isDeleting,
    copied,

    // Actions
    handleDelete,
    copyLink,
    navigateToEdit,
    navigateToResponses,
    navigateToForm,
    navigateToPreview,

    // Helper method for dialog
    openDeleteDialog: () => setShowDeleteDialog(true),
    closeDeleteDialog: () => setShowDeleteDialog(false),
  };
}
