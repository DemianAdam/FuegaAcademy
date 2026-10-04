import { zStudentMutation } from "../zod";
import { enrollInCourseValidator } from "./validators";

export const enrollInCourse = zStudentMutation({
  args: enrollInCourseValidator,
  handler: async (ctx, args) => {
    const userId = ctx.userId;

    const existing = await ctx.db
      .query("enrollments")
      .withIndex("by_user_course", (q) => q.eq("userId", userId).eq("courseId", args.courseId))
      .unique();

    if (existing) {
      return existing._id;
    }

    if (args.scheduleId) {
      const schedule = await ctx.db.get(args.scheduleId);
      if (schedule) {
        await ctx.db.patch(args.scheduleId, {
          enrolledCount: schedule.enrolledCount + 1,
        });
      }
    }

    return await ctx.db.insert("enrollments", {
      userId,
      courseId: args.courseId,
      scheduleId: args.scheduleId,
      completedClasses: 0,
    });
  },
});
