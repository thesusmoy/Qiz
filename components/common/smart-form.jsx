'use client';

import { useEffect } from 'react';
import { Form } from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { FormActions } from '@/components/ui/form-buttons';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

/**
 * SmartForm - A reusable form component with standardized layout and actions
 *
 * @param {Object} props
 * @param {Object} props.form - The react-hook-form instance
 * @param {Function} props.onSubmit - Form submission handler
 * @param {Function} props.onCancel - Optional cancel handler
 * @param {ReactNode} props.children - Form content/fields
 * @param {boolean} props.isSubmitting - Loading state for the form
 * @param {boolean} props.hasChanges - Whether the form has unsaved changes
 * @param {boolean} props.isDisabled - Whether the form inputs should be disabled
 * @param {boolean} props.withCard - Whether to wrap the form in a Card component
 * @param {string} props.submitText - Text for the submit button
 * @param {string} props.submittingText - Text while submitting
 * @param {string} props.noChangesText - Text when no changes detected
 * @param {string} props.className - Additional classes for the form
 * @param {string} props.cardClassName - Additional classes for the card
 * @param {boolean} props.showActionButtons - Whether to show action buttons
 */
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
  submitButtonClassName = 'min-w-[120px]', // Add submit button class
  submitButtonVariant = 'default', // Add variant prop
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
