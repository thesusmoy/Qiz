'use client';

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormState } from '@/hooks/use-form-state';
import { TemplateSchema } from '@/lib/utils/validators';
import { useSubmitTemplate } from '@/hooks/use-submit-template';

export function useTemplateForm(options = {}) {
  const {
    template = null,
    successMessage = template
      ? 'Template updated successfully'
      : 'Template created successfully',
    redirectPath = '/templates',
    shouldNavigateBack = false,
    shouldRefreshPage = template ? true : false,
    isEdit = !!template,
  } = options;

  const [isUploading, setIsUploading] = useState(false);
  const [questions, setQuestions] = useState(template?.questions || []);

  const originalFormValues = useMemo(() => {
    if (!template) {
      return {
        title: '',
        description: '',
        topic: '',
        tags: '',
        isPublic: true,
        allowedUsers: '',
        image: '',
      };
    }

    return {
      title: template.title,
      description: template.description || '',
      topic: template.topic,
      tags: template.tags?.join(',') || '',
      isPublic: template.isPublic,
      allowedUsers: template.allowedUsers
        ? template.allowedUsers.map((u) => u.email).join(',')
        : '',
      image: template.image || '',
    };
  }, [template]);

  const form = useForm({
    resolver: zodResolver(TemplateSchema),
    defaultValues: originalFormValues,
    mode: 'onChange',
  });

  const formValues = form.watch();

  const originalQuestions = useMemo(
    () => JSON.stringify(template?.questions || []),
    [template?.questions]
  );

  const normalizedOriginalQuestions = useMemo(() => {
    if (!originalQuestions) return [];

    return JSON.parse(originalQuestions).map((q) => ({
      ...q,
      text: q.text?.trim() || '',
      description: q.description?.trim() || '',
    }));
  }, [originalQuestions]);

  const normalizedCurrentQuestions = useMemo(() => {
    return questions.map((q) => ({
      ...q,
      text: q.text?.trim() || '',
      description: q.description?.trim() || '',
    }));
  }, [questions]);

  const { hasChanges: formHasChanges } = useFormState({
    initialValues: originalFormValues,
    currentValues: formValues,
  });

  const { hasChanges: questionsHaveChanges } = useFormState({
    initialValues: normalizedOriginalQuestions,
    currentValues: normalizedCurrentQuestions,
  });

  const hasChanges = !isEdit || formHasChanges || questionsHaveChanges;

  const { isSubmitting, submitTemplate } = useSubmitTemplate({
    isEdit,
    templateId: template?.id,
    successMessage,
    redirectPath,
    shouldNavigateBack,
    shouldRefreshPage,
  });

  const isDisabled = isSubmitting || isUploading;

  const handleSubmit = async () => {
    const formData = form.getValues();
    return await submitTemplate(formData, questions);
  };

  return {
    form,
    questions,
    setQuestions,
    isSubmitting,
    isUploading,
    setIsUploading,
    isDisabled,
    hasChanges,
    handleSubmit,
    isEdit,
  };
}
