'use client';

import { useRouter } from 'next/navigation';
import { useTemplateForm } from '@/hooks/use-template-form';
import { useFormFields } from '@/hooks/use-form-fields';
import { SmartForm } from '@/components/common/smart-form';
import { FormSection } from '@/components/common/form-section';
import { QuestionsSection } from '@/components/questions/questions-section';

export function TemplateCreateForm() {
  const router = useRouter();

  const {
    form,
    questions,
    setQuestions,
    isDisabled,
    isSubmitting,
    setIsUploading,
    handleSubmit,
  } = useTemplateForm({
    successMessage: 'Template created successfully',
    redirectPath: '/templates',
  });

  const {
    renderTextField,
    renderTopicField,
    renderTagsField,
    renderVisibilityField,
    renderAllowedUsersField,
    renderImageField,
  } = useFormFields();

  const isPublic = form.watch('isPublic');

  return (
    <SmartForm
      form={form}
      onSubmit={handleSubmit}
      onCancel={() => router.back()}
      isSubmitting={isSubmitting}
      isDisabled={isDisabled}
      submitText="Create Template"
      submittingText="Creating..."
    >
      <FormSection
        title="Basic Information"
        description="Provide basic details about your template"
      >
        {renderTextField({
          control: form.control,
          name: 'title',
          label: 'Title',
          description: 'Give your template a clear and descriptive title',
          disabled: isDisabled,
        })}

        {renderTextField({
          control: form.control,
          name: 'description',
          label: 'Description',
          description: 'Describe what this template is for',
          multiline: true,
          disabled: isDisabled,
        })}

        {renderTopicField({
          control: form.control,
          disabled: isDisabled,
        })}

        {renderTagsField({
          control: form.control,
          disabled: isDisabled,
        })}

        {renderVisibilityField({
          control: form.control,
          disabled: isDisabled,
        })}

        {renderAllowedUsersField({
          control: form.control,
          disabled: isDisabled,
          isPublic,
        })}

        {renderImageField({
          control: form.control,
          disabled: isDisabled,
          onUploadingChange: setIsUploading,
        })}
      </FormSection>

      <FormSection
        title="Questions"
        description="Add and organize your template questions"
        withSeparator
      >
        <QuestionsSection
          value={questions}
          onChange={setQuestions}
          disabled={isDisabled}
        />
      </FormSection>
    </SmartForm>
  );
}
