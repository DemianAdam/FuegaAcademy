import { z } from 'zod';
import { internal } from '../_generated/api';
import { zAdminMutation } from '../zod';

/** One-time safe cleanup for preferences created before per-course reservation existed. */
export const remediateLegacyPending = zAdminMutation({
  args: z.object({}),
  handler: async (ctx) => {
    const pending = await ctx.db.query('orders').withIndex('by_status', (query) => query.eq('status', 'pending')).collect();
    const groups = new Map<string, typeof pending>();
    for (const order of pending) {
      const key = `${order.userId}:${order.courseId}`;
      groups.set(key, [...(groups.get(key) ?? []), order]);
    }
    let expired = 0;
    for (const orders of groups.values()) {
      const [, ...duplicates] = [...orders].sort((left, right) => right._creationTime - left._creationTime);
      for (const order of duplicates) {
        await ctx.db.patch(order._id, { status: 'expired', expiresAt: Date.now(), failureReason: 'Superseded duplicate checkout during remediation.' });
        if (order.externalPreferenceId) await ctx.scheduler.runAfter(0, internal.checkout.actions.closePreference, { orderId: order._id });
        expired += 1;
      }
    }
    return { expired };
  },
});
