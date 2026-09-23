import { defineTable } from "convex/server";
import { v } from "convex/values";

export const moduleSchema = defineTable({
  courseId: v.id("courses"),
  title: v.string(),
  items: v.array(v.string()),
}).index("by_course", ["courseId"]);
