// hooks/use-form-submission.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

/**
 * Custom hook for handling form submissions with loading states, toast notifications,
 * and routing.
 * @param {Object} options - Configuration options
 * @param {string} options.successMessage - Message to show on success
 * @param {string} options.redirectPath - Where to redirect on success
 * @param {boolean} options.shouldRefreshPage - Whether to refresh the page after submission
 * @param {boolean} options.shouldNavigateBack - Whether to navigate back after submission
 * @returns {Object} Form submission helpers and state
 */
export function useFormSubmission(options = {}) {
  const {
    successMessage = 'Operation completed successfully',
    redirectPath,
    shouldRefreshPage = false,
    shouldNavigateBack = false,
  } = options;

  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle form submission with standardized error handling and success flow
   * @param {Function} submitFn - Async function that performs the actual submission
   * @param {any} data - Data to pass to the submit function
   * @param {Object} options - Additional options for this specific submission
   * @returns {Promise<boolean>} Whether the submission was successful
   */
  const handleSubmit = async (submitFn, data, options = {}) => {
    const {
      onSuccess,
      customSuccessMessage,
      customErrorMessage = 'Something went wrong',
      customRedirect,
    } = options;

    setIsSubmitting(true);

    try {
      const result = await submitFn(data);

      // Handle error response
      if (result?.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
        setIsSubmitting(false);
        return false;
      }

      // Success case
      toast({
        title: 'Success',
        description: customSuccessMessage || successMessage,
      });

      // Optional callback
      if (onSuccess) {
        await onSuccess(result);
      }

      // Navigation logic
      if (shouldRefreshPage) {
        router.refresh();
      }

      if (customRedirect) {
        router.push(customRedirect);
      } else if (redirectPath) {
        router.push(redirectPath);
      } else if (shouldNavigateBack) {
        router.back();
      }

      return true;
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: customErrorMessage,
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit,
  };
}
