import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';
import { zAdminMutation } from '../zod';
import { courseCreateInputValidator, courseRemoveValidator, courseUpdateValidator, type CourseCreateInput } from '@shared/validators/courses';
import type { ScheduleEditorInput } from '@shared/validators/schedules';
import { slugifyCourseTitle } from '@shared/courseSlug';
import type { ModuleEditorInput } from '@shared/validators/modules';

async function syncSchedules(ctx: MutationCtx, courseId: Id<'courses'>, schedules: ScheduleEditorInput[]) {
  const existing = await ctx.db.query('schedules').withIndex('by_course', (query) => query.eq('courseId', courseId)).collect();
  const retained = new Set<Id<'schedules'>>();
  for (const schedule of schedules) {
    if (schedule.id) {
      const current = await ctx.db.get(schedule.id);
      if (!current || current.courseId !== courseId) throw new ConvexError({ code: 'INVALID_SCHEDULE', message: 'Schedule does not belong to this course.' });
      if (schedule.capacity < current.enrolledCount) throw new ConvexError({ code: 'CAPACITY_BELOW_ENROLLMENT', message: 'Capacity cannot be lower than the current enrollment count.' });
      await ctx.db.patch(schedule.id, { name: schedule.name, sessions: schedule.sessions, capacity: schedule.capacity, isArchived: false });
      retained.add(schedule.id);
    } else {
      retained.add(await ctx.db.insert('schedules', { courseId, name: schedule.name, sessions: schedule.sessions, capacity: schedule.capacity, enrolledCount: 0, isArchived: false }));
    }
  }
  for (const schedule of existing) if (!retained.has(schedule._id) && !schedule.isArchived) await ctx.db.patch(schedule._id, { isArchived: true });
}

async function syncModules(ctx: MutationCtx, courseId: Id<'courses'>, modules: ModuleEditorInput[]) {
  const existing = await ctx.db.query('modules').withIndex('by_course', (query) => query.eq('courseId', courseId)).collect();
  const retained = new Set<Id<'modules'>>();

  for (const [order, module] of modules.entries()) {
    const data = {
      title: module.title,
      order,
      lessons: module.lessons,
      items: module.lessons.map((lesson) => lesson.title),
    };
    if (module.id) {
      const current = await ctx.db.get(module.id);
      if (!current || current.courseId !== courseId) throw new ConvexError({ code: 'INVALID_MODULE', message: 'Module does not belong to this course.' });
      await ctx.db.patch(module.id, data);
      retained.add(module.id);
    } else {
      retained.add(await ctx.db.insert('modules', { courseId, ...data }));
    }
  }

  for (const module of existing) if (!retained.has(module._id)) await ctx.db.delete(module._id);
}

async function uniqueSlug(ctx: MutationCtx, title: string, currentId?: Id<'courses'>) {
  const base = slugifyCourseTitle(title);
  let candidate = base;
  let suffix = 2;
  while (true) {
    const existing = await ctx.db.query('courses').withIndex('by_slug', (query) => query.eq('slug', candidate)).unique();
    if (!existing || existing._id === currentId) return candidate;
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}

function courseData(args: CourseCreateInput, slug: string) {
  return { slug, title: args.title, description: args.description, imageUrl: args.imageUrl, polaroidImage: args.polaroidImage, polaroidCaption: args.polaroidCaption, badge: args.badge, duration: args.duration, format: args.format, teacherId: args.teacherId, achievements: args.achievements, pricing: args.pricing, status: args.status ?? ('published' as const) };
}

export const create = zAdminMutation({
  args: courseCreateInputValidator,
  handler: async (ctx, args) => {
    const { modules, ...course } = args;
    const courseId = await ctx.db.insert('courses', courseData(course, await uniqueSlug(ctx, args.title)));
    if (args.schedules) await syncSchedules(ctx, courseId, args.schedules);
    if (modules) await syncModules(ctx, courseId, modules);
    return courseId;
  },
});

export const update = zAdminMutation({
  args: courseUpdateValidator,
  handler: async (ctx, args) => {
    const course = await ctx.db.get(args.id);
    if (!course) throw new ConvexError({ code: 'COURSE_NOT_FOUND', message: 'Course not found.' });
    const { schedules, modules, ...patch } = args.patch;
    const slug = patch.title ? await uniqueSlug(ctx, patch.title, args.id) : undefined;
    await ctx.db.patch(args.id, { ...patch, ...(slug ? { slug } : {}) });
    if (schedules) await syncSchedules(ctx, args.id, schedules);
    if (modules) await syncModules(ctx, args.id, modules);
    return args.id;
  },
});

export const remove = zAdminMutation({
  args: courseRemoveValidator,
  handler: async (ctx, args) => {
    const course = await ctx.db.get(args.id);
    if (!course) throw new ConvexError({ code: 'COURSE_NOT_FOUND', message: 'Course not found.' });
    await ctx.db.patch(args.id, { status: 'archived' });
    const schedules = await ctx.db.query('schedules').withIndex('by_course', (query) => query.eq('courseId', args.id)).collect();
    for (const schedule of schedules) await ctx.db.patch(schedule._id, { isArchived: true });
    return args.id;
  },
});
