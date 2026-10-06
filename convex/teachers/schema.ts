import { defineTable } from "convex/server";
import { zodOutputToConvex } from "convex-helpers/server/zod";
import { teacherValidator } from "@shared/validators/teachers";

export const teacherSchema = defineTable(zodOutputToConvex(teacherValidator))
  .index("by_slug", ["slug"]);
