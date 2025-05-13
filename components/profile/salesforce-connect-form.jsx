'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useFormSubmission } from '@/hooks/use-form-submission';
import { FormSection } from '@/components/common/form-section';
import { FormFieldWithIcon } from '@/components/common/form-field-with-icon';

const formSchema = z.object({
  companyName: z.string().min(2, {
    message: 'Company name must be at least 2 characters.',
  }),
  industry: z.string().min(1, {
    message: 'Please select an industry.',
  }),
  jobTitle: z.string().optional(),
  department: z.string().optional(),
  phone: z.string().optional(),
  companyPhone: z.string().optional(),
  website: z
    .string()
    .url({
      message: 'Please enter a valid URL',
    })
    .optional()
    .or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  description: z.string().optional(),
});

const industryOptions = [
  'Agriculture',
  'Apparel',
  'Banking',
  'Biotechnology',
  'Chemicals',
  'Communications',
  'Construction',
  'Consulting',
  'Education',
  'Electronics',
  'Energy',
  'Engineering',
  'Entertainment',
  'Environmental',
  'Finance',
  'Food & Beverage',
  'Government',
  'Healthcare',
  'Hospitality',
  'Insurance',
  'Machinery',
  'Manufacturing',
  'Media',
  'Not For Profit',
  'Recreation',
  'Retail',
  'Shipping',
  'Technology',
  'Telecommunications',
  'Transportation',
  'Utilities',
  'Other',
];

export function SalesforceConnectForm({ user, onClose }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: '',
      industry: '',
      jobTitle: '',
      department: '',
      phone: '',
      companyPhone: '',
      website: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      description: '',
    },
  });

  const { isSubmitting, handleSubmit } = useFormSubmission({
    successMessage: 'Successfully connected to Salesforce',
  });

  const submitToSalesforce = async (data) => {
    const salesforceData = {
      ...data,
      userId: user.id,
      firstName: user.name?.split(' ')[0] || '',
      lastName: user.name?.split(' ').slice(1).join(' ') || '',
      email: user.email,
    };

    const response = await fetch('/api/salesforce/create-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(salesforceData),
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || 'Failed to connect to Salesforce' };
    }

    return {
      ...result,
      successMessage: result.isDuplicate
        ? 'You already have a record in Salesforce'
        : 'Your information has been sent to Salesforce',
    };
  };

  const onSubmit = async (data) => {
    const result = await handleSubmit(submitToSalesforce, data, {
      onSuccess: () => onClose(),
    });
    return result;
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Connect to Salesforce CRM</DialogTitle>
          <DialogDescription>
            Provide additional information to create your account in Salesforce
            CRM.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 pt-2"
          >
            <FormSection title="Company Information">
              <FormFieldWithIcon
                control={form.control}
                name="companyName"
                label="Company Name"
                placeholder="Your company name"
                required
              />

              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {industryOptions.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormFieldWithIcon
                  control={form.control}
                  name="website"
                  label="Website"
                  placeholder="https://example.com"
                />

                <FormFieldWithIcon
                  control={form.control}
                  name="companyPhone"
                  label="Company Phone"
                  placeholder="Company phone number"
                />
              </div>
            </FormSection>

            <FormSection title="Your Position" withSeparator>
              <div className="grid grid-cols-2 gap-4">
                <FormFieldWithIcon
                  control={form.control}
                  name="jobTitle"
                  label="Job Title"
                  placeholder="Your job title"
                />

                <FormFieldWithIcon
                  control={form.control}
                  name="department"
                  label="Department"
                  placeholder="Your department"
                />
              </div>

              <FormFieldWithIcon
                control={form.control}
                name="phone"
                label="Your Phone"
                placeholder="Your phone number"
              />
            </FormSection>

            <FormSection title="Address Information" withSeparator>
              <FormFieldWithIcon
                control={form.control}
                name="address"
                label="Street Address"
                placeholder="123 Main St"
              />

              <div className="grid grid-cols-2 gap-4">
                <FormFieldWithIcon
                  control={form.control}
                  name="city"
                  label="City"
                  placeholder="City"
                />

                <FormFieldWithIcon
                  control={form.control}
                  name="state"
                  label="State/Province"
                  placeholder="State or Province"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormFieldWithIcon
                  control={form.control}
                  name="postalCode"
                  label="Postal Code"
                  placeholder="Postal/ZIP code"
                />

                <FormFieldWithIcon
                  control={form.control}
                  name="country"
                  label="Country"
                  placeholder="Country"
                />
              </div>
            </FormSection>

            <FormSection title="Additional Information" withSeparator>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional information"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormSection>

            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Connect'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
