import { zAdminMutation } from "../zod";
import { translationValidator, translationRemoveValidator } from "./validators";

export const upsert = zAdminMutation({
  args: translationValidator,
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("translations")
      .withIndex("by_lang_ns_key", (q) =>
        q.eq("languageId", args.languageId).eq("namespace", args.namespace).eq("key", args.key)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        value: args.value,
        updatedAt: args.updatedAt,
      });
      return existing._id;
    }

    return await ctx.db.insert("translations", args);
  },
});

export const remove = zAdminMutation({
  args: translationRemoveValidator,
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
