// Zod v4 validation schemas
// lib/validators.ts

import { z } from 'zod';

export const entrySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  cash: z.coerce.number().min(0, 'Cash cannot be negative').max(1_000_000, 'Value too large'),
  card: z.coerce.number().min(0, 'Card cannot be negative').max(1_000_000, 'Value too large'),
  qr: z.coerce.number().min(0, 'QR cannot be negative').max(1_000_000, 'Value too large'),
});

export type EntryFormValues = z.infer<typeof entrySchema>;

export const goalSchema = z.object({
  target: z.coerce
    .number()
    .min(1, 'Goal must be at least 1')
    .max(100_000_000, 'Value too large'),
});

export type GoalFormValues = z.infer<typeof goalSchema>;

export const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = authSchema.extend({
  displayName: z.string().min(2, 'Name must be at least 2 characters').optional(),
});

export type AuthFormValues = z.infer<typeof authSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
