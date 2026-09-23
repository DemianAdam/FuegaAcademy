import { defineTable } from "convex/server";
import { v } from "convex/values";

export const scheduleSchema = defineTable({
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
}).index("by_course", ["courseId"]);
