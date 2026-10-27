import { ConvexError } from 'convex/values';
import { z } from 'zod';
import { zid } from 'convex-helpers/server/zod4';
import { zAdminMutation, zStudentMutation } from '../zod';

const maxProjectBytes = 25 * 1024 * 1024;
const allowedContentTypes = new Set([
  'application/pdf', 'application/zip', 'application/x-zip-compressed',
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
]);

export const generateUploadUrl = zStudentMutation({
  args: z.object({ enrollmentId: zid('enrollments') }),
  handler: async (ctx, args) => {
    const enrollment = await ctx.db.get(args.enrollmentId);
    const course = enrollment && await ctx.db.get(enrollment.courseId);
    if (!enrollment || enrollment.userId !== ctx.userId || enrollment.status === 'completed' || !course?.requiresFinalProject) {
      throw new ConvexError({ code: 'FORBIDDEN', message: 'This course run cannot submit a final project.' });
    }
    return await ctx.storage.generateUploadUrl();
  },
});

export const submit = zStudentMutation({
  args: z.object({ enrollmentId: zid('enrollments'), storageId: zid('_storage'), fileName: z.string().min(1).max(255) }),
  handler: async (ctx, args) => {
    const enrollment = await ctx.db.get(args.enrollmentId);
    const course = enrollment && await ctx.db.get(enrollment.courseId);
    if (!enrollment || enrollment.userId !== ctx.userId || enrollment.status === 'completed' || !course?.requiresFinalProject) {
      throw new ConvexError({ code: 'FORBIDDEN', message: 'This course run cannot submit a final project.' });
    }
    const prior = await ctx.db.query('finalProjectSubmissions').withIndex('by_enrollment', (query) => query.eq('enrollmentId', args.enrollmentId)).collect();
    const latest = prior.sort((a, b) => b._creationTime - a._creationTime)[0];
    if (latest?.status === 'submitted') throw new ConvexError({ code: 'PROJECT_ALREADY_SUBMITTED', message: 'Your project is already awaiting review.' });
    if (latest?.status === 'rejected' && !enrollment.finalProjectResubmissionOpen) throw new ConvexError({ code: 'PROJECT_REOPEN_REQUIRED', message: 'An administrator must reopen this course run before resubmission.' });
    const metadata = await ctx.db.system.get('_storage', args.storageId);
    if (!metadata?.contentType || !allowedContentTypes.has(metadata.contentType) || metadata.size > maxProjectBytes) {
      throw new ConvexError({ code: 'INVALID_PROJECT_FILE', message: 'Upload a PDF, image, or ZIP file no larger than 25 MB.' });
    }
    const submissionId = await ctx.db.insert('finalProjectSubmissions', {
      enrollmentId: args.enrollmentId, userId: ctx.userId, courseId: enrollment.courseId,
      storageId: args.storageId, contentType: metadata.contentType, size: metadata.size,
      fileName: args.fileName, status: 'submitted',
    });
    await ctx.db.patch(args.enrollmentId, { finalProjectResubmissionOpen: false });
    return submissionId;
  },
});

export const review = zAdminMutation({
  args: z.object({ submissionId: zid('finalProjectSubmissions'), decision: z.enum(['approved', 'rejected']), feedback: z.string().max(2000).optional() }),
  handler: async (ctx, args) => {
    const submission = await ctx.db.get(args.submissionId);
    if (!submission || submission.status !== 'submitted') throw new ConvexError({ code: 'SUBMISSION_UNAVAILABLE', message: 'Submission is not awaiting review.' });
    const enrollment = await ctx.db.get(submission.enrollmentId);
    if (!enrollment || enrollment.status === 'completed') throw new ConvexError({ code: 'ENROLLMENT_UNAVAILABLE', message: 'Course run is not active.' });
    const now = Date.now();
    await ctx.db.patch(args.submissionId, { status: args.decision, feedback: args.feedback, reviewedBy: ctx.userId, reviewedAt: now });
    if (args.decision === 'approved') await ctx.db.patch(enrollment._id, { status: 'completed', completedAt: now, finalProjectResubmissionOpen: false });
  },
});

export const reopen = zAdminMutation({
  args: z.object({ enrollmentId: zid('enrollments') }),
  handler: async (ctx, args) => {
    const enrollment = await ctx.db.get(args.enrollmentId);
    if (!enrollment || enrollment.status === 'completed') throw new ConvexError({ code: 'ENROLLMENT_UNAVAILABLE', message: 'Course run is not active.' });
    const submissions = await ctx.db.query('finalProjectSubmissions').withIndex('by_enrollment', (query) => query.eq('enrollmentId', args.enrollmentId)).collect();
    if (!submissions.some((submission) => submission.status === 'rejected')) throw new ConvexError({ code: 'PROJECT_NOT_REJECTED', message: 'Only rejected projects can be reopened.' });
    await ctx.db.patch(args.enrollmentId, { finalProjectResubmissionOpen: true });
  },
});
