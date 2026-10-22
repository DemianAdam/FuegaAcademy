import { z } from 'zod';
import { zid } from 'convex-helpers/server/zod4';

export const sessionValidator = z.object({
  day: z.number().int().min(1).max(7),
  startTime: z.string(),
  endTime: z.string(),
});

export const scheduleValidator = z.object({
  courseId: zid('courses'),
  name: z.string().min(1),
  sessions: z.array(sessionValidator),
  capacity: z.number().int().positive(),
  enrolledCount: z.number().int().min(0),
  isArchived: z.boolean().optional(),
});

export const scheduleInputItemValidator = z.object({
  id: zid('schedules').optional(),
  name: z.string().min(1),
  sessions: z.array(sessionValidator),
  capacity: z.number().int().positive(),
});

export type SessionInput = z.infer<typeof sessionValidator>;
export type ScheduleInput = z.infer<typeof scheduleValidator>;
export type ScheduleEditorInput = z.infer<typeof scheduleInputItemValidator>;

