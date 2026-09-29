import { defineTable } from "convex/server";
import { zodOutputToConvex } from "convex-helpers/server/zod4";
import { translationValidator } from "./validators";

export const translationSchema = defineTable(zodOutputToConvex(translationValidator))
  .index("by_lang_ns_key", ["languageId", "namespace", "key"]);
