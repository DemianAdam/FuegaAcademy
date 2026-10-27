import { z } from 'zod';
import { zAdminQuery, zStudentQuery } from '../zod';

export const mine = zStudentQuery({
  args: z.object({}),
  handler: async (ctx) => {
    const submissions = await ctx.db.query('finalProjectSubmissions').withIndex('by_user', (query) => query.eq('userId', ctx.userId)).collect();
    return await Promise.all(submissions.map(async (submission) => ({
      ...submission,
      url: await ctx.storage.getUrl(submission.storageId),
    })));
  },
});

export const pendingReview = zAdminQuery({
  args: z.object({}),
  handler: async (ctx) => {
    const submissions = (await ctx.db.query('finalProjectSubmissions').collect()).filter((submission) => submission.status === 'submitted' || submission.status === 'rejected');
    return await Promise.all(submissions.map(async (submission) => {
      const [student, course] = await Promise.all([ctx.db.get(submission.userId), ctx.db.get(submission.courseId)]);
      return { ...submission, studentEmail: student?.email ?? 'Unknown student', courseTitle: course?.title ?? 'Unknown course', url: await ctx.storage.getUrl(submission.storageId) };
    }));
  },
});
