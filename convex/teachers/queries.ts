import { z } from 'zod';
import type { Doc } from '../_generated/dataModel';
import type { QueryCtx } from '../_generated/server';
import { zAdminQuery, zQuery } from '../zod';
import { teacherBySlugValidator } from './validators';

export const listPublished = zQuery({
  args: z.object({}),
  handler: async (ctx) => {
    const teachers = await ctx.db.query('teachers').collect();
    const published = teachers.filter(
      (teacher) => teacher.status !== 'draft' && teacher.status !== 'archived',
    );
    return await Promise.all(published.map((teacher) => teacherWithImage(ctx, teacher)));
  },
});

export const getPublishedBySlug = zQuery({
  args: teacherBySlugValidator,
  handler: async (ctx, args) => {
    const teacher = await ctx.db.query('teachers').withIndex('by_slug', (query) => query.eq('slug', args.slug)).unique();
    if (!teacher || teacher.status === 'draft' || teacher.status === 'archived') return null;
    return await teacherWithImage(ctx, teacher);
  },
});

export const list = zAdminQuery({
  args: {},
  handler: async (ctx) => {
    const teachers = await ctx.db.query('teachers').collect();
    return await Promise.all(teachers.map((teacher) => teacherWithImage(ctx, teacher)));
  },
});

export const getAdminById = zAdminQuery({
  args: z.object({ id: z.string() }),
  handler: async (ctx, args) => {
    const id = ctx.db.normalizeId('teachers', args.id);
    if (!id) return null;
    const teacher = await ctx.db.get(id);
    if (!teacher) return null;
    return { teacher: await teacherWithImage(ctx, teacher) };
  },
});

async function teacherWithImage(ctx: QueryCtx, teacher: Doc<'teachers'>) {
  const imageUrl = teacher.image?.kind === 'external'
    ? teacher.image.url
    : teacher.image?.kind === 'storage'
      ? (await ctx.storage.getUrl(teacher.image.storageId)) ?? teacher.imageUrl ?? ''
      : teacher.imageUrl ?? '';
  return { ...teacher, imageUrl };
}

