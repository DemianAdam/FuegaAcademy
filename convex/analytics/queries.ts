import { zAdminQuery } from "../zod";

export const getDashboardStats = zAdminQuery({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const courses = await ctx.db.query("courses").collect();
    const teachers = await ctx.db.query("teachers").collect();
    const enrollments = await ctx.db.query("enrollments").collect();
    const approvedOrders = await ctx.db
      .query("orders")
      .withIndex("by_status", (query) => query.eq("status", "approved"))
      .collect();

    const totalUsers = users.length;
    const adminCount = users.filter((u) => u.role === "admin").length;
    const studentCount = totalUsers - adminCount;

    const totalCourses = courses.length;
    const liveCourses = courses.filter((c) => c.format === "live").length;
    const recordedCourses = courses.filter(
      (c) => c.format === "recorded",
    ).length;
    const hybridCourses = courses.filter((c) => c.format === "hybrid").length;

    const totalTeachers = teachers.length;
    const totalEnrollments = enrollments.length;

    const estimatedRevenueMinor = approvedOrders.reduce(
      (total, order) => total + order.amountMinor,
      0,
    );

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
        estimatedRevenueMinor,
      },
    };
  },
});
