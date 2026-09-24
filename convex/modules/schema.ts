import { defineTable } from "convex/server";
import { zodOutputToConvex } from "convex-helpers/server/zod";
import { moduleValidator } from "@shared/validators/modules";

export const moduleSchema = defineTable(zodOutputToConvex(moduleValidator))
  .index("by_course", ["courseId"]);
