import { z } from 'zod';
import { zid } from 'convex-helpers/server/zod4';

export const finalProjectSubmissionValidator = z.object({
  enrollmentId: zid('enrollments'),
  userId: zid('users'),
  courseId: zid('courses'),
  storageId: zid('_storage'),
  contentType: z.string(),
  size: z.number().int().positive(),
  fileName: z.string().min(1).max(255),
  status: z.enum(['submitted', 'approved', 'rejected']),
  feedback: z.string().max(2000).optional(),
  reviewedBy: zid('users').optional(),
  reviewedAt: z.number().int().positive().optional(),
});
