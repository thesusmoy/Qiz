import { z } from 'zod';
import { TEMPLATE_TOPICS } from '../constants/templates';
import { QUESTION_TYPES } from '../constants/questions';

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

export const RegisterSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

export const QuestionSchema = z.object({
  text: z.string().min(1, { message: 'Question title is required' }),
  description: z.string().optional(),
  type: z
    .string()
    .refine((value) => Object.values(QUESTION_TYPES).includes(value), {
      message: 'Invalid question type',
    }),
  required: z.boolean().default(false),
  showInResults: z.boolean().default(true),
});

export const TemplateSchema = z
  .object({
    title: z
      .string()
      .min(3, { message: 'Title must be at least 3 characters' })
      .max(100, { message: 'Title must be less than 100 characters' }),
    description: z
      .string()
      .max(500, { message: 'Description must be less than 500 characters' })
      .optional()
      .nullable(),
    topic: z.string().refine((value) => TEMPLATE_TOPICS.includes(value), {
      message: 'Please select a valid topic',
    }),
    tags: z
      .string()
      .optional()
      .transform((str) => {
        if (!str) return [];
        const tags = str
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean);
        return [...new Set(tags)];
      }),
    isPublic: z.boolean().default(false),
    image: z
      .string({
        required_error: 'Image is required',
      })
      .min(1, { message: 'Image is required' }),
    allowedUsers: z
      .string()
      .optional()
      .transform((str) => {
        if (!str) return [];
        return str
          .split(',')
          .map((email) => email.trim())
          .filter(Boolean);
      }),
  })
  .superRefine((data, ctx) => {
    if (!data.isPublic) {
      if (data.allowedUsers.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'At least one allowed user is required when the template is restricted',
          path: ['allowedUsers'],
        });
        return;
      }

      for (const email of data.allowedUsers) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Invalid email format in allowed users',
            path: ['allowedUsers'],
          });
        }
      }
    }
  });

export const FormResponseSchema = z.object({}).strict();

export function createFormResponseSchema(questions) {
  const shape = questions.reduce((acc, question) => {
    switch (question.type) {
      case QUESTION_TYPES.INTEGER:
        acc[question.id] = question.required
          ? z.string().min(1, 'This field is required')
          : z.string().optional();
        break;
      case QUESTION_TYPES.CHECKBOX:
        acc[question.id] = z.string();
        break;
      default:
        acc[question.id] = question.required
          ? z.string().min(1, 'This field is required')
          : z.string().optional();
    }
    return acc;
  }, {});

  return FormResponseSchema.extend(shape);
}
