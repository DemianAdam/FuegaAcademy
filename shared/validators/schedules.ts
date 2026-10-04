import { z } from "zod";
import { zid } from "convex-helpers/server/zod4";
import type { Doc, Id } from "../../convex/_generated/dataModel";

export type ScheduleId = Id<"schedules">;
export type ScheduleDoc = Doc<"schedules">;
export type ScheduleInput = Omit<ScheduleDoc, "_id" | "_creationTime">;

export const sessionValidator = z.object({
  day: z.number().int().min(1).max(7),
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
    
export type SessionInput = z.infer<typeof sessionValidator>;
