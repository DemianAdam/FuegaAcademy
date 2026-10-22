import { z } from 'zod';

export const userRolesValidator = z.enum(['admin', 'student']);

export const userValidator = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  emailVerificationTime: z.number().optional(),
  image: z.string().optional(),
  phone: z.string().optional(),
  isAnonymous: z.boolean().optional(),
  role: userRolesValidator.optional(),
});

export type UserInput = z.infer<typeof userValidator>;
