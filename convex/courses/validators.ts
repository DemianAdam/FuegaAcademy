import { z } from "zod";
import { zid } from "convex-helpers/server/zod4";

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

export const courseValidator = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  imageUrl: z.string().min(1),
  polaroidImage: z.string().min(1),
  polaroidCaption: z.string().min(1),
  badge: z.string().optional(),
  duration: z.string().min(1),
  format: z.enum(["live", "recorded", "hybrid"]),
  mentorId: zid("mentors"),
  achievements: z.array(achievementValidator),
  pricing: pricingValidator,
});
