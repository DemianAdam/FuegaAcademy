import { z } from "zod";
import { zid } from "convex-helpers/server/zod4";
import type { Doc, Id } from "../../convex/_generated/dataModel";

export type ModuleId = Id<"modules">;
export type ModuleDoc = Doc<"modules">;
export type ModuleInput = Omit<ModuleDoc, "_id" | "_creationTime">;

export const moduleItemValidator = z.string();

export const moduleValidator = z.object({
  courseId: zid("courses"),
  title: z.string().min(1),
  items: z.array(moduleItemValidator),
});
