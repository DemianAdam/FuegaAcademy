import { z } from "zod";
import { zid } from "convex-helpers/server/zod4";
import type { Doc, Id } from "../../convex/_generated/dataModel";

export type EnrollmentId = Id<"enrollments">;
export type EnrollmentDoc = Doc<"enrollments">;
export type EnrollmentInput = Omit<EnrollmentDoc, "_id" | "_creationTime">;

export const enrollmentValidator = z.object({
  userId: zid("users"),
  courseId: zid("courses"),
  scheduleId: zid("schedules").optional(),
  completedClasses: z.number().min(0),
});

export const enrollInCourseValidator = z.object({
  courseId: zid("courses"),
  scheduleId: zid("schedules").optional(),
});
