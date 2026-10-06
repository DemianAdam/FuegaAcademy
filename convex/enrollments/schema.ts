import { defineTable } from "convex/server";
import { zodOutputToConvex } from "convex-helpers/server/zod";
import { enrollmentValidator } from "@shared/validators/enrollments";

export const enrollmentSchema = defineTable(zodOutputToConvex(enrollmentValidator))
  .index("by_user_course", ["userId", "courseId"]);
