import { z } from "zod";
import { zid } from "convex-helpers/server/zod4";
import type { Doc, Id } from "../../convex/_generated/dataModel";

export type TranslationId = Id<"translations">;
export type TranslationDoc = Doc<"translations">;
export type TranslationInput = Omit<TranslationDoc, "_id" | "_creationTime">;

export const translationValidator = z.object({
  key: z.string().min(1),
  namespace: z.string().min(1),
  languageId: zid("languages"),
  value: z.string(),
  updatedAt: z.number(),
});

export const translationInsertValidator = translationValidator;

export const translationGetByLanguageIdValidator = translationValidator.pick({
  languageId: true,
}).extend({
  namespace: z.string().optional(),
});

export const translationRemoveValidator = z.object({
  id: zid("translations"),
});
