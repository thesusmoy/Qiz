'use client';

import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { FormFieldWithIcon } from '@/components/common/form-field-with-icon';

/**
 * PasswordField - A specialized field for password entry with toggle visibility
 */
export function PasswordField({
  control,
  name,
  label = 'Password',
  description,
  placeholder = '••••••••',
  disabled = false,
  required = false,
  className,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => setShowPassword((prev) => !prev);

  return (
    <FormFieldWithIcon
      control={control}
      name={name}
      label={label}
      description={description}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      type={showPassword ? 'text' : 'password'}
      leadingIcon={<Lock className="h-4 w-4" />}
      trailingIcon={showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
      onTrailingIconClick={toggleVisibility}
      className={className}
      {...props}
    />
  );
}
