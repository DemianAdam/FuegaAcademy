import { z } from "zod";
import { zid } from "convex-helpers/server/zod4";
import type { Doc, Id } from "../../convex/_generated/dataModel";

export type LanguageId = Id<"languages">;
export type LanguageDoc = Doc<"languages">;
export type LanguageInput = Omit<LanguageDoc, "_id" | "_creationTime">;

export const languageValidator = z.object({
  code: z.string().min(2),
  name: z.string().min(1),
  isActive: z.boolean(),
  isDefault: z.boolean(),
});

export const languageInsertValidator = languageValidator;

export const languageUpdateValidator = languageValidator.partial().extend({
  id: zid("languages"),
});

export type MissingLanguageId = Id<"missingLanguages">;
export type MissingLanguageDoc = Doc<"missingLanguages">;
export type MissingLanguageInput = Omit<MissingLanguageDoc, "_id" | "_creationTime">;

export const missingLanguageValidator = z.object({
  languageCode: z.string().min(1),
  count: z.number(),
  lastRequestedAt: z.number(),
});

export const missingLanguageInsertValidator = missingLanguageValidator;

export const missingLanguageReportValidator = missingLanguageValidator.pick({
  languageCode: true,
});
