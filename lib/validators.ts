// lib/validators.ts
import { z } from 'zod';

const toNum = (val: unknown): number => {
  if (val === '' || val === null || val === undefined) return 0;
  const n = Number(val);
  return isNaN(n) ? 0 : n;
};

export const entrySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  cash: z.preprocess(toNum, z.number().min(0).max(1_000_000)),
  card: z.preprocess(toNum, z.number().min(0).max(1_000_000)),
  qr: z.preprocess(toNum, z.number().min(0).max(1_000_000)),
});

export type EntryFormValues = z.infer<typeof entrySchema>;

export const goalSchema = z.object({
  target: z.coerce.number().min(1).max(100_000_000),
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
// Nuevo esquema para Siri en lib/validators.ts
export const siriRequestSchema = z.object({
  texto: z.string().min(1),
  userId: z.string().min(1),
  token: z.string().min(1),
});