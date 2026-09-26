import { z } from "zod";

export const teacherValidator = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  title: z.string().min(1),
  imageUrl: z.string().min(1),
  skills: z.array(z.string()),
  bio: z.string().min(1),
});

export type TeacherInput = z.infer<typeof teacherValidator>;
