import { z } from 'zod';
import type { Doc } from '../_generated/dataModel';
import type { QueryCtx } from '../_generated/server';
import { zAdminQuery, zQuery } from '../zod';
import {
  courseBySlugValidator,
  courseListPublishedValidator,
} from '@shared/validators/courses';
import { normalizeModuleLessons } from '@shared/validators/modules';

export const listPublished = zQuery({
  args: courseListPublishedValidator,
  handler: async (ctx, args) => {
    const courses = await ctx.db.query('courses').collect();
    const published = courses.filter(
      (course) =>
        course.status !== 'draft' &&
        course.status !== 'archived' &&
        (!args.format || course.format === args.format),
    );
    return await Promise.all(published.map((course) => getCourse(ctx, course)));
  },
});

export const getPublishedBySlug = zQuery({
  args: courseBySlugValidator,
  handler: async (ctx, args) => {
    const course = await ctx.db
      .query('courses')
      .withIndex('by_slug', (query) => query.eq('slug', args.slug))
      .unique();

    if (!course || course.status === 'draft' || course.status === 'archived') return null;
    return await getCourse(ctx, course);
  },
});

export const list = zAdminQuery({
  args: {},
  handler: async (ctx) => {
    const courses = await ctx.db.query('courses').collect();
    return await Promise.all(courses.map((course) => getCourse(ctx, course)));
  },
});

export const getAdminById = zAdminQuery({
  args: z.object({ id: z.string() }),
  handler: async (ctx, args) => {
    const id = ctx.db.normalizeId('courses', args.id);
    if (!id) return null;
    const course = await ctx.db.get(id);
    if (!course) return null;
    const [schedules, modules] = await Promise.all([
      ctx.db
        .query('schedules')
        .withIndex('by_course', (query) => query.eq('courseId', id))
        .collect(),
      ctx.db.query('modules').withIndex('by_course', (query) => query.eq('courseId', id)).collect(),
    ]);
    return { course, schedules, modules };
  },
});

async function getCourse(ctx: QueryCtx, course: Doc<'courses'>) {
  const [teacher, modules, schedules] = await Promise.all([
    ctx.db.get(course.teacherId),
    ctx.db.query('modules').withIndex('by_course', (query) => query.eq('courseId', course._id)).collect(),
    ctx.db.query('schedules').withIndex('by_course', (query) => query.eq('courseId', course._id)).collect(),
  ]);
  return {
    ...course,
    pricing: {
      live: course.pricing.live && { amountMinor: course.pricing.live.amountMinor ?? Math.round((course.pricing.live.amount ?? 0) * 100), currency: 'ARS' as const },
      recorded: course.pricing.recorded && { amountMinor: course.pricing.recorded.amountMinor ?? Math.round((course.pricing.recorded.amount ?? 0) * 100), currency: 'ARS' as const },
    },
    teacher: teacher?.status === 'archived' ? null : teacher,
    mentor: teacher?.status === 'archived' ? null : teacher,
    modules: modules.map((module) => ({
      _id: module._id,
      title: module.title,
      order: module.order ?? 0,
      lessons: normalizeModuleLessons(module),
    })).sort((left, right) => left.order - right.order),
    schedules: schedules.filter((schedule) => !schedule.isArchived),
  };
}

