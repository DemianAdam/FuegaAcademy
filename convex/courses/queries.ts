import { z } from "zod";
import type { Doc } from "../_generated/dataModel";
import type { QueryCtx } from "../_generated/server";
import { zAdminQuery, zQuery } from "../zod";
import {
  courseBySlugValidator,
  courseListPublishedValidator,
} from "@shared/validators/courses";
import { normalizeModuleLessons } from "@shared/validators/modules";
import { normalizeCoursePricing } from "@shared/courseCommerce";

export const listPublished = zQuery({
  args: courseListPublishedValidator,
  handler: async (ctx, args) => {
    const courses = await ctx.db.query("courses").collect();
    const published = courses.filter(
      (course) =>
        course.status === "published" &&
        (!args.format || course.format === args.format),
    );
    return await Promise.all(published.map((course) => getCourse(ctx, course)));
  },
});

export const getPublishedBySlug = zQuery({
  args: courseBySlugValidator,
  handler: async (ctx, args) => {
    const course = await ctx.db
      .query("courses")
      .withIndex("by_slug", (query) => query.eq("slug", args.slug))
      .unique();

    if (!course || course.status !== "published") return null;
    return await getCourse(ctx, course);
  },
});

export const list = zAdminQuery({
  args: {},
  handler: async (ctx) => {
    const courses = await ctx.db.query("courses").collect();
    return await Promise.all(courses.map((course) => getCourse(ctx, course)));
  },
});

export const getAdminById = zAdminQuery({
  args: z.object({ id: z.string() }),
  handler: async (ctx, args) => {
    const id = ctx.db.normalizeId("courses", args.id);
    if (!id) return null;
    const course = await ctx.db.get(id);
    if (!course) return null;
    const [schedules, modules] = await Promise.all([
      ctx.db
        .query("schedules")
        .withIndex("by_course", (query) => query.eq("courseId", id))
        .collect(),
      ctx.db
        .query("modules")
        .withIndex("by_course", (query) => query.eq("courseId", id))
        .collect(),
    ]);
    return {
      course: {
        ...course,
        imageUrl: await imageUrl(ctx, course.image, course.imageUrl),
        polaroidImage: await imageUrl(
          ctx,
          course.polaroid,
          course.polaroidImage,
        ),
      },
      schedules,
      modules,
    };
  },
});

async function getCourse(ctx: QueryCtx, course: Doc<"courses">) {
  const [teacher, modules, schedules] = await Promise.all([
    ctx.db.get(course.teacherId),
    ctx.db
      .query("modules")
      .withIndex("by_course", (query) => query.eq("courseId", course._id))
      .collect(),
    ctx.db
      .query("schedules")
      .withIndex("by_course", (query) => query.eq("courseId", course._id))
      .collect(),
  ]);
  const purchaseEnabled = !!(await ctx.db
    .query("exams")
    .withIndex("by_course", (q) => q.eq("courseId", course._id))
    .filter((q) => q.eq(q.field("published"), true))
    .first());
  const holds = (
    await ctx.db
      .query("orders")
      .withIndex("by_course", (q) => q.eq("courseId", course._id))
      .collect()
  ).filter(
    (o) =>
      o.status === "pending" &&
      !o.superseded &&
      o.checkoutState !== "closed" &&
      (o.expiresAt ?? 0) > Date.now(),
  );
  return {
    ...course,
    purchaseEnabled,
    imageUrl: await imageUrl(ctx, course.image, course.imageUrl),
    polaroidImage: await imageUrl(ctx, course.polaroid, course.polaroidImage),
    pricing: normalizeCoursePricing(course.format, {
      live: course.pricing.live && {
        amountMinor: course.pricing.live.amountMinor,
        currency: "ARS" as const,
      },
      recorded: course.pricing.recorded && {
        amountMinor: course.pricing.recorded.amountMinor,
        currency: "ARS" as const,
      },
    }),
    teacher:
      teacher?.status === "archived"
        ? null
        : teacher
          ? await teacherWithImage(ctx, teacher)
          : null,
    mentor:
      teacher?.status === "archived"
        ? null
        : teacher
          ? await teacherWithImage(ctx, teacher)
          : null,
    modules: modules
      .map((module) => ({
        _id: module._id,
        title: module.title,
        order: module.order ?? 0,
        lessons: normalizeModuleLessons(module),
      }))
      .sort((left, right) => left.order - right.order),
    schedules:
      course.format === "recorded"
        ? []
        : schedules
            .filter((schedule) => !schedule.isArchived)
            .map((schedule) => ({
              ...schedule,
              enrolledCount:
                schedule.enrolledCount +
                holds.filter((o) => o.scheduleId === schedule._id).length,
            })),
  };
}

async function teacherWithImage(ctx: QueryCtx, teacher: Doc<"teachers">) {
  const imageUrl =
    teacher.image?.kind === "external"
      ? teacher.image.url
      : teacher.image?.kind === "storage"
        ? ((await ctx.storage.getUrl(teacher.image.storageId)) ??
          teacher.imageUrl ??
          "")
        : (teacher.imageUrl ?? "");
  return { ...teacher, imageUrl };
}

async function imageUrl(
  ctx: QueryCtx,
  source: Doc<"courses">["image"] | undefined,
  legacyUrl: string | undefined,
) {
  if (source?.kind === "external") return source.url;
  if (source?.kind === "storage")
    return (await ctx.storage.getUrl(source.storageId)) ?? legacyUrl ?? "";
  return legacyUrl ?? "";
}
