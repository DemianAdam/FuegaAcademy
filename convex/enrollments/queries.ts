import { zStudentQuery } from "../zod";

export const listMyEnrollments = zStudentQuery({
  args: {},
  handler: async (ctx) => {
    const userId = ctx.userId;

    const enrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return await Promise.all(
      enrollments.map(async (enrollment) => {
        const [course, schedule] = await Promise.all([
          ctx.db.get(enrollment.courseId),
          enrollment.scheduleId ? ctx.db.get(enrollment.scheduleId) : Promise.resolve(null),
        ]);

        const teacher = course ? await ctx.db.get(course.teacherId) : null;

        const totalClasses = course?.duration || 1;
        const progressPercent = Math.min(100, Math.round((enrollment.completedClasses / totalClasses) * 100));

        return {
          ...enrollment,
          course: course ? { ...course, teacher, mentor: teacher } : null,
          schedule,
          progressPercent,
          totalClasses,
        };
      })
    );
  },
});
