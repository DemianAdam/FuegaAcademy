import { defineTable } from "convex/server";
import { zodOutputToConvex } from "convex-helpers/server/zod";
import { mentorValidator } from "@shared/validators/mentors";

export const mentorSchema = defineTable(zodOutputToConvex(mentorValidator))
  .index("by_name", ["name"]);
