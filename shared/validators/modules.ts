import { z } from "zod";
import { zid } from "convex-helpers/server/zod4";

export const moduleItemValidator = z.string();

export const moduleValidator = z.object({
  courseId: zid("courses"),
  title: z.string().min(1),
  items: z.array(moduleItemValidator),
});

export type ModuleInput = z.infer<typeof moduleValidator>;
