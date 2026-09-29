import { zQuery } from "../zod";

export const list = zQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("languages").collect();
  },
});

export const listActive = zQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("languages")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
  },
});
