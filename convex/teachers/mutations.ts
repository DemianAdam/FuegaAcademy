import { ConvexError } from 'convex/values';
import { zAdminMutation } from '../zod';
import { teacherInsertValidator, teacherRemoveValidator, teacherUpdateValidator } from './validators';

function slugify(text: string) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}

export const create = zAdminMutation({
  args: teacherInsertValidator,
  handler: async (ctx, args) => {
    const slug = slugify(args.name);
    const existing = await ctx.db.query('teachers').withIndex('by_slug', (query) => query.eq('slug', slug)).unique();
    if (existing) throw new ConvexError({ code: 'TEACHER_SLUG_EXISTS', message: 'This instructor name is already in use.' });
    return await ctx.db.insert('teachers', { ...args, slug, status: args.status ?? 'published' });
  },
});

export const update = zAdminMutation({
  args: teacherUpdateValidator,
  handler: async (ctx, args) => {
    const teacher = await ctx.db.get(args.id);
    if (!teacher) throw new ConvexError({ code: 'TEACHER_NOT_FOUND', message: 'Teacher not found.' });
    const slug = args.patch.name ? slugify(args.patch.name) : undefined;
    if (slug && slug !== teacher.slug) {
      const existing = await ctx.db.query('teachers').withIndex('by_slug', (query) => query.eq('slug', slug)).unique();
      if (existing && existing._id !== args.id) throw new ConvexError({ code: 'TEACHER_SLUG_EXISTS', message: 'This instructor name is already in use.' });
    }
    await ctx.db.patch(args.id, { ...args.patch, ...(slug ? { slug } : {}) });
    return args.id;
  },
});

export const remove = zAdminMutation({
  args: teacherRemoveValidator,
  handler: async (ctx, args) => {
    const teacher = await ctx.db.get(args.id);
    if (!teacher) throw new ConvexError({ code: 'TEACHER_NOT_FOUND', message: 'Teacher not found.' });
    await ctx.db.patch(args.id, { status: 'archived' });
    return args.id;
  },
});
