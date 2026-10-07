import { z } from "zod";
import { zid } from "convex-helpers/server/zod4";
import type { Doc, Id } from "../../convex/_generated/dataModel";

export type TeacherId = Id<"teachers">;
export type TeacherDoc = Doc<"teachers">;
export type TeacherInput = Omit<TeacherDoc, "_id" | "_creationTime">;

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

export const teacherInsertValidator = teacherValidator.omit({ slug: true });

export const teacherUpdateValidator = z.object({
  id: zid("teachers"),
  patch: teacherInsertValidator.partial(),
});

export const teacherRemoveValidator = z.object({
  id: zid("teachers"),
});

export const teacherBySlugValidator = teacherValidator.pick({
  slug: true,
});


export type TeacherStatInput = z.infer<typeof teacherStatValidator>;
