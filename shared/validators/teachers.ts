import { z } from 'zod';
import { zid } from 'convex-helpers/server/zod4';

export const teacherStatValidator = z.object({
  label: z.string(),
  value: z.string(),
});

export const teacherValidator = z.object({
  imageUrl: z.string().min(1),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  stats: z.array(teacherStatValidator).optional(),
  slug: z.string().min(1),
  name: z.string().min(1),
  title: z.string().min(1),
  skills: z.array(z.string()),
  bio: z.string().min(1),
  quote: z.string().optional(),
});

export const teacherInsertValidator = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  imageUrl: z.string().min(1),
  skills: z.array(z.string()),
  bio: z.string().min(1),
  quote: z.string().optional(),
  stats: z.array(teacherStatValidator).optional(),
  status: z.enum(['draft', 'published']).optional(),
});

export const teacherUpdateValidator = z.object({
  id: zid('teachers'),
  patch: teacherInsertValidator.partial(),
});

export const teacherRemoveValidator = z.object({ id: zid('teachers') });
export const teacherBySlugValidator = z.object({ slug: z.string().min(1) });

export type TeacherInput = z.infer<typeof teacherValidator>;
export type TeacherInsertInput = z.infer<typeof teacherInsertValidator>;
export type TeacherStatInput = z.infer<typeof teacherStatValidator>;

