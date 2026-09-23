import { defineTable } from "convex/server";
import { zodOutputToConvex } from "convex-helpers/server/zod";
import { mentorValidator } from "./validators";

export const mentorSchema = defineTable(zodOutputToConvex(mentorValidator))
  .index("by_name", ["name"]);
