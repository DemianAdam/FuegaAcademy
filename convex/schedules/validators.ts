import { z } from "zod";
import { zid } from "convex-helpers/server/zod4";

export const sessionValidator = z.object({
  day: z.string(),
  startTime: z.string(),
  endTime: z.string(),
});

export const scheduleValidator = z.object({
  courseId: zid("courses"),
  name: z.string().min(1),
  sessions: z.array(sessionValidator),
  capacity: z.number(),
  enrolledCount: z.number(),
});
