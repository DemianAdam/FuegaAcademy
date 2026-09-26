import { zMutation } from "../zod";
import { teacherValidator } from "./validators";

export const create = zMutation({
  args: teacherValidator,
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("teachers")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, args);
      return existing._id;
    }

    return await ctx.db.insert("teachers", args);
  },
});