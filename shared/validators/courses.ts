import { z } from "zod";
import { zid } from "convex-helpers/server/zod4";
import type { Doc, Id } from "../../convex/_generated/dataModel";
import type { TeacherDoc } from "./teachers";
import type { ModuleDoc } from "./modules";
import type { ScheduleDoc } from "./schedules";

export type CourseId = Id<"courses">;
export type CourseDoc = Doc<"courses">;
export type CourseInput = Omit<CourseDoc, "_id" | "_creationTime">;
export type CourseInsertInput = CourseInput;

export const achievementValidator = z.object({
  icon: z.string(),
  text: z.string(),
  isHighlighted: z.boolean().optional(),
});

export const pricingTierValidator = z.object({
  amount: z.number(),
  currency: z.string(),
  stripePriceId: z.string().optional(),
});

export const pricingValidator = z.object({
  live: pricingTierValidator.optional(),
  recorded: pricingTierValidator.optional(),
});

export const courseInsertValidator = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  imageUrl: z.string().min(1),
  polaroidImage: z.string().min(1),
  polaroidCaption: z.string().min(1),
  badge: z.string().optional(),
  duration: z.number(),
  format: z.enum(["live", "recorded", "hybrid"]),
  teacherId: zid("teachers"),
  achievements: z.array(achievementValidator),
  pricing: pricingValidator,
});

export const courseValidator = courseInsertValidator;

export const courseUpdateValidator = z.object({
  id: zid("courses"),
  patch: courseInsertValidator.partial(),
});

export const courseRemoveValidator = z.object({
  id: zid("courses"),
});

export const courseBySlugValidator = courseValidator.pick({
  slug: true,
});

export type CourseWithRelations = CourseDoc & {
  teacher: TeacherDoc | null;
  mentor: TeacherDoc | null;
  modules: ModuleDoc[];
  schedules: ScheduleDoc[];
};
