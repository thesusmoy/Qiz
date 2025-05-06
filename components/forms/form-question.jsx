'use client';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { QUESTION_TYPES } from '@/lib/constants/questions';

export function FormQuestion({ question, control, disabled = false }) {
  const renderInput = (field) => {
    switch (question.type) {
      case QUESTION_TYPES.SINGLE_LINE:
        return <Input {...field} disabled={disabled} />;
      case QUESTION_TYPES.MULTI_LINE:
        return <Textarea {...field} disabled={disabled} />;
      case QUESTION_TYPES.INTEGER:
        return <Input {...field} type="number" disabled={disabled} />;
      case QUESTION_TYPES.CHECKBOX:
        return (
          <div className="flex items-center space-x-3 pt-2">
            <span className="text-sm font-medium leading-none">
              {question.checkboxLabel || 'No'}
            </span>
            <Checkbox
              checked={field.value === 'true'}
              onCheckedChange={(checked) => field.onChange(checked.toString())}
              disabled={disabled}
            />
            <span className="text-sm font-medium leading-none">
              {question.checkboxLabel || 'Yes'}
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <FormField
      control={control}
      name={question.id}
      render={({ field }) => (
        <FormItem
          className={
            question.type === QUESTION_TYPES.CHECKBOX ? 'space-y-3' : ''
          }
        >
          <FormLabel>
            {question.text}
            {question.required && (
              <span className="text-destructive ml-1">*</span>
            )}
          </FormLabel>
          <FormControl>{renderInput(field)}</FormControl>
          {question.description && (
            <FormDescription>{question.description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
