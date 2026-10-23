import { zStudentQuery } from "../zod";
import { z } from 'zod';

export const listMyEnrollments = zStudentQuery({
  args: z.object({}),
  handler: async (ctx) => {
    const userId = ctx.userId;

    const enrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_user_course", (q) => q.eq("userId", userId))
      .collect();

    return await Promise.all(
      enrollments.map(async (enrollment) => {
        const [course, schedule] = await Promise.all([
          ctx.db.get(enrollment.courseId),
          enrollment.scheduleId ? ctx.db.get(enrollment.scheduleId) : Promise.resolve(null),
        ]);

        const totalClasses = course?.duration || 1;
        const progressPercent = Math.min(100, Math.round((enrollment.completedClasses / totalClasses) * 100));

        return {
          ...enrollment,
          course: course ? {
            ...course,
            imageUrl: course.image?.kind === 'external'
              ? course.image.url
              : course.image?.kind === 'storage'
                ? (await ctx.storage.getUrl(course.image.storageId)) ?? course.imageUrl ?? ''
                : course.imageUrl ?? '',
          } : null,
          schedule,
          progressPercent,
          totalClasses,
        };
      })
    );
  },
});
