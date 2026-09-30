import { zQuery } from "../zod";
import { teacherBySlugValidator } from "./validators";

export const list = zQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("teachers").collect();
  },
});

export const getBySlug = zQuery({
  args: teacherBySlugValidator,
  handler: async (ctx, args) => {
    return await ctx.db
      .query("teachers")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});
