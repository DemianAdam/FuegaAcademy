import { defineTable } from "convex/server";
import { zodOutputToConvex } from "convex-helpers/server/zod";
import {
  examValidator,
  attemptValidator,
  resourceValidator,
  uploadValidator,
} from "@shared/validators/learning";
export const examSchema = defineTable(zodOutputToConvex(examValidator)).index(
  "by_course",
  ["courseId"],
);
export const attemptSchema = defineTable(
  zodOutputToConvex(attemptValidator),
).index("by_enrollment", ["enrollmentId"]);
export const resourceSchema = defineTable(
  zodOutputToConvex(resourceValidator),
).index("by_course", ["courseId"]);
export const uploadSchema = defineTable(
  zodOutputToConvex(uploadValidator),
).index("by_storage", ["storageId"]);
