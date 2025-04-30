'use client';

import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { QuestionsSection } from '@/components/questions/questions-section';
import { useTemplateForm } from '@/hooks/use-template-form';
import { useFormFields } from '@/hooks/use-form-fields';
import { FormActions } from '@/components/ui/form-buttons';

export function TemplateEditForm({ template }) {
  const router = useRouter();

  // Use our template form hook with edit mode settings
  const {
    form,
    questions,
    setQuestions,
    isDisabled,
    isSubmitting,
    setIsUploading,
    hasChanges,
    handleSubmit,
  } = useTemplateForm({
    template,
    successMessage: 'Template updated successfully',
    shouldNavigateBack: true,
    shouldRefreshPage: true,
    isEdit: true,
  });

  // Use our form fields hook
  const {
    renderTextField,
    renderTopicField,
    renderTagsField,
    renderVisibilityField,
    renderAllowedUsersField,
    renderImageField,
  } = useFormFields();

  // Get the current state of isPublic field
  const isPublic = form.watch('isPublic');

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-6"
      >
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Basic Information</h3>
              <p className="text-sm text-muted-foreground">
                Update the basic details of your template
              </p>
            </div>

            {/* Title field */}
            {renderTextField({
              control: form.control,
              name: 'title',
              label: 'Title',
              description: 'Give your template a clear and descriptive title',
              disabled: isDisabled,
            })}

            {/* Description field */}
            {renderTextField({
              control: form.control,
              name: 'description',
              label: 'Description',
              description: 'Describe what this template is for',
              multiline: true,
              disabled: isDisabled,
            })}

            {/* Topic field */}
            {renderTopicField({
              control: form.control,
              disabled: isDisabled,
            })}

            {/* Tags field */}
            {renderTagsField({
              control: form.control,
              disabled: isDisabled,
            })}

            {/* Visibility field */}
            {renderVisibilityField({
              control: form.control,
              disabled: isDisabled,
            })}

            {/* Allowed users field */}
            {renderAllowedUsersField({
              control: form.control,
              disabled: isDisabled,
              isPublic,
            })}

            {/* Image field */}
            {renderImageField({
              control: form.control,
              disabled: isDisabled,
              onUploadingChange: setIsUploading,
            })}
          </div>

          <Separator className="my-8" />

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Questions</h3>
              <p className="text-sm text-muted-foreground">
                Add, remove, or reorder your template questions
              </p>
            </div>

            <QuestionsSection
              value={questions}
              onChange={setQuestions}
              disabled={isDisabled}
            />
          </div>
        </Card>

        <FormActions
          onCancel={() => router.back()}
          isSubmitting={isSubmitting}
          isDisabled={isDisabled}
          hasChanges={hasChanges}
          submitText="Save Changes"
          noChangesText="No Changes"
          submittingText="Saving..."
        />
      </form>
    </Form>
  );
}
