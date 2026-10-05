import { zAdminMutation } from "../zod";
import { courseInsertValidator } from "@shared/validators/courses";

export const create = zAdminMutation({
  args: courseInsertValidator,
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("courses")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, args);
      return existing._id;
    }

    return await ctx.db.insert("courses", args);
  },
});
