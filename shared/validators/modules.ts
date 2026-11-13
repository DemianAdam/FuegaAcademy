import { z } from "zod";
import { zid } from "convex-helpers/server/zod4";

export const lessonValidator = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  durationMinutes: z.number().int().min(0),
  description: z.string(),
});

export const moduleValidator = z.object({
  courseId: zid("courses"),
  order: z.number().int().min(0).optional(),
  title: z.string().min(1),
  lessons: z.array(lessonValidator),
});

export const moduleEditorInputValidator = z.object({
  id: zid("modules").optional(),
  title: z.string().min(1),
  lessons: z.array(lessonValidator),
});

export type ModuleInput = z.infer<typeof moduleValidator>;
export type LessonInput = z.infer<typeof lessonValidator>;
export type ModuleEditorInput = z.infer<typeof moduleEditorInputValidator>;

export function normalizeModuleLessons(module: {
  lessons: LessonInput[];
}): LessonInput[] {
  return module.lessons;
}
