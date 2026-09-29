import { zQuery } from "../zod";
import { zid } from "convex-helpers/server/zod4";
import { z } from "zod";

export const getByLanguageId = zQuery({
  args: {
    languageId: zid("languages"),
    namespace: z.string().optional(),
  },
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
