// components/ui/form-buttons.jsx
'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

/**
 * Reusable submit button with loading state
 */
export function SubmitButton({
  isSubmitting,
  isDisabled,
  noChangesText = 'No Changes',
  submittingText = 'Submitting...',
  children,
  icon: Icon,
  hasChanges,
  className = '',
  variant = 'default', // Add variant prop with default value
  ...props
}) {
  // Determine the current button state and text to display
  const getButtonContent = () => {
    if (isSubmitting) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {submittingText}
        </>
      );
    }

    if (hasChanges === false) {
      return noChangesText;
    }

    if (Icon) {
      return (
        <>
          <Icon className="mr-2 h-4 w-4" />
          {children}
        </>
      );
    }

    return children;
  };

  return (
    <Button
      type="submit"
      className={className}
      disabled={isDisabled || hasChanges === false}
      variant={variant}
      {...props}
    >
      {getButtonContent()}
    </Button>
  );
}

/**
 * Reusable cancel button for forms
 */
export function CancelButton({
  onClick,
  isDisabled,
  children = 'Cancel',
  className = '',
  ...props
}) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      disabled={isDisabled}
      className={className}
      {...props}
    >
      {children}
    </Button>
  );
}

/**
 * Reusable form action buttons container with common layout
 */
export function FormActions({
  onCancel,
  isSubmitting,
  isDisabled,
  showCancel = true,
  submitText = 'Submit',
  cancelText = 'Cancel',
  submitIcon,
  hasChanges,
  noChangesText,
  submittingText,
  className = 'flex justify-end gap-4',
  submitButtonClassName = 'min-w-[120px]', // Extract submit button class
  submitButtonVariant = 'default', // Add variant prop with default value
  ...props
}) {
  return (
    <div className={className} {...props}>
      {showCancel && onCancel && (
        <CancelButton onClick={onCancel} isDisabled={isDisabled}>
          {cancelText}
        </CancelButton>
      )}
      <SubmitButton
        isSubmitting={isSubmitting}
        isDisabled={isDisabled}
        hasChanges={hasChanges}
        noChangesText={noChangesText}
        submittingText={submittingText}
        icon={submitIcon}
        className={submitButtonClassName}
        variant={submitButtonVariant}
      >
        {submitText}
      </SubmitButton>
    </div>
  );
}
