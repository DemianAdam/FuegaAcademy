import { zAdminMutation } from "../zod";
import { courseCreateInputValidator, courseUpdateValidator, courseRemoveValidator } from "@shared/validators/courses";

export const create = zAdminMutation({
  args: courseCreateInputValidator,
  handler: async (ctx, args) => {
    const { schedules, ...courseData } = args;
    const existing = await ctx.db
      .query("courses")
      .withIndex("by_slug", (q) => q.eq("slug", courseData.slug))
      .unique();

    let courseId;
    if (existing) {
      await ctx.db.patch(existing._id, courseData);
      courseId = existing._id;
    } else {
      courseId = await ctx.db.insert("courses", courseData);
    }

    if (schedules) {
      const existingSchedules = await ctx.db
        .query("schedules")
        .withIndex("by_course", (q) => q.eq("courseId", courseId))
        .collect();
      for (const s of existingSchedules) {
        await ctx.db.delete(s._id);
      }

      for (const sched of schedules) {
        await ctx.db.insert("schedules", {
          courseId,
          name: sched.name,
          capacity: sched.capacity,
          enrolledCount: 0,
          sessions: sched.sessions,
        });
      }
    }

    return courseId;
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
    const { schedules, ...courseData } = patch;
    await ctx.db.patch(id, courseData);

    if (schedules) {
      const existingSchedules = await ctx.db
        .query("schedules")
        .withIndex("by_course", (q) => q.eq("courseId", id))
        .collect();
        
      for (const s of existingSchedules) {
        await ctx.db.delete(s._id);
      }

      for (const sched of schedules) {
        await ctx.db.insert("schedules", {
          courseId: id,
          name: sched.name,
          capacity: sched.capacity,
          enrolledCount: 0,
          sessions: sched.sessions
        });
      }
    }

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
