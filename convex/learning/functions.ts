import { z } from "zod";
import { zid } from "convex-helpers/server/zod4";
import { ConvexError, v } from "convex/values";
import { internalQuery, internalMutation } from "../_generated/server";
import type { QueryCtx, MutationCtx } from "../_generated/server";
import type { Id } from "../_generated/dataModel";
import {
  zStudentQuery,
  zStudentMutation,
  zAdminMutation,
  zAdminQuery,
} from "../zod";
import { examInput, resourceValidator } from "@shared/validators/learning";
const denied = () => {
  throw new ConvexError({
    code: "FORBIDDEN",
    message: "No tenés acceso a este contenido.",
  });
};
async function active(
  ctx: QueryCtx,
  userId: Id<"users">,
  id: Id<"enrollments">,
) {
  const run = await ctx.db.get(id);
  if (!run || run.userId !== userId || run.status !== "active") return denied();
  return run;
}
const types = new Set([
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
export const publishExam = zAdminMutation({
  args: examInput,
  handler: async (ctx, args) => {
    if (!(await ctx.db.get(args.courseId))) return denied();
    if (
      args.kind === "quiz" &&
      (!args.questions.length ||
        new Set(args.questions.map((q) => q.id)).size !==
          args.questions.length ||
        args.questions.some((q) => q.correct >= q.options.length))
    )
      throw new ConvexError({
        code: "INVALID_EXAM",
        message: "Revisá las preguntas y respuestas.",
      });
    const exams = await ctx.db
      .query("exams")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .collect();
    return await ctx.db.insert("exams", {
      ...args,
      version: Math.max(0, ...exams.map((e) => e.version)) + 1,
      published: true,
    });
  },
});
export const adminCourse = zAdminQuery({
  args: z.object({ courseId: zid("courses") }),
  handler: async (ctx, args) => ({
    exams: await ctx.db
      .query("exams")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .collect(),
    resources: await ctx.db
      .query("courseResources")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .collect(),
  }),
});
export const classroom = zStudentQuery({
  args: z.object({ enrollmentId: zid("enrollments") }),
  handler: async (ctx, args) => {
    const run = await active(ctx, ctx.userId, args.enrollmentId);
    const course = await ctx.db.get(run.courseId);
    const exam = await ctx.db.get(run.examId);
    const resources = (
      await ctx.db
        .query("courseResources")
        .withIndex("by_course", (q) => q.eq("courseId", run.courseId))
        .collect()
    ).filter(
      (r) =>
        r.kind !== "live" ||
        (run.tier === "live" && r.scheduleId === run.scheduleId),
    );
    const attempts = await ctx.db
      .query("examAttempts")
      .withIndex("by_enrollment", (q) => q.eq("enrollmentId", run._id))
      .collect();
    const modules = await ctx.db
      .query("modules")
      .withIndex("by_course", (q) => q.eq("courseId", run.courseId))
      .collect();
    return {
      run,
      title: course?.title ?? "Curso",
      modules,
      resources: resources.map(
        ({ _id, title, kind, url, uploadId, lessonId }) => ({
          _id,
          title,
          kind,
          url,
          uploadId,
          lessonId,
        }),
      ),
      exam: exam
        ? {
            id: exam._id,
            kind: exam.kind,
            instructions: exam.instructions,
            passingPercent: exam.passingPercent,
            questions: exam.questions.map(({ id, prompt, options }) => ({
              id,
              prompt,
              options,
            })),
          }
        : null,
      attempts,
    };
  },
});
export const progress = zStudentMutation({
  args: z.object({
    enrollmentId: zid("enrollments"),
    lessonId: z.string(),
    complete: z.boolean(),
  }),
  handler: async (ctx, args) => {
    const run = await active(ctx, ctx.userId, args.enrollmentId);
    const modules = await ctx.db
      .query("modules")
      .withIndex("by_course", (q) => q.eq("courseId", run.courseId))
      .collect();
    if (!modules.some((m) => m.lessons?.some((l) => l.id === args.lessonId)))
      return denied();
    const ids = new Set(run.completedLessonIds);
    if (args.complete) ids.add(args.lessonId);
    else ids.delete(args.lessonId);
    await ctx.db.patch(run._id, {
      completedLessonIds: [...ids],
      completedClasses: ids.size,
    });
  },
});
async function attach(
  ctx: MutationCtx,
  uploadId: Id<"privateUploads">,
  userId: Id<"users">,
  purpose: "exam" | "material",
  enrollmentId?: Id<"enrollments">,
) {
  const upload = await ctx.db.get(uploadId);
  if (
    !upload ||
    upload.ownerId !== userId ||
    upload.purpose !== purpose ||
    upload.enrollmentId !== enrollmentId ||
    !upload.storageId ||
    upload.attached
  )
    return denied();
  await ctx.db.patch(uploadId, { attached: true });
}
export const saveResource = zAdminMutation({
  args: resourceValidator,
  handler: async (ctx, args) => {
    if (!(await ctx.db.get(args.courseId))) return denied();
    if (!!args.url === !!args.uploadId)
      throw new ConvexError({
        code: "INVALID_RESOURCE",
        message: "Elegí un enlace o archivo.",
      });
    if (args.url && !args.url.startsWith("https://")) return denied();
    if (args.kind === "live") {
      const schedule = args.scheduleId && (await ctx.db.get(args.scheduleId));
      if (!schedule || schedule.courseId !== args.courseId) return denied();
    } else if (args.scheduleId) return denied();
    if (args.lessonId) {
      const modules = await ctx.db
        .query("modules")
        .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
        .collect();
      if (!modules.some((m) => m.lessons?.some((l) => l.id === args.lessonId)))
        return denied();
    }
    if (args.uploadId) await attach(ctx, args.uploadId, ctx.userId, "material");
    return await ctx.db.insert("courseResources", args);
  },
});
export const removeResource = zAdminMutation({
  args: z.object({ id: zid("courseResources") }),
  handler: async (ctx, args) => {
    const resource = await ctx.db.get(args.id);
    if (!resource) return;
    await ctx.db.delete(args.id);
    if (resource.uploadId) {
      const upload = await ctx.db.get(resource.uploadId);
      if (upload?.storageId) await ctx.storage.delete(upload.storageId);
      await ctx.db.delete(resource.uploadId);
    }
  },
});
export const beginUpload = zStudentMutation({
  args: z.object({
    enrollmentId: zid("enrollments"),
    fileName: z.string().min(1).max(255),
  }),
  handler: async (ctx, args) => {
    const run = await active(ctx, ctx.userId, args.enrollmentId);
    const exam = await ctx.db.get(run.examId);
    if (exam?.kind !== "manual" || !run.retryOpen) return denied();
    return await ctx.db.insert("privateUploads", {
      ownerId: ctx.userId,
      purpose: "exam",
      enrollmentId: run._id,
      fileName: args.fileName,
      attached: false,
    });
  },
});
export const beginMaterialUpload = zAdminMutation({
  args: z.object({ fileName: z.string().min(1).max(255) }),
  handler: async (ctx, args) =>
    await ctx.db.insert("privateUploads", {
      ownerId: ctx.userId,
      purpose: "material",
      fileName: args.fileName,
      attached: false,
    }),
});
// The authenticated HTTP endpoint stores bytes itself; clients cannot claim arbitrary storage IDs.
export const uploadPermission = internalQuery({
  args: { userId: v.id("users"), uploadId: v.id("privateUploads") },
  handler: async (ctx, args) => {
    const upload = await ctx.db.get(args.uploadId);
    const user = await ctx.db.get(args.userId);
    if (
      !upload ||
      upload.ownerId !== args.userId ||
      upload.attached ||
      upload.storageId
    )
      return null;
    if (upload.purpose === "material")
      return user?.role === "admin" ? upload : null;
    if (user?.role !== "student" || !upload.enrollmentId) return null;
    const run = await ctx.db.get(upload.enrollmentId);
    return run?.userId === args.userId &&
      run.status === "active" &&
      run.retryOpen
      ? upload
      : null;
  },
});
export const finishUpload = internalMutation({
  args: {
    uploadId: v.id("privateUploads"),
    storageId: v.id("_storage"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const upload = await ctx.db.get(args.uploadId);
    const metadata = await ctx.db.system.get("_storage", args.storageId);
    if (
      !upload ||
      upload.ownerId !== args.userId ||
      upload.storageId ||
      upload.attached ||
      !metadata?.contentType ||
      !types.has(metadata.contentType) ||
      metadata.size <= 0 ||
      metadata.size > 25 * 1024 * 1024
    ) {
      await ctx.storage.delete(args.storageId);
      return denied();
    }
    if (upload.enrollmentId)
      await active(ctx, args.userId, upload.enrollmentId);
    await ctx.db.patch(upload._id, {
      storageId: args.storageId,
      contentType: metadata.contentType,
      size: metadata.size,
    });
  },
});
export const downloadPermission = internalQuery({
  args: {
    userId: v.id("users"),
    uploadId: v.id("privateUploads"),
    enrollmentId: v.optional(v.id("enrollments")),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    const upload = await ctx.db.get(args.uploadId);
    if (!upload?.storageId || !upload.attached) return null;
    if (user?.role === "admin") return upload;
    if (user?.role !== "student" || !args.enrollmentId) return null;
    const run = await ctx.db.get(args.enrollmentId);
    if (!run || run.userId !== args.userId || run.status !== "active")
      return null;
    if (upload.purpose === "exam")
      return upload.ownerId === args.userId && upload.enrollmentId === run._id
        ? upload
        : null;
    const resources = await ctx.db
      .query("courseResources")
      .withIndex("by_course", (q) => q.eq("courseId", run.courseId))
      .collect();
    return resources.some(
      (r) =>
        r.uploadId === args.uploadId &&
        (r.kind !== "live" ||
          (run.tier === "live" && r.scheduleId === run.scheduleId)),
    )
      ? upload
      : null;
  },
});
export const cleanup = internalMutation({
  args: {},
  handler: async (ctx) => {
    for (const upload of await ctx.db.query("privateUploads").collect())
      if (!upload.attached && upload._creationTime < Date.now() - 86400000) {
        if (upload.storageId) await ctx.storage.delete(upload.storageId);
        await ctx.db.delete(upload._id);
      }
  },
});
export const submit = zStudentMutation({
  args: z.object({
    enrollmentId: zid("enrollments"),
    attemptNumber: z.number().int().positive(),
    answers: z.array(z.number().int()).optional(),
    uploadId: zid("privateUploads").optional(),
  }),
  handler: async (ctx, args) => {
    const own = await ctx.db.get(args.enrollmentId);
    if (!own || own.userId !== ctx.userId) return denied();
    const prior = (
      await ctx.db
        .query("examAttempts")
        .withIndex("by_enrollment", (q) => q.eq("enrollmentId", own._id))
        .collect()
    ).find((a) => a.number === args.attemptNumber);
    if (prior) return prior._id;
    const run = await active(ctx, ctx.userId, args.enrollmentId);
    if (!run.retryOpen || run.attemptNumber !== args.attemptNumber)
      return denied();
    const exam = await ctx.db.get(run.examId);
    if (!exam) return denied();
    let score: number | undefined;
    let status: "submitted" | "passed" | "failed" = "submitted";
    if (exam.kind === "quiz") {
      if (
        !args.answers ||
        args.answers.length !== exam.questions.length ||
        args.answers.some(
          (a, i) => a < 0 || a >= exam.questions[i].options.length,
        )
      )
        return denied();
      score =
        (100 *
          args.answers.filter((a, i) => a === exam.questions[i].correct)
            .length) /
        exam.questions.length;
      status = score >= exam.passingPercent ? "passed" : "failed";
    } else {
      if (!args.uploadId) return denied();
      await attach(ctx, args.uploadId, ctx.userId, "exam", run._id);
    }
    const id = await ctx.db.insert("examAttempts", {
      enrollmentId: run._id,
      examId: exam._id,
      number: run.attemptNumber,
      status,
      score,
      answers: args.answers,
      uploadId: args.uploadId,
    });
    await ctx.db.patch(run._id, {
      retryOpen: false,
      ...(status === "passed"
        ? { status: "completed" as const, completedAt: Date.now() }
        : {}),
    });
    return id;
  },
});
export const review = zAdminMutation({
  args: z.object({
    enrollmentId: zid("enrollments"),
    passed: z.boolean(),
    note: z.string().min(1).max(2000),
  }),
  handler: async (ctx, args) => {
    const run = await ctx.db.get(args.enrollmentId);
    if (!run || run.status !== "active") return denied();
    const exam = await ctx.db.get(run.examId);
    if (exam?.kind !== "manual") return denied();
    const attempts = await ctx.db
      .query("examAttempts")
      .withIndex("by_enrollment", (q) => q.eq("enrollmentId", run._id))
      .collect();
    const attempt = attempts.find((a) => a.number === run.attemptNumber);
    if (attempt && attempt.status !== "submitted") return denied();
    if (!attempt && !run.retryOpen) return denied();
    const result = {
      status: args.passed ? ("passed" as const) : ("failed" as const),
      feedback: args.note,
      reviewedBy: ctx.userId,
      reviewedAt: Date.now(),
    };
    if (attempt) await ctx.db.patch(attempt._id, result);
    else
      await ctx.db.insert("examAttempts", {
        enrollmentId: run._id,
        examId: exam._id,
        number: run.attemptNumber,
        ...result,
      });
    await ctx.db.patch(run._id, {
      retryOpen: false,
      ...(args.passed
        ? { status: "completed" as const, completedAt: Date.now() }
        : {}),
    });
  },
});
export const reopen = zAdminMutation({
  args: z.object({ enrollmentId: zid("enrollments") }),
  handler: async (ctx, args) => {
    const run = await ctx.db.get(args.enrollmentId);
    if (!run || run.status !== "active" || run.retryOpen) return denied();
    const attempts = await ctx.db
      .query("examAttempts")
      .withIndex("by_enrollment", (q) => q.eq("enrollmentId", run._id))
      .collect();
    if (
      !attempts.some(
        (a) => a.number === run.attemptNumber && a.status === "failed",
      )
    )
      return denied();
    const failed = attempts.find(
      (a) => a.number === run.attemptNumber && a.status === "failed",
    )!;
    await ctx.db.patch(failed._id, {
      reopenedBy: ctx.userId,
      reopenedAt: Date.now(),
    });
    await ctx.db.patch(run._id, {
      retryOpen: true,
      attemptNumber: run.attemptNumber + 1,
      reopenedBy: ctx.userId,
      reopenedAt: Date.now(),
    });
  },
});
export const reviewQueue = zAdminQuery({
  args: z.object({}),
  handler: async (ctx) =>
    await Promise.all(
      (await ctx.db.query("enrollments").collect())
        .filter((e) => e.status === "active")
        .map(async (run) => ({
          run,
          student: (await ctx.db.get(run.userId))?.email,
          course: (await ctx.db.get(run.courseId))?.title,
          exam: await ctx.db.get(run.examId),
          attempts: await ctx.db
            .query("examAttempts")
            .withIndex("by_enrollment", (q) => q.eq("enrollmentId", run._id))
            .collect(),
        })),
    ),
});
