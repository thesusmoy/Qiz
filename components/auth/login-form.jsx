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
      <button
        type="button"
        onClick={() => signIn('google')}
        className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md py-2 mt-2 hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
      >
        {/* Google icon SVG here */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 0 24 24"
          width="24"
        >
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
          <path d="M1 1h22v22H1z" fill="none" />
        </svg>
        Continue with Google
      </button>
    </SmartForm>
  );
}
