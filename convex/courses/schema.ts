import { defineTable } from "convex/server";
import { zodOutputToConvex } from "convex-helpers/server/zod";
import { courseValidator } from "@shared/validators/courses";

export const courseSchema = defineTable(zodOutputToConvex(courseValidator))
  .index("by_slug", ["slug"]);
