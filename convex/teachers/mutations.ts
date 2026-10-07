import { zAdminMutation } from "../zod";
import { teacherInsertValidator, teacherUpdateValidator, teacherRemoveValidator } from "./validators";
import type { TeacherDoc } from "./validators";

function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const create = zAdminMutation({
  args: teacherInsertValidator,
  handler: async (ctx, args) => {
    const slug = slugify(args.name);
    const existing = await ctx.db
      .query("teachers")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { ...args, slug });
      return existing._id;
    }

    return await ctx.db.insert("teachers", { ...args, slug });
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

    const updateData: Partial<TeacherDoc> = { ...patch };
    if (patch.name) {
      updateData.slug = slugify(patch.name);
    }

    await ctx.db.patch(id, updateData);
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