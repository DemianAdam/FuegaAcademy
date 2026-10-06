import { zAdminMutation } from "../zod";
import { courseInsertValidator, courseUpdateValidator, courseRemoveValidator } from "@shared/validators/courses";

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

export const update = zAdminMutation({
  args: courseUpdateValidator,
  handler: async (ctx, args) => {
    const { id, patch } = args;
    const course = await ctx.db.get(id);
    if (!course) {
      throw new Error("Course not found");
    }
    await ctx.db.patch(id, patch);
    return id;
  },
});

export const remove = zAdminMutation({
  args: courseRemoveValidator,
  handler: async (ctx, args) => {
    const { id } = args;
    const course = await ctx.db.get(id);
    if (!course) {
      throw new Error("Course not found");
    }
    await ctx.db.delete(id);
    return id;
  },
});
