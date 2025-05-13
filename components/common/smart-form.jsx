'use client';

import { useEffect } from 'react';
import { Form } from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { FormActions } from '@/components/ui/form-buttons';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export function SmartForm({
  form,
  onSubmit,
  onCancel,
  children,
  isSubmitting = false,
  hasChanges = true,
  isDisabled = false,
  withCard = true,
  submitText = 'Save',
  submittingText = 'Saving...',
  noChangesText = 'No Changes',
  className,
  cardClassName,
  showActionButtons = true,
  showCancelButton = true,
  submitIcon,
  submitButtonClassName = 'min-w-[120px]',
  submitButtonVariant = 'default',
  actionButtonsClassName,
  ...props
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    form.handleSubmit(onSubmit)(e);
  };

  const formContent = (
    <>
      {children}

      {showActionButtons && (
        <>
          {children && <Separator className="my-6" />}
          <FormActions
            onCancel={showCancelButton ? onCancel : undefined}
            isSubmitting={isSubmitting}
            isDisabled={isDisabled}
            hasChanges={hasChanges}
            submitText={submitText}
            submittingText={submittingText}
            noChangesText={noChangesText}
            submitIcon={submitIcon}
            submitButtonClassName={submitButtonClassName}
            submitButtonVariant={submitButtonVariant}
            className={actionButtonsClassName}
          />
        </>
      )}
    </>
  );

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className={cn('space-y-6', className)}
        {...props}
      >
        {withCard ? (
          <Card className={cn('p-6', cardClassName)}>{formContent}</Card>
        ) : (
          formContent
        )}
      </form>
    </Form>
  );
}
