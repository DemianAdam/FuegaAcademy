import { zStudentQuery } from "../zod";
import { z } from "zod";

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
          enrollment.scheduleId
            ? ctx.db.get(enrollment.scheduleId)
            : Promise.resolve(null),
        ]);

        const modules = await ctx.db
          .query("modules")
          .withIndex("by_course", (q) => q.eq("courseId", enrollment.courseId))
          .collect();
        const totalClasses = Math.max(
          1,
          modules.reduce((n, m) => n + (m.lessons?.length ?? 0), 0),
        );
        const orders = await ctx.db
          .query("orders")
          .withIndex("by_user", (q) => q.eq("userId", userId))
          .collect();
        const payments = (
          await Promise.all(
            orders
              .filter((o) => o.courseId === enrollment.courseId)
              .map((o) =>
                ctx.db
                  .query("paymentAttempts")
                  .withIndex("by_order", (q) => q.eq("orderId", o._id))
                  .collect(),
              ),
          )
        ).flat();
        const progressPercent = Math.min(
          100,
          Math.round((enrollment.completedClasses / totalClasses) * 100),
        );

        return {
          ...enrollment,
          examHistory: await ctx.db
            .query("examAttempts")
            .withIndex("by_enrollment", (q) =>
              q.eq("enrollmentId", enrollment._id),
            )
            .collect(),
          canAccess: enrollment.status === "active",
          canPurchaseAgain:
            enrollment.status !== "active" &&
            !enrollments.some(
              (e) =>
                e.courseId === enrollment.courseId && e.status === "active",
            ) &&
            !payments.some((p) => p.exception),
          course: course
            ? {
                ...course,
                imageUrl:
                  course.image?.kind === "external"
                    ? course.image.url
                    : course.image?.kind === "storage"
                      ? ((await ctx.storage.getUrl(course.image.storageId)) ??
                        course.imageUrl ??
                        "")
                      : (course.imageUrl ?? ""),
              }
            : null,
          schedule,
          progressPercent,
          totalClasses,
        };
      }),
    );
  },
});
