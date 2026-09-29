import { defineTable } from "convex/server";
import { zodOutputToConvex } from "convex-helpers/server/zod4";
import { languageValidator, missingLanguageValidator } from "./validators";

export const languageSchema = defineTable(zodOutputToConvex(languageValidator))
  .index("by_code", ["code"])
  .index("by_active", ["isActive"]);

export const missingLanguageSchema = defineTable(zodOutputToConvex(missingLanguageValidator))
  .index("by_lang", ["languageCode"]);
