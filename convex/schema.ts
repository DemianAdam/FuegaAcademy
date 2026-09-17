import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  courses: defineTable({
    slug: v.string(),
    title: v.string(),
    titleHighlight: v.string(),
    description: v.string(),
    imageUrl: v.string(),
    heroImage: v.string(),
    polaroidImage: v.string(),
    polaroidCaption: v.string(),
    badge: v.union(v.literal("most-chosen"), v.literal("new"), v.literal("popular")),
    duration: v.string(),
    format: v.string(),
    pricing: v.object({
      live: v.object({ label: v.string(), price: v.string() }),
      recorded: v.object({ label: v.string(), price: v.string() }),
    }),
    mentor: v.object({
      name: v.string(),
      title: v.string(),
      bio: v.string(),
      quote: v.string(),
      image: v.string(),
      stats: v.array(v.object({ label: v.string(), value: v.string() })),
    }),
    stats: v.array(v.object({ icon: v.string(), value: v.string(), label: v.string() })),
    achievements: v.array(v.object({ icon: v.string(), text: v.string(), bold: v.optional(v.boolean()) })),
  }).index("by_slug", ["slug"]),

  modules: defineTable({
    courseId: v.id("courses"),
    title: v.string(),
    order: v.number(),
  }).index("by_course", ["courseId"]),

  schedules: defineTable({
    courseId: v.id("courses"),
    name: v.string(),
    sessions: v.array(
      v.object({
        day: v.string(),
        startTime: v.string(),
        endTime: v.string(),
      })
    ),
    capacity: v.number(),
    enrolledCount: v.number(),
    isActive: v.boolean(),
  }).index("by_course", ["courseId"]),

  enrollments: defineTable({
    userId: v.id("users"),
    courseId: v.id("courses"),
    scheduleId: v.optional(v.id("schedules")),
    format: v.union(v.literal("live"), v.literal("recorded")),
    paymentStatus: v.union(v.literal("pending"), v.literal("completed"), v.literal("cancelled")),
    stripeSessionId: v.string(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]).index("by_course", ["courseId"]),
});
