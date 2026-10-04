import { internalMutation } from "../_generated/server";
import { courses as mockCourses } from "../../src/data/courses";

export const seedCourses = internalMutation({
  args: {},
  handler: async (ctx) => {
    let count = 0;

    for (const mockCourse of mockCourses) {
      const teacher = await ctx.db
        .query("teachers")
        .withIndex("by_slug", (q) => q.eq("slug", mockCourse.mentor.name.toLowerCase().replace(/\s+/g, "-")))
        .unique();

      const fallbackTeacher = teacher || (await ctx.db.query("teachers").first());

      if (!fallbackTeacher) {
        console.warn(`No teacher found for course ${mockCourse.id}`);
        continue;
      }

      const courseData = {
        slug: mockCourse.id,
        title: mockCourse.title,
        description: mockCourse.description,
        imageUrl: mockCourse.imageUrl,
        polaroidImage: mockCourse.polaroidImage,
        polaroidCaption: mockCourse.polaroidCaption,
        badge: mockCourse.badge,
        duration: mockCourse.duration,
        format: "hybrid" as const,
        teacherId: fallbackTeacher._id,
        achievements: mockCourse.achievements.map((a) => ({
          icon: a.icon,
          text: a.text,
          isHighlighted: a.bold,
        })),
        pricing: {
          live: { amount: 10000000, currency: "ars" },
          recorded: { amount: 8000000, currency: "ars" },
        },
      };

      let courseId;
      const existing = await ctx.db
        .query("courses")
        .withIndex("by_slug", (q) => q.eq("slug", courseData.slug))
        .unique();

      if (existing) {
        await ctx.db.patch(existing._id, courseData);
        courseId = existing._id;
      } else {
        courseId = await ctx.db.insert("courses", courseData);
      }

      // Sync modules
      const existingModules = await ctx.db
        .query("modules")
        .withIndex("by_course", (q) => q.eq("courseId", courseId))
        .collect();
      for (const m of existingModules) {
        await ctx.db.delete(m._id);
      }
      for (const mod of mockCourse.modules) {
        await ctx.db.insert("modules", {
          courseId,
          title: mod.title,
          items: mod.items,
        });
      }

      // Sync schedules
      const existingSchedules = await ctx.db
        .query("schedules")
        .withIndex("by_course", (q) => q.eq("courseId", courseId))
        .collect();
      for (const s of existingSchedules) {
        await ctx.db.delete(s._id);
      }
      const dayMap: Record<string, number> = {
        lunes: 1,
        martes: 2,
        miércoles: 3,
        miercoles: 3,
        jueves: 4,
        viernes: 5,
        sábado: 6,
        sabado: 6,
        domingo: 7,
      };
      for (const sched of mockCourse.schedules) {
        await ctx.db.insert("schedules", {
          courseId,
          name: sched.name,
          sessions: sched.sessions.map((s) => ({
            ...s,
            day: typeof s.day === "number" ? s.day : (dayMap[s.day.toLowerCase()] || 1),
          })),
          capacity: sched.capacity,
          enrolledCount: sched.enrolledCount,
        });
      }

      count++;
    }

    return { success: true, count };
  },
});
