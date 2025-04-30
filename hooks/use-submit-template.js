// hooks/use-submit-template.js
'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useQuestionValidation } from '@/hooks/use-question-validation';
import { createTemplate, updateTemplate } from '@/lib/actions/template-actions';

/**
 * Hook for handling template form submission
 * @param {Object} options - Configuration options
 * @returns {Object} Submission utilities and state
 */
export function useSubmitTemplate(options = {}) {
  const {
    isEdit = false,
    templateId = null,
    successMessage = isEdit
      ? 'Template updated successfully'
      : 'Template created successfully',
    redirectPath = '/templates',
    shouldNavigateBack = false,
    shouldRefreshPage = isEdit,
    onSubmitStart,
    onSubmitSuccess,
    onSubmitError,
  } = options;

  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { validateQuestions } = useQuestionValidation();

  /**
   * Prepares template data for submission
   * @param {Object} formData - Form field values
   * @param {Array} questions - Template questions
   * @returns {FormData} Prepared form data
   */
  const prepareTemplateData = useCallback(
    (formData, questions) => {
      const fd = new FormData();

      // Add template ID for edit operations
      if (isEdit && templateId) {
        fd.append('id', templateId);
      }

      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        fd.append(key, value !== undefined ? value : '');
      });

      // Add questions
      fd.append('questions', JSON.stringify(questions));

      return fd;
    },
    [isEdit, templateId]
  );

  /**
   * Submits the template form
   * @param {Object} formData - Form field values
   * @param {Array} questions - Template questions
   * @returns {Promise<Object>} Submission result
   */
  const submitTemplate = useCallback(
    async (formData, questions) => {
      // Validate questions first
      if (!validateQuestions(questions)) {
        return false;
      }

      try {
        setIsSubmitting(true);

        // Call any pre-submission callback
        onSubmitStart?.();

        // Prepare form data
        const fd = prepareTemplateData(formData, questions);

        // Submit to appropriate endpoint based on mode
        const result = await (isEdit ? updateTemplate(fd) : createTemplate(fd));

        if (result.error) {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: result.error,
          });
          onSubmitError?.(result.error);
          return false;
        }

        // Success case
        toast({
          title: 'Success',
          description: successMessage,
        });

        onSubmitSuccess?.(result.data);

        // Handle navigation
        if (shouldRefreshPage) {
          router.refresh();
        }

        if (shouldNavigateBack) {
          router.back();
        } else if (redirectPath) {
          router.push(redirectPath);
        }

        return true;
      } catch (error) {
        console.error('Template submission error:', error);

        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Something went wrong. Please try again.',
        });

        onSubmitError?.(error);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      validateQuestions,
      prepareTemplateData,
      isEdit,
      toast,
      successMessage,
      shouldRefreshPage,
      shouldNavigateBack,
      redirectPath,
      router,
      onSubmitStart,
      onSubmitSuccess,
      onSubmitError,
    ]
  );

  return {
    isSubmitting,
    submitTemplate,
    prepareTemplateData,
  };
}
