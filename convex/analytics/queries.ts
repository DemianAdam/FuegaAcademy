import { zAdminQuery } from "../zod";

export const getDashboardStats = zAdminQuery({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const courses = await ctx.db.query("courses").collect();
    const teachers = await ctx.db.query("teachers").collect();
    const enrollments = await ctx.db.query("enrollments").collect();
    const missingLanguages = await ctx.db.query("missingLanguages").collect();

    const totalUsers = users.length;
    const adminCount = users.filter((u) => u.role === "admin").length;
    const studentCount = totalUsers - adminCount;

    const totalCourses = courses.length;
    const liveCourses = courses.filter((c) => c.format === "live").length;
    const recordedCourses = courses.filter((c) => c.format === "recorded").length;
    const hybridCourses = courses.filter((c) => c.format === "hybrid").length;

    const totalTeachers = teachers.length;
    const totalEnrollments = enrollments.length;

    // Calculate approximate MRR / revenue from pricing tiers if available
    let estimatedRevenue = 0;
    for (const enrollment of enrollments) {
      // Find course
      const course = courses.find((c) => c._id === enrollment.courseId);
      if (course && course.pricing) {
        const pricing = course.pricing;
        // Check if live or recorded
        const amount = pricing.live?.amount || pricing.recorded?.amount || 0;
        estimatedRevenue += amount;
      }
    }

    return {
      users: {
        total: totalUsers,
        admins: adminCount,
        students: studentCount,
      },
      courses: {
        total: totalCourses,
        live: liveCourses,
        recorded: recordedCourses,
        hybrid: hybridCourses,
      },
      teachers: {
        total: totalTeachers,
      },
      enrollments: {
        total: totalEnrollments,
      },
      financials: {
        estimatedRevenue,
      },
      missingLanguagesCount: missingLanguages.length,
    };
  },
});
