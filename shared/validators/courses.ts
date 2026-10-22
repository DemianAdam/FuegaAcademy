import { z } from 'zod';
import { zid } from 'convex-helpers/server/zod4';
import type { GenericId } from 'convex/values';
import { scheduleInputItemValidator } from './schedules';
import { lessonValidator, moduleEditorInputValidator } from './modules';

export const achievementValidator = z.object({
  icon: z.string(),
  text: z.string(),
  isHighlighted: z.boolean().optional(),
});

export const moneyValidator = z.object({
  amountMinor: z.number().int().min(0),
  currency: z.literal('ARS'),
});

export const storedPricingTierValidator = z.object({
  amountMinor: z.number().int().min(0).optional(),
  amount: z.number().min(0).optional(),
  currency: z.string(),
});

export const pricingValidator = z.object({
  live: storedPricingTierValidator.optional(),
  recorded: storedPricingTierValidator.optional(),
});

export const courseValidator = z.object({
  imageUrl: z.string().min(1),
  polaroidImage: z.string().min(1),
  badge: z.string().optional(),
  duration: z.number().int().positive(),
  format: z.enum(['live', 'recorded', 'hybrid']),
  teacherId: zid('teachers'),
  pricing: pricingValidator,
  status: z.enum(['draft', 'published', 'archived']).optional(),
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  polaroidCaption: z.string(),
  achievements: z.array(achievementValidator),
});

export const pricingEditorValidator = z.object({
  live: moneyValidator.optional(),
  recorded: moneyValidator.optional(),
});

export const courseCreateInputValidator = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  imageUrl: z.string().min(1),
  polaroidImage: z.string().min(1),
  polaroidCaption: z.string(),
  badge: z.string().optional(),
  duration: z.number().int().positive(),
  format: z.enum(['live', 'recorded', 'hybrid']),
  teacherId: zid('teachers'),
  achievements: z.array(achievementValidator),
  pricing: pricingEditorValidator,
  status: z.enum(['draft', 'published']).optional(),
  schedules: z.array(scheduleInputItemValidator).optional(),
  modules: z.array(moduleEditorInputValidator).optional(),
});

export const courseUpdateValidator = z.object({
  id: zid('courses'),
  patch: courseCreateInputValidator.partial(),
});

export const courseRemoveValidator = z.object({ id: zid('courses') });
export const courseBySlugValidator = z.object({ slug: z.string().min(1) });
export const courseListPublishedValidator = z.object({
  format: z.enum(['live', 'recorded', 'hybrid']).optional(),
});

export type CourseInput = z.infer<typeof courseValidator>;
export type CourseCreateInput = z.infer<typeof courseCreateInputValidator>;
export type Money = z.infer<typeof moneyValidator>;

export interface PublicTeacher {
  _id: GenericId<'teachers'>;
  slug: string;
  name: string;
  title: string;
  imageUrl: string;
  skills: string[];
  bio: string;
  quote?: string;
  stats?: Array<{ label: string; value: string }>;
}

export interface PublicModule {
  _id: GenericId<'modules'>;
  title: string;
  order: number;
  lessons: Array<z.infer<typeof lessonValidator>>;
}

export interface PublicSchedule {
  _id: GenericId<'schedules'>;
  name: string;
  sessions: Array<{ day: number; startTime: string; endTime: string }>;
  capacity: number;
  enrolledCount: number;
}

export interface CourseWithRelations {
  _id: GenericId<'courses'>;
  _creationTime: number;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  polaroidImage: string;
  polaroidCaption: string;
  badge?: string;
  duration: number;
  format: 'live' | 'recorded' | 'hybrid';
  achievements: Array<z.infer<typeof achievementValidator>>;
  pricing: { live?: Money; recorded?: Money };
  teacher: PublicTeacher | null;
  mentor: PublicTeacher | null;
  modules: PublicModule[];
  schedules: PublicSchedule[];
}

