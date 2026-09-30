import { zQuery } from "../zod";
import { translationGetByLanguageIdValidator } from "./validators";

export const getByLanguageId = zQuery({
  args: translationGetByLanguageIdValidator,
  handler: async (ctx, args) => {
    const query = ctx.db
      .query("translations")
      .withIndex("by_lang_ns_key", (q) => {
        if (args.namespace) {
          return q.eq("languageId", args.languageId).eq("namespace", args.namespace);
        }
        return q.eq("languageId", args.languageId);
      });

    return await query.collect();
  },
});

export const list = zQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("translations").collect();
  },
});
