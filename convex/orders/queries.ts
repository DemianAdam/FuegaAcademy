import { z } from 'zod';
import { zAdminQuery, zStudentQuery } from '../zod';

export const getMyStatus = zStudentQuery({
  args: z.object({ orderId: z.string().min(1) }),
  handler: async (ctx, args) => {
    const orderId = ctx.db.normalizeId('orders', args.orderId);
    if (!orderId) return null;
    const order = await ctx.db.get(orderId);
    if (!order || order.userId !== ctx.userId) return null;
    const course = await ctx.db.get(order.courseId);
    return {
      id: String(order._id), status: order.status, courseTitle: order.courseTitle ?? course?.title ?? 'Curso',
      courseSlug: order.courseSlug ?? course?.slug, tier: order.tier, checkoutUrl: order.checkoutUrl,
      expiresAt: order.expiresAt, amountMinor: order.amountMinor, currency: order.currency,
    };
  },
});

export const listReviewQueue = zAdminQuery({
  args: z.object({}),
  handler: async (ctx) => {
    const orders = await ctx.db.query('orders').withIndex('by_status', (query) => query.eq('status', 'review')).collect();
    return await Promise.all(orders.map(async (order) => {
      const [student, course] = await Promise.all([ctx.db.get(order.userId), ctx.db.get(order.courseId)]);
      return { ...order, studentEmail: student?.email ?? 'Unknown student', courseTitle: course?.title ?? order.courseTitle ?? 'Unknown course' };
    }));
  },
});
