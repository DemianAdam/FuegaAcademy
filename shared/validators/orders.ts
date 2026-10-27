import { z } from 'zod';
import { zid } from 'convex-helpers/server/zod4';

export const orderValidator = z.object({
  userId: zid('users'),
  courseId: zid('courses'),
  scheduleId: zid('schedules').optional(),
  tier: z.enum(['live', 'recorded']),
  amountMinor: z.number().int().min(0).optional(),
  amount: z.number().min(0).optional(),
  currency: z.string(),
  status: z.enum(['pending', 'approved', 'review', 'rejected', 'expired', 'refunded', 'charged_back']),
  provider: z.literal('mercadopago'),
  courseTitle: z.string().optional(),
  courseSlug: z.string().optional(),
  payerEmail: z.string().optional(),
  externalPreferenceId: z.string().optional(),
  checkoutUrl: z.string().url().optional(),
  expiresAt: z.number().int().positive().optional(),
  externalPaymentId: z.string().optional(),
  failureReason: z.string().optional(),
  preferenceClosureStatus: z.enum(['pending', 'closed']).optional(),
  preferenceClosedAt: z.number().int().positive().optional(),
});

export const createCheckoutPreferenceValidator = z.object({
  courseId: zid('courses'),
  scheduleId: zid('schedules').optional(),
  tier: z.enum(['live', 'recorded']),
});

export type OrderInput = z.infer<typeof orderValidator>;
export type CreateCheckoutPreferenceInput = z.infer<typeof createCheckoutPreferenceValidator>;

