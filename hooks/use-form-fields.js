// hooks/use-form-fields.jsx
'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ImageUpload } from '@/components/ui/image-upload';
import { TagInput } from '@/components/ui/tag-input';
import { UserSelect } from '@/components/templates/common/inputs/user-select';
import { TEMPLATE_TOPICS } from '@/lib/constants/templates';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/**
 * Custom hook that provides standardized form field components
 * for template creation and editing forms
 * @param {Object} options Configuration options
 * @returns {Object} Form field rendering functions
 */
export function useFormFields() {
  /**
   * Renders a text input field with consistent styling
   */
  const renderTextField = ({
    control,
    name,
    label,
    description,
    disabled,
    placeholder,
    multiline = false,
  }) => {
    const Component = multiline ? Textarea : Input;

    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Component
                {...field}
                disabled={disabled}
                placeholder={placeholder}
              />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  /**
   * Renders a topic selection field with predefined topics
   */
  const renderTopicField = ({ control, disabled }) => {
    return (
      <FormField
        control={control}
        name="topic"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Topic</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={disabled}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a topic" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {TEMPLATE_TOPICS.map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  /**
   * Renders a tags input field
   */
  const renderTagsField = ({ control, disabled }) => {
    return (
      <FormField
        control={control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tags</FormLabel>
            <FormControl>
              <TagInput
                value={field.value}
                onChange={field.onChange}
                disabled={disabled}
              />
            </FormControl>
            <FormDescription>
              Add up to 5 tags (press Enter or comma to add)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  /**
   * Renders a public/private toggle switch
   */
  const renderVisibilityField = ({ control, disabled }) => {
    return (
      <FormField
        control={control}
        name="isPublic"
        render={({ field }) => (
          <FormItem className="flex items-center gap-2">
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={disabled}
              />
            </FormControl>
            <FormLabel className="!mt-0">Make this template public</FormLabel>
          </FormItem>
        )}
      />
    );
  };

  /**
   * Renders the allowed users field (conditionally)
   */
  const renderAllowedUsersField = ({ control, disabled, isPublic }) => {
    if (isPublic) return null;

    return (
      <FormField
        control={control}
        name="allowedUsers"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Allowed Users</FormLabel>
            <FormControl>
              <UserSelect
                value={field.value}
                onChange={field.onChange}
                disabled={disabled}
              />
            </FormControl>
            <FormDescription>
              Select users who can access this template
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  /**
   * Renders an image upload field
   */
  const renderImageField = ({ control, disabled, onUploadingChange }) => {
    return (
      <FormField
        control={control}
        name="image"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Image</FormLabel>
            <FormControl>
              <ImageUpload
                value={field.value}
                onChange={field.onChange}
                disabled={disabled}
                onUploadingChange={onUploadingChange}
              />
            </FormControl>
            <FormDescription>
              Add an optional image for your template
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return {
    renderTextField,
    renderTopicField,
    renderTagsField,
    renderVisibilityField,
    renderAllowedUsersField,
    renderImageField,
  };
}
