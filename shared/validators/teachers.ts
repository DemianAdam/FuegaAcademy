import { z } from "zod";

export const teacherStatValidator = z.object({
  label: z.string(),
  value: z.string(),
});

export const teacherValidator = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  title: z.string().min(1),
  imageUrl: z.string().min(1),
  skills: z.array(z.string()),
  bio: z.string().min(1),
  quote: z.string().optional(),
  stats: z.array(teacherStatValidator).optional(),
});

export type TeacherStatInput = z.infer<typeof teacherStatValidator>;
export type TeacherInput = z.infer<typeof teacherValidator>;
