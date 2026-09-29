import { zAdminMutation, zMutation } from "../zod";
import { languageValidator } from "./validators";
import { zid } from "convex-helpers/server/zod4";
import { z } from "zod";

export const create = zAdminMutation({
  args: languageValidator,
  handler: async (ctx, args) => {
    // If new language is default, unset other defaults
    if (args.isDefault) {
      const existingLangs = await ctx.db.query("languages").collect();
      for (const lang of existingLangs) {
        if (lang.isDefault) {
          await ctx.db.patch(lang._id, { isDefault: false });
        }
      }
    }

    return await ctx.db.insert("languages", {
      ...args
    });
  },
});

export const update = zAdminMutation({
  args: {
    id: zid("languages"),
    name: languageValidator.shape.name.optional(),
    isActive: languageValidator.shape.isActive.optional(),
    isDefault: languageValidator.shape.isDefault.optional(),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    if (updates.isDefault) {
      const existingLangs = await ctx.db.query("languages").collect();
      for (const lang of existingLangs) {
        if (lang.isDefault && lang._id !== id) {
          await ctx.db.patch(lang._id, { isDefault: false });
        }
      }
    }
    await ctx.db.patch(id, updates);
  },
});

export const reportMissingLanguage = zMutation({
  args: { languageCode: z.string().min(1) },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("missingLanguages")
      .withIndex("by_lang", (q) => q.eq("languageCode", args.languageCode))
      .unique();

    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, {
        count: existing.count + 1,
        lastRequestedAt: now,
      });
      return existing._id;
    }

    return await ctx.db.insert("missingLanguages", {
      languageCode: args.languageCode,
      count: 1,
      lastRequestedAt: now,
    });
  },
});
