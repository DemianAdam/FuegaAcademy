import { defineTable } from "convex/server";
import { v } from "convex/values";

export const courseSchema = defineTable({
  slug: v.string(),
  title: v.string(),
  description: v.string(),
  imageUrl: v.string(),
  polaroidImage: v.string(),
  polaroidCaption: v.string(),
  badge: v.optional(v.string()),
  duration: v.string(),
  format: v.union(v.literal("live"), v.literal("recorded"), v.literal("hybrid")),
  mentorId: v.id("mentors"), // Proper relational reference to mentors table
  achievements: v.array(
    v.object({
      icon: v.string(),
      text: v.string(),
      isHighlighted: v.optional(v.boolean()),
    })
  ),
  pricing: v.object({
    live: v.optional(
      v.object({
        amount: v.number(), // Integer amount in cents/centavos
        currency: v.string(), // e.g. "ars", "usd"
        stripePriceId: v.optional(v.string()),
      })
    ),
    recorded: v.optional(
      v.object({
        amount: v.number(), // Integer amount in cents/centavos
        currency: v.string(), // e.g. "ars", "usd"
        stripePriceId: v.optional(v.string()),
      })
    ),
  }),
})
  .index("by_slug", ["slug"])
  .index("by_mentor", ["mentorId"])
  .index("by_format", ["format"]);
