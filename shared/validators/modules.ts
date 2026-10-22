import { z } from 'zod';
import { zid } from 'convex-helpers/server/zod4';

export const lessonValidator = z.object({
  title: z.string().min(1),
  durationMinutes: z.number().int().min(0),
  description: z.string(),
});

export const moduleValidator = z.object({
  courseId: zid('courses'),
  order: z.number().int().min(0).optional(),
  title: z.string().min(1),
  // `items` is retained for existing stored curriculum. New writes also persist
  // lesson titles here until all deployed clients consume `lessons`.
  items: z.array(z.string()).optional(),
  lessons: z.array(lessonValidator).optional(),
});

export const moduleEditorInputValidator = z.object({
  id: zid('modules').optional(),
  title: z.string().min(1),
  lessons: z.array(lessonValidator),
});

export type ModuleInput = z.infer<typeof moduleValidator>;
export type LessonInput = z.infer<typeof lessonValidator>;
export type ModuleEditorInput = z.infer<typeof moduleEditorInputValidator>;

export function normalizeModuleLessons(module: {
  items?: string[];
  lessons?: LessonInput[];
}): LessonInput[] {
  if (module.lessons) return module.lessons;
  return (module.items ?? []).map((title) => ({
    title,
    durationMinutes: 0,
    description: '',
  }));
}

