import { internalMutation } from "../_generated/server";

const courses = [
  {
    slug: "ugc-creator",
    title: "UGC Content Creator",
    description:
      "Build an authentic content portfolio and learn to work independently with global brands.",
    teacherSlug: "yago-balbi",
    imageUrl:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80",
    polaroidImage:
      "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80",
    polaroidCaption: "Your next creative brief.",
    duration: 18,
    achievements: [
      {
        icon: "video_camera_front",
        text: "Produce a professional UGC portfolio",
        isHighlighted: true,
      },
    ],
    modules: [
      {
        title: "UGC foundations",
        items: ["Audience and positioning", "Creative briefs"],
      },
      {
        title: "Production workflow",
        items: ["Scripting", "Shooting and editing"],
      },
    ],
  },
  {
    slug: "paid-media",
    title: "Paid Media Strategy",
    description:
      "Plan, launch, and improve measurable paid-media campaigns with a practical framework.",
    teacherSlug: "magali-valles",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    polaroidImage:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    polaroidCaption: "Make every campaign measurable.",
    duration: 16,
    achievements: [
      {
        icon: "monitoring",
        text: "Launch a complete acquisition campaign",
        isHighlighted: true,
      },
    ],
    modules: [
      {
        title: "Campaign strategy",
        items: ["Objectives", "Audiences and offers"],
      },
      {
        title: "Measurement",
        items: ["Attribution basics", "Optimization loops"],
      },
    ],
  },
] as const;

export const seedCourses = internalMutation({
  args: {},
  handler: async (ctx) => {
    let count = 0;
    for (const fixture of courses) {
      const teacher = await ctx.db
        .query("teachers")
        .withIndex("by_slug", (query) => query.eq("slug", fixture.teacherSlug))
        .unique();
      if (!teacher) continue;
      const value = {
        slug: fixture.slug,
        title: fixture.title,
        description: fixture.description,
        imageUrl: fixture.imageUrl,
        polaroidImage: fixture.polaroidImage,
        polaroidCaption: fixture.polaroidCaption,
        badge: "popular",
        duration: fixture.duration,
        format: "hybrid" as const,
        teacherId: teacher._id,
        achievements: fixture.achievements.map((achievement) => ({
          ...achievement,
        })),
        pricing: {
          live: { amountMinor: 10000000, currency: "ARS" as const },
          recorded: { amountMinor: 8000000, currency: "ARS" as const },
        },
        status: "published" as const,
      };
      const course = await ctx.db
        .query("courses")
        .withIndex("by_slug", (query) => query.eq("slug", fixture.slug))
        .unique();
      const courseId = course?._id ?? (await ctx.db.insert("courses", value));
      if (course) await ctx.db.patch(courseId, value);
      const existingModules = await ctx.db
        .query("modules")
        .withIndex("by_course", (query) => query.eq("courseId", courseId))
        .collect();
      for (const [order, module] of fixture.modules.entries()) {
        const existing = existingModules.find((item) => item.order === order);
        const moduleValue = {
          courseId,
          order,
          title: module.title,
          lessons: module.items.map((title, index) => ({
            id: `${fixture.slug}-${order}-${index}`,
            title,
            description: "",
            durationMinutes: 30,
          })),
        };
        if (existing) await ctx.db.patch(existing._id, moduleValue);
        else await ctx.db.insert("modules", moduleValue);
      }
      if (
        !(await ctx.db
          .query("exams")
          .withIndex("by_course", (q) => q.eq("courseId", courseId))
          .first())
      )
        await ctx.db.insert("exams", {
          courseId,
          kind: "manual",
          instructions: "Entregá el proyecto final para evaluación.",
          passingPercent: 70,
          questions: [],
          version: 1,
          published: true,
        });
      if (
        !(await ctx.db
          .query("schedules")
          .withIndex("by_course", (q) => q.eq("courseId", courseId))
          .first())
      )
        await ctx.db.insert("schedules", {
          courseId,
          name: "Próxima cohorte",
          startsAt: Date.now() + 30 * 86400000,
          sessions: [],
          capacity: 30,
          enrolledCount: 0,
          isArchived: false,
        });
      count += 1;
    }
    return { success: true, count };
  },
});
