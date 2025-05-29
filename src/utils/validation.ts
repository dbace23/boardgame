import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string()
    .email('Invalid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must not exceed 50 characters'),

    email: z
      .string()
      .email('Invalid email address'),

    password: z
      .string()
      .min(6, 'Password must be at least 6 characters'),

    confirmPassword: z
      .string()
      .min(6, 'Confirm Password must be at least 6 characters'),

    city: z
      .string()
      .min(2, 'City must be at least 2 characters')
      .max(100, 'City must not exceed 50 characters')
      .optional()
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

export const profileSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters'),
  email: z.string()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')),
  city: z.string()
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City must not exceed 50 characters')
    .optional()
    .or(z.literal('')),
  boardGameGeekAccount: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must not exceed 30 characters')
    .optional()
    .or(z.literal('')),
  age: z.number()
    .min(13, 'Must be at least 13 years old')
    .max(120, 'Invalid age')
    .optional()
    .nullable()
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;