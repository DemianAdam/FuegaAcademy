import { internalMutation, internalQuery } from '../_generated/server';
import { ConvexError, v } from 'convex/values';
import { getPaymentMismatch } from '@shared/payments/checkoutRules';

export const getCheckoutContext = internalQuery({
  args: {
    userId: v.id('users'),
    courseId: v.id('courses'),
    scheduleId: v.optional(v.id('schedules')),
  },
  handler: async (ctx, args) => {
    const [user, course, schedule, enrollment] = await Promise.all([
      ctx.db.get(args.userId),
      ctx.db.get(args.courseId),
      args.scheduleId ? ctx.db.get(args.scheduleId) : Promise.resolve(null),
      ctx.db
        .query('enrollments')
        .withIndex('by_user_course', (query) =>
          query.eq('userId', args.userId).eq('courseId', args.courseId),
        )
        .unique(),
    ]);
    return { user, course, schedule, enrollment };
  },
});

export const createPendingOrder = internalMutation({
  args: {
    userId: v.id('users'),
    courseId: v.id('courses'),
    scheduleId: v.optional(v.id('schedules')),
    tier: v.union(v.literal('live'), v.literal('recorded')),
    amountMinor: v.number(),
    currency: v.literal('ARS'),
    courseTitle: v.string(),
    courseSlug: v.string(),
    payerEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('orders', {
      ...args,
      status: 'pending',
      provider: 'mercadopago',
    });
  },
});

export const updateOrderPreference = internalMutation({
  args: { orderId: v.id('orders'), externalPreferenceId: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, { externalPreferenceId: args.externalPreferenceId });
  },
});

export const markOrderRejected = internalMutation({
  args: { orderId: v.id('orders'), failureReason: v.string() },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (order?.status === 'pending') {
      await ctx.db.patch(args.orderId, { status: 'rejected', failureReason: args.failureReason });
    }
  },
});

export const reconcilePayment = internalMutation({
  args: {
    orderId: v.string(),
    externalPaymentId: v.string(),
    externalPreferenceId: v.optional(v.string()),
    status: v.string(),
    amountMinor: v.number(),
    currency: v.string(),
    payerEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const orderId = ctx.db.normalizeId('orders', args.orderId);
    if (!orderId) {
      throw new ConvexError({ code: 'ORDER_NOT_FOUND', message: 'Invalid order reference.' });
    }
    const order = await ctx.db.get(orderId);
    if (!order) throw new ConvexError({ code: 'ORDER_NOT_FOUND', message: 'Order not found.' });

    const expectedAmountMinor = order.amountMinor ?? Math.round((order.amount ?? 0) * 100);
    const mismatch = getPaymentMismatch({
      expectedAmountMinor,
      expectedCurrency: order.currency,
      expectedPreferenceId: order.externalPreferenceId,
      expectedPayerEmail: order.payerEmail,
      amountMinor: args.amountMinor,
      currency: args.currency,
      preferenceId: args.externalPreferenceId,
      payerEmail: args.payerEmail,
    });
    if (mismatch) {
      const messages: Record<typeof mismatch, string> = {
        PAYMENT_MISMATCH: 'Payment amount or currency mismatch.',
        PREFERENCE_MISMATCH: 'Payment preference mismatch.',
        PAYER_MISMATCH: 'Payment payer mismatch.',
      };
      throw new ConvexError({ code: mismatch, message: messages[mismatch] });
    }

    const paymentOwner = await ctx.db
      .query('orders')
      .withIndex('by_external_payment', (query) => query.eq('externalPaymentId', args.externalPaymentId))
      .unique();
    if (paymentOwner && paymentOwner._id !== orderId) {
      throw new ConvexError({ code: 'PAYMENT_ALREADY_USED', message: 'Payment belongs to another order.' });
    }

    if (args.status !== 'approved') {
      if (['rejected', 'cancelled', 'refunded', 'charged_back'].includes(args.status)) {
        await ctx.db.patch(orderId, {
          status: args.status === 'refunded' ? 'refunded' : 'rejected',
          externalPaymentId: args.externalPaymentId,
          failureReason: `Mercado Pago status: ${args.status}`,
        });
      }
      return { orderId, status: order.status, enrolled: false };
    }

    if (order.status === 'approved') {
      return { orderId, status: 'approved' as const, enrolled: true };
    }

    const existingEnrollment = await ctx.db
      .query('enrollments')
      .withIndex('by_user_course', (query) =>
        query.eq('userId', order.userId).eq('courseId', order.courseId),
      )
      .unique();

    if (!existingEnrollment) {
      if (order.scheduleId) {
        const schedule = await ctx.db.get(order.scheduleId);
        if (!schedule || schedule.isArchived || schedule.courseId !== order.courseId) {
          throw new ConvexError({ code: 'SCHEDULE_UNAVAILABLE', message: 'Schedule is unavailable.' });
        }
        if (schedule.enrolledCount >= schedule.capacity) {
          throw new ConvexError({ code: 'SCHEDULE_FULL', message: 'Schedule is full.' });
        }
        await ctx.db.patch(schedule._id, { enrolledCount: schedule.enrolledCount + 1 });
      }
      await ctx.db.insert('enrollments', {
        userId: order.userId,
        courseId: order.courseId,
        scheduleId: order.scheduleId,
        orderId,
        completedClasses: 0,
      });
    }

    await ctx.db.patch(orderId, {
      status: 'approved',
      externalPaymentId: args.externalPaymentId,
    });
    return { orderId, status: 'approved' as const, enrolled: true };
  },
});

