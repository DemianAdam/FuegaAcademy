import { zQuery } from "../zod";
import { teacherValidator } from "./validators";

export const list = zQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("teachers").collect();
  },
});

export const getBySlug = zQuery({
  args: { slug: teacherValidator.shape.slug },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("teachers")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});
