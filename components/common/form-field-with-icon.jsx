'use client';

import { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export const FormFieldWithIcon = forwardRef(
  (
    {
      control,
      name,
      label,
      description,
      placeholder,
      leadingIcon,
      trailingIcon,
      multiline = false,
      required = false,
      disabled = false,
      type = 'text',
      onTrailingIconClick,
      className,
      ...props
    },
    ref
  ) => {
    const Component = multiline ? Textarea : Input;
    const hasLeadingIcon = !!leadingIcon;
    const hasTrailingIcon = !!trailingIcon;

    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className={className}>
            {label && (
              <FormLabel>
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </FormLabel>
            )}
            <FormControl>
              <div className="relative">
                {leadingIcon && (
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {leadingIcon}
                  </div>
                )}

                <Component
                  ref={ref}
                  {...field}
                  disabled={disabled}
                  type={type}
                  placeholder={placeholder}
                  className={`
                  ${hasLeadingIcon ? 'pl-10' : ''}
                  ${hasTrailingIcon ? 'pr-10' : ''}
                `}
                  {...props}
                />

                {trailingIcon && (
                  <div
                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground ${onTrailingIconClick ? 'cursor-pointer' : ''}`}
                    onClick={onTrailingIconClick}
                  >
                    {trailingIcon}
                  </div>
                )}
              </div>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
);

FormFieldWithIcon.displayName = 'FormFieldWithIcon';
