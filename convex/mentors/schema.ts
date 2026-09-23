import { defineTable } from "convex/server";
import { v } from "convex/values";

export const mentorSchema = defineTable({
  name: v.string(),
  title: v.string(),
  bio: v.string(),
  quote: v.optional(v.string()),
  imageUrl: v.string(),
  skills: v.array(v.string()),
  stats: v.optional(
    v.array(
      v.object({
        label: v.string(),
        value: v.string(),
      })
    )
  ),
}).index("by_name", ["name"]);
