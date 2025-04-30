'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '@/lib/utils/validators';
import { useFormSubmission } from '@/hooks/use-form-submission';
import { signIn, useSession } from 'next-auth/react';
import { Mail, LogIn } from 'lucide-react';
import { SmartForm } from '@/components/common/smart-form';
import { FormFieldWithIcon } from '@/components/common/form-field-with-icon';
import { PasswordField } from '@/components/common/password-field';
import { FormSection } from '@/components/common/form-section';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { update } = useSession();
  const queryReturnTo = searchParams.get('returnTo');

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const isValidReturnUrl = (url) => {
    return url && url.startsWith('/') && !url.startsWith('//');
  };

  const { isSubmitting, handleSubmit } = useFormSubmission();

  async function onSubmit(data) {
    // Login implementation remains the same
    const loginUser = async (credentials) => {
      const result = await signIn('credentials', {
        ...credentials,
        redirect: false,
      });

      if (result?.error) {
        return {
          error:
            result.error === 'Configuration'
              ? 'Invalid email or password'
              : result.error || 'Authentication failed',
        };
      }

      return { success: true };
    };

    // Handle submission with our custom hook
    await handleSubmit(loginUser, data, {
      customSuccessMessage: 'You have successfully logged in.',
      onSuccess: async () => {
        // Redirect logic remains the same
        await update();
        await new Promise((resolve) => setTimeout(resolve, 500));

        const userSpecificPath = localStorage.getItem(
          `returnPath_${encodeURIComponent(data.email)}`
        );

        const redirectUrl =
          queryReturnTo && isValidReturnUrl(queryReturnTo)
            ? queryReturnTo
            : userSpecificPath && isValidReturnUrl(userSpecificPath)
              ? userSpecificPath
              : '/';

        if (userSpecificPath) {
          localStorage.removeItem(
            `returnPath_${encodeURIComponent(data.email)}`
          );
        }

        router.refresh();
        router.push(redirectUrl);
      },
    });
  }

  return (
    <SmartForm
      form={form}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      isDisabled={isSubmitting}
      submitText="Sign In"
      submittingText="Signing in..."
      showCancelButton={false}
      withCard={false}
      submitIcon={LogIn} // Add login icon for consistency
      submitButtonClassName="w-full" // Make button full width like register form
      actionButtonsClassName="flex justify-center" // Center the button
    >
      <FormSection>
        <FormFieldWithIcon
          control={form.control}
          name="email"
          label="Email"
          placeholder="name@example.com"
          type="email"
          leadingIcon={<Mail className="h-4 w-4" />}
          disabled={isSubmitting}
        />

        <PasswordField
          control={form.control}
          name="password"
          disabled={isSubmitting}
        />
      </FormSection>
    </SmartForm>
  );
}
