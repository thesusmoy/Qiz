'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useQuestionValidation } from '@/hooks/use-question-validation';
import { createTemplate, updateTemplate } from '@/lib/actions/template-actions';

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

  const prepareTemplateData = useCallback(
    (formData, questions) => {
      const fd = new FormData();

      if (isEdit && templateId) {
        fd.append('id', templateId);
      }

      Object.entries(formData).forEach(([key, value]) => {
        fd.append(key, value !== undefined ? value : '');
      });

      fd.append('questions', JSON.stringify(questions));

      return fd;
    },
    [isEdit, templateId]
  );

  const submitTemplate = useCallback(
    async (formData, questions) => {
      if (!validateQuestions(questions)) {
        return false;
      }

      try {
        setIsSubmitting(true);

        onSubmitStart?.();

        const fd = prepareTemplateData(formData, questions);

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

        toast({
          title: 'Success',
          description: successMessage,
        });

        onSubmitSuccess?.(result.data);

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
