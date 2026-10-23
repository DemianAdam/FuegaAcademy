import { internalMutation } from '../_generated/server';

/**
 * One-time cleanup to run before deploying the published-only course schema.
 * Draft courses are intentionally irreversible data cleanup; published and
 * archived courses are left untouched.
 */
export const deleteDraftCourses = internalMutation({
  args: {},
  handler: async (ctx) => {
    const courses = await ctx.db.query('courses').collect();
    let deletedCourses = 0;
    let deletedModules = 0;
    let deletedSchedules = 0;

    for (const course of courses) {
      if ((course.status as string) !== 'draft') continue;

      const [modules, schedules] = await Promise.all([
        ctx.db.query('modules').withIndex('by_course', (query) => query.eq('courseId', course._id)).collect(),
        ctx.db.query('schedules').withIndex('by_course', (query) => query.eq('courseId', course._id)).collect(),
      ]);

      for (const module of modules) {
        await ctx.db.delete(module._id);
        deletedModules += 1;
      }
      for (const schedule of schedules) {
        await ctx.db.delete(schedule._id);
        deletedSchedules += 1;
      }
      await ctx.db.delete(course._id);
      deletedCourses += 1;
    }

    return { deletedCourses, deletedModules, deletedSchedules };
  },
});
