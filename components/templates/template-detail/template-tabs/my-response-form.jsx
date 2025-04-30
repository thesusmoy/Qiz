'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Form } from '@/components/ui/form';
import { FormQuestion } from '@/components/forms/form-question';
import { QUESTION_TYPES } from '@/lib/constants/questions';
import { submitFormResponse } from '@/lib/actions/form-actions';
import { createFormResponseSchema } from '@/lib/utils/validators';
import { Separator } from '@/components/ui/separator';
import { useFormState } from '@/hooks/use-form-state';
import { FormActions } from '@/components/ui/form-buttons';

export function MyResponseForm({ template, response }) {
  const router = useRouter();
  const { toast } = useToast();

  const [isEditMode, setIsEditMode] = useState(!response);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalValues, setOriginalValues] = useState({});
  const validationSchema = createFormResponseSchema(template.questions);

  const form = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: template.questions.reduce((acc, question) => {
      if (response?.answers) {
        const answer = response.answers.find(
          (a) => a.questionId === question.id
        );
        acc[question.id] =
          answer?.value ||
          (question.type === QUESTION_TYPES.CHECKBOX ? 'false' : '');
      } else {
        // No existing response, set default values
        acc[question.id] =
          question.type === QUESTION_TYPES.CHECKBOX ? 'false' : '';
      }
      return acc;
    }, {}),
    mode: 'onSubmit',
  });

  const formValues = form.watch();

  // Using our custom hook for form state management
  const { hasChanges } = useFormState({
    initialValues: originalValues,
    currentValues: formValues,
    options: {
      // For non-edit mode, don't show changes
      compareNormalized: isEditMode,
      // For new responses (no existing response), consider any non-empty value as a change
      deepCompare: !!response,
    },
  });

  useEffect(() => {
    if (response?.answers) {
      const values = template.questions.reduce((acc, question) => {
        const answer = response.answers.find(
          (a) => a.questionId === question.id
        );
        acc[question.id] =
          answer?.value ||
          (question.type === QUESTION_TYPES.CHECKBOX ? 'false' : '');
        return acc;
      }, {});

      // Store normalized original values
      const normalizedValues = Object.entries(values).reduce(
        (acc, [key, value]) => {
          acc[key] = typeof value === 'string' ? value.trim() : value;
          return acc;
        },
        {}
      );

      setOriginalValues(normalizedValues);
    } else {
      const emptyValues = template.questions.reduce((acc, question) => {
        acc[question.id] =
          question.type === QUESTION_TYPES.CHECKBOX ? 'false' : '';
        return acc;
      }, {});

      setOriginalValues(emptyValues);
    }
  }, [response, template.questions, isEditMode]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const result = await submitFormResponse(template.id, formData);

      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
        return;
      }

      toast({
        title: 'Success',
        description: result.success,
      });

      setIsEditMode(false);
      router.refresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update form',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine if inputs should be disabled
  const areInputsDisabled = !isEditMode || isSubmitting;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">
            {response ? 'Your Response' : 'Fill Out Form'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {!response
              ? 'Please answer all required questions below'
              : isEditMode
                ? "You're currently editing your response"
                : 'View your submitted answers'}
          </p>
        </div>
        {response && !isEditMode && (
          <Button onClick={() => setIsEditMode(true)}>Update Response</Button>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {template.questions.map((question, index) => (
            <div key={question.id} className="space-y-6">
              {index > 0 && <Separator className="my-6" />}
              <FormQuestion
                question={question}
                control={form.control}
                disabled={areInputsDisabled}
              />
            </div>
          ))}

          {isEditMode && (
            <>
              <Separator className="my-6" />

              <FormActions
                onCancel={() => setIsEditMode(false)}
                isSubmitting={isSubmitting}
                isDisabled={isSubmitting}
                hasChanges={hasChanges}
                showCancel={!!response}
                submitText={response ? 'Save Changes' : 'Submit'}
                noChangesText="No Changes"
              />
            </>
          )}
        </form>
      </Form>
    </div>
  );
}
