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
    const [user, course, schedule, enrollments] = await Promise.all([
      ctx.db.get(args.userId),
      ctx.db.get(args.courseId),
      args.scheduleId ? ctx.db.get(args.scheduleId) : Promise.resolve(null),
      ctx.db
        .query('enrollments')
        .withIndex('by_user_course', (query) =>
          query.eq('userId', args.userId).eq('courseId', args.courseId),
        )
        .collect(),
    ]);
    const activeEnrollment = enrollments.find((enrollment) => enrollment.status !== 'completed') ?? null;
    const completedEnrollment = enrollments.find((enrollment) => enrollment.status === 'completed') ?? null;
    return { user, course, schedule, activeEnrollment, completedEnrollment };
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

export const reserveCheckout = internalMutation({
  args: {
    userId: v.id('users'), courseId: v.id('courses'), scheduleId: v.optional(v.id('schedules')),
    tier: v.union(v.literal('live'), v.literal('recorded')), amountMinor: v.number(), currency: v.literal('ARS'),
    courseTitle: v.string(), courseSlug: v.string(), expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    const pending = await ctx.db.query('orders').withIndex('by_user_course_status', (query) =>
      query.eq('userId', args.userId).eq('courseId', args.courseId).eq('status', 'pending'),
    ).collect();
    for (const order of pending) {
      const expiresAt = order.expiresAt ?? order._creationTime + 24 * 60 * 60 * 1000;
      if (expiresAt <= Date.now()) {
        await ctx.db.patch(order._id, { status: 'expired', expiresAt, failureReason: 'Checkout expired.' });
        continue;
      }
      if (!order.expiresAt) await ctx.db.patch(order._id, { expiresAt });
      return {
        orderId: order._id,
        checkoutUrl: order.checkoutUrl,
        externalPreferenceId: order.externalPreferenceId,
        expiresAt,
      };
    }
    const orderId = await ctx.db.insert('orders', { ...args, status: 'pending', provider: 'mercadopago' });
    return { orderId, checkoutUrl: undefined, externalPreferenceId: undefined, expiresAt: args.expiresAt };
  },
});

export const updateOrderPreference = internalMutation({
  args: { orderId: v.id('orders'), externalPreferenceId: v.string(), checkoutUrl: v.string() },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order || order.status !== 'pending') throw new ConvexError({ code: 'ORDER_UNAVAILABLE', message: 'Checkout is no longer available.' });
    if (order.externalPreferenceId && order.externalPreferenceId !== args.externalPreferenceId) {
      if (order.checkoutUrl) return order.checkoutUrl;
      throw new ConvexError({ code: 'PREFERENCE_MISMATCH', message: 'Checkout preference changed unexpectedly.' });
    }
    await ctx.db.patch(args.orderId, { externalPreferenceId: args.externalPreferenceId, checkoutUrl: args.checkoutUrl });
    return args.checkoutUrl;
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
    allowReviewReplay: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const orderId = ctx.db.normalizeId('orders', args.orderId);
    if (!orderId) {
      throw new ConvexError({ code: 'ORDER_NOT_FOUND', message: 'Invalid order reference.' });
    }
    const order = await ctx.db.get(orderId);
    if (!order) throw new ConvexError({ code: 'ORDER_NOT_FOUND', message: 'Order not found.' });

    const paymentOwner = await ctx.db
      .query('orders')
      .withIndex('by_external_payment', (query) => query.eq('externalPaymentId', args.externalPaymentId))
      .unique();
    if (paymentOwner && paymentOwner._id !== orderId) {
      await ctx.db.patch(orderId, {
        status: 'review', payerEmail: args.payerEmail,
        failureReason: 'Duplicate provider payment ID belongs to another order.',
      });
      return { orderId, status: 'review' as const, enrolled: false, closePreference: true };
    }

    const expectedAmountMinor = order.amountMinor ?? Math.round((order.amount ?? 0) * 100);
    const mismatch = getPaymentMismatch({
      expectedAmountMinor,
      expectedCurrency: order.currency,
      expectedPreferenceId: order.externalPreferenceId,
      amountMinor: args.amountMinor,
      currency: args.currency,
      preferenceId: args.externalPreferenceId,
      payerEmail: args.payerEmail,
    });
    if (mismatch) {
      const messages: Record<typeof mismatch, string> = {
        PAYMENT_MISMATCH: 'Payment amount or currency mismatch.',
        PREFERENCE_MISMATCH: 'Payment preference mismatch.',
        PAYER_MISSING: 'Mercado Pago did not return a payer email.',
      };
      await ctx.db.patch(orderId, {
        status: 'review', externalPaymentId: args.externalPaymentId, payerEmail: args.payerEmail,
        failureReason: messages[mismatch],
      });
      return { orderId, status: 'review' as const, enrolled: false, closePreference: true };
    }

    if (args.status === 'refunded' || args.status === 'charged_back') {
      if (order.status === 'refunded' || order.status === 'charged_back') return { orderId, status: order.status, enrolled: false, closePreference: false };
      const enrollment = await ctx.db.query('enrollments').withIndex('by_order', (query) => query.eq('orderId', orderId)).unique();
      if (enrollment) {
        if (enrollment.scheduleId) {
          const schedule = await ctx.db.get(enrollment.scheduleId);
          if (schedule && schedule.enrolledCount > 0) await ctx.db.patch(schedule._id, { enrolledCount: schedule.enrolledCount - 1 });
        }
        await ctx.db.delete(enrollment._id);
      }
      await ctx.db.patch(orderId, { status: args.status, externalPaymentId: args.externalPaymentId, failureReason: `Mercado Pago status: ${args.status}` });
      return { orderId, status: args.status, enrolled: false, closePreference: false };
    }

    if (args.status !== 'approved') {
      if (['rejected', 'cancelled'].includes(args.status)) {
        await ctx.db.patch(orderId, {
          status: 'rejected',
          externalPaymentId: args.externalPaymentId,
          failureReason: `Mercado Pago status: ${args.status}`,
        });
      }
      return { orderId, status: order.status, enrolled: false, closePreference: false };
    }

    if (order.status === 'approved') {
      return { orderId, status: 'approved' as const, enrolled: true, closePreference: !order.preferenceClosedAt };
    }
    if (
      ['refunded', 'charged_back', 'expired', 'rejected'].includes(order.status)
      || (order.status === 'review' && !args.allowReviewReplay)
    ) {
      return { orderId, status: order.status, enrolled: false, closePreference: false };
    }

    const existingEnrollments = await ctx.db
      .query('enrollments')
      .withIndex('by_user_course', (query) =>
        query.eq('userId', order.userId).eq('courseId', order.courseId),
      )
      .collect();
    const activeEnrollment = existingEnrollments.find((enrollment) => enrollment.status !== 'completed');

    if (activeEnrollment) {
      await ctx.db.patch(orderId, {
        status: 'review', externalPaymentId: args.externalPaymentId, payerEmail: args.payerEmail,
        failureReason: 'Duplicate approved payment: the student already has an active course run.',
      });
      return { orderId, status: 'review' as const, enrolled: false, closePreference: true };
    }

    {
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
        status: 'active',
      });
    }

    await ctx.db.patch(orderId, {
      status: 'approved',
      externalPaymentId: args.externalPaymentId,
      payerEmail: args.payerEmail,
      preferenceClosureStatus: 'pending',
    });
    return { orderId, status: 'approved' as const, enrolled: true, closePreference: true };
  },
});

export const markPreferenceClosed = internalMutation({
  args: { orderId: v.id('orders') },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order?.externalPreferenceId) return;
    await ctx.db.patch(args.orderId, { preferenceClosureStatus: 'closed', preferenceClosedAt: Date.now() });
  },
});

export const getProviderOrder = internalQuery({
  args: { orderId: v.id('orders') },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order?.externalPreferenceId) return null;
    return { orderId: order._id, preferenceId: order.externalPreferenceId, closedAt: order.preferenceClosedAt };
  },
});

export const listOpenApprovedPreferences = internalQuery({
  args: {},
  handler: async (ctx) => (await ctx.db.query('orders').withIndex('by_status', (query) => query.eq('status', 'approved')).collect())
    .filter((order) => order.externalPreferenceId && !order.preferenceClosedAt)
    .map((order) => order._id),
});

export const getUserRole = internalQuery({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => (await ctx.db.get(args.userId))?.role ?? null,
});

