import { z } from "zod";
import { zid } from "convex-helpers/server/zod4";
export const question = z.object({
  id: z.string(),
  prompt: z.string().min(1),
  options: z.array(z.string().min(1)).min(2),
  correct: z.number().int().min(0),
});
export const examInput = z.object({
  courseId: zid("courses"),
  kind: z.enum(["quiz", "manual"]),
  instructions: z.string().min(1),
  passingPercent: z.number().min(1).max(100).default(70),
  questions: z.array(question),
});
export const examValidator = examInput.extend({
  version: z.number(),
  published: z.boolean(),
});
export const attemptValidator = z.object({
  enrollmentId: zid("enrollments"),
  examId: zid("exams"),
  number: z.number(),
  status: z.enum(["submitted", "passed", "failed"]),
  answers: z.array(z.number()).optional(),
  uploadId: zid("privateUploads").optional(),
  score: z.number().optional(),
  feedback: z.string().optional(),
  reviewedBy: zid("users").optional(),
  reviewedAt: z.number().optional(),
  reopenedBy: zid("users").optional(),
  reopenedAt: z.number().optional(),
});
export const resourceValidator = z.object({
  courseId: zid("courses"),
  lessonId: z.string().optional(),
  scheduleId: zid("schedules").optional(),
  title: z.string().min(1),
  kind: z.enum(["recording", "material", "live"]),
  url: z.string().url().optional(),
  uploadId: zid("privateUploads").optional(),
});
export const uploadValidator = z.object({
  ownerId: zid("users"),
  purpose: z.enum(["material", "exam"]),
  enrollmentId: zid("enrollments").optional(),
  storageId: zid("_storage").optional(),
  fileName: z.string(),
  attached: z.boolean(),
  contentType: z.string().optional(),
  size: z.number().optional(),
});
