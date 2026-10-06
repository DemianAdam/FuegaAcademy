import { zAdminMutation } from "../zod";
import { teacherValidator, teacherUpdateValidator, teacherRemoveValidator } from "./validators";

export const create = zAdminMutation({
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

export const update = zAdminMutation({
  args: teacherUpdateValidator,
  handler: async (ctx, args) => {
    const { id, patch } = args;
    const teacher = await ctx.db.get(id);
    if (!teacher) {
      throw new Error("Teacher not found");
    }
    await ctx.db.patch(id, patch);
    return id;
  },
});

export const remove = zAdminMutation({
  args: teacherRemoveValidator,
  handler: async (ctx, args) => {
    const { id } = args;
    const teacher = await ctx.db.get(id);
    if (!teacher) {
      throw new Error("Teacher not found");
    }
    await ctx.db.delete(id);
    return id;
  },
});