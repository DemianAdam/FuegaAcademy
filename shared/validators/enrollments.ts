import { z } from "zod";
import { zid } from "convex-helpers/server/zod4";

export const enrollmentValidator = z.object({
  userId: zid("users"),
  courseId: zid("courses"),
  scheduleId: zid("schedules").optional(),
  orderId: zid("orders").optional(),
  completedClasses: z.number().int().min(0),
  status: z.enum(["active", "completed", "revoked"]),
  fundingPaymentId: zid("paymentAttempts"),
  examId: zid("exams"),
  tier: z.enum(["live", "recorded"]),
  runNumber: z.number(),
  attemptNumber: z.number(),
  retryOpen: z.boolean(),
  reopenedBy: zid("users").optional(),
  reopenedAt: z.number().optional(),
  completedLessonIds: z.array(z.string()),
  completedAt: z.number().int().positive().optional(),
});

export type EnrollmentInput = z.infer<typeof enrollmentValidator>;
