import { defineTable } from "convex/server";
import { zodOutputToConvex } from "convex-helpers/server/zod";
import { scheduleValidator } from "@shared/validators/schedules";

export const scheduleSchema = defineTable(zodOutputToConvex(scheduleValidator))
  .index("by_course", ["courseId"]);
