import { z } from 'zod';
import { zid } from 'convex-helpers/server/zod4';

export const enrollmentValidator = z.object({
  userId: zid('users'),
  courseId: zid('courses'),
  scheduleId: zid('schedules').optional(),
  orderId: zid('orders').optional(),
  completedClasses: z.number().int().min(0),
});

export type EnrollmentInput = z.infer<typeof enrollmentValidator>;

