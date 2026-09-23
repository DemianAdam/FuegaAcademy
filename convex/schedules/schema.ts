import { defineTable } from "convex/server";
import { zodOutputToConvex } from "convex-helpers/server/zod";
import { scheduleValidator } from "./validators";

export const scheduleSchema = defineTable(zodOutputToConvex(scheduleValidator))
  .index("by_course", ["courseId"]);
