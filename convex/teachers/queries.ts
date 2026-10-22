import { z } from 'zod';
import { zAdminQuery, zQuery } from '../zod';
import { teacherBySlugValidator } from './validators';

export const listPublished = zQuery({
  args: z.object({}),
  handler: async (ctx) => {
    const teachers = await ctx.db.query('teachers').collect();
    const published = teachers.filter(
      (teacher) => teacher.status !== 'draft' && teacher.status !== 'archived',
    );
    return published;
  },
});

export const getPublishedBySlug = zQuery({
  args: teacherBySlugValidator,
  handler: async (ctx, args) => {
    const teacher = await ctx.db.query('teachers').withIndex('by_slug', (query) => query.eq('slug', args.slug)).unique();
    return teacher?.status === 'draft' || teacher?.status === 'archived' ? null : teacher;
  },
});

export const list = zAdminQuery({
  args: {},
  handler: async (ctx) => {
    const teachers = await ctx.db.query('teachers').collect();
    return teachers;
  },
});

export const getAdminById = zAdminQuery({
  args: z.object({ id: z.string() }),
  handler: async (ctx, args) => {
    const id = ctx.db.normalizeId('teachers', args.id);
    if (!id) return null;
    const teacher = await ctx.db.get(id);
    if (!teacher) return null;
    return { teacher };
  },
});

