import { zQuery } from "../zod";
import { CourseWithRelations, courseBySlugValidator } from "@shared/validators/courses";

export const list = zQuery({
  args: {},
  handler: async (ctx): Promise<CourseWithRelations[]> => {
    const courses = await ctx.db.query("courses").collect();

    return await Promise.all(
      courses.map(async (course) => {
        const [teacher, modules, schedules] = await Promise.all([
          ctx.db.get(course.teacherId),
          ctx.db
            .query("modules")
            .withIndex("by_course", (q) => q.eq("courseId", course._id))
            .collect(),
          ctx.db
            .query("schedules")
            .withIndex("by_course", (q) => q.eq("courseId", course._id))
            .collect(),
        ]);
        return {
          ...course,
          teacher,
          mentor: teacher,
          modules,
          schedules,
        };
      })
    );
  },
});

export const getBySlug = zQuery({
  args: courseBySlugValidator,
  handler: async (ctx, args): Promise<CourseWithRelations | null> => {
    const course = await ctx.db
      .query("courses")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!course) {
      return null;
    }

    const [teacher, modules, schedules] = await Promise.all([
      ctx.db.get(course.teacherId),
      ctx.db
        .query("modules")
        .withIndex("by_course", (q) => q.eq("courseId", course._id))
        .collect(),
      ctx.db
        .query("schedules")
        .withIndex("by_course", (q) => q.eq("courseId", course._id))
        .collect(),
    ]);

    return {
      ...course,
      teacher,
      mentor: teacher,
      modules,
      schedules,
    };
  },
});
