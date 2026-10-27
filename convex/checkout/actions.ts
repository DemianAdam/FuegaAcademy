/// <reference types="node" />
import { getAuthUserId } from '@convex-dev/auth/server';
import { ConvexError, v } from 'convex/values';
import { action, internalAction } from '../_generated/server';
import { internal } from '../_generated/api';
import { validateCheckoutRules } from '@shared/payments/checkoutRules';
import { tierIsActive } from '@shared/courseCommerce';
import { fetchPaymentWithPreference } from './mercadoPago';

interface MercadoPagoPreference {
  id: string;
  init_point: string;
  sandbox_init_point?: string;
}

export const createPreference = action({
  args: {
    courseId: v.id('courses'),
    scheduleId: v.optional(v.id('schedules')),
    tier: v.union(v.literal('live'), v.literal('recorded')),
  },
  handler: async (ctx, args): Promise<{
    initPoint: string;
    sandboxInitPoint?: string;
    orderId: string;
  }> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError({ code: 'UNAUTHENTICATED', message: 'Sign in to continue.' });
    const checkout = await ctx.runQuery(internal.orders.internal.getCheckoutContext, {
      userId,
      courseId: args.courseId,
      scheduleId: args.scheduleId,
    });

    if (!checkout.user || !checkout.course) {
      throw new ConvexError({ code: 'COURSE_NOT_FOUND', message: 'Course not found.' });
    }
    if (checkout.user.role !== 'student') {
      throw new ConvexError({ code: 'FORBIDDEN', message: 'Only student accounts can enroll.' });
    }
    if (checkout.activeEnrollment || (checkout.completedEnrollment && !checkout.course.requiresFinalProject)) {
      throw new ConvexError({ code: 'ALREADY_ENROLLED', message: 'You are already enrolled.' });
    }
    if (!tierIsActive(checkout.course.format, args.tier)) {
      throw new ConvexError({ code: 'TIER_UNAVAILABLE', message: 'Tier is unavailable for this course format.' });
    }
    const tier = checkout.course.pricing[args.tier];
    if (!tier) throw new ConvexError({ code: 'TIER_UNAVAILABLE', message: 'Tier is unavailable.' });
    const amountMinor = tier.amountMinor ?? Math.round((tier.amount ?? 0) * 100);
    const checkoutError = validateCheckoutRules({
      courseId: String(args.courseId),
      courseStatus: checkout.course.status,
      tier: args.tier,
      amountMinor,
      currency: tier.currency,
      scheduleId: args.scheduleId ? String(args.scheduleId) : undefined,
      schedule: checkout.schedule
        ? {
          id: String(checkout.schedule._id),
          courseId: String(checkout.schedule.courseId),
          isArchived: checkout.schedule.isArchived,
          enrolledCount: checkout.schedule.enrolledCount,
          capacity: checkout.schedule.capacity,
        }
        : null,
    });
    if (checkoutError) {
      const messages: Record<typeof checkoutError, string> = {
        COURSE_UNAVAILABLE: 'Course is unavailable.',
        INVALID_PRICE: 'Course price is invalid.',
        SCHEDULE_REQUIRED: 'Choose a schedule.',
        SCHEDULE_UNAVAILABLE: 'Schedule is unavailable.',
        INVALID_SCHEDULE: 'Recorded access has no schedule.',
      };
      throw new ConvexError({ code: checkoutError, message: messages[checkoutError] });
    }

    const title = checkout.course.title;
    const slug = checkout.course.slug;
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
    const reservation = await ctx.runMutation(internal.orders.internal.reserveCheckout, {
      userId,
      courseId: args.courseId,
      scheduleId: args.scheduleId,
      tier: args.tier,
      amountMinor,
      currency: 'ARS',
      courseTitle: title,
      courseSlug: slug,
      expiresAt,
    });
    const orderId = reservation.orderId;
    if (reservation.checkoutUrl) {
      console.log('Resuming existing checkout', { orderId: String(orderId), checkoutUrl: reservation.checkoutUrl });
      return { initPoint: reservation.checkoutUrl, orderId: String(orderId) };
    }

    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      await ctx.runMutation(internal.orders.internal.markOrderRejected, {
        orderId,
        failureReason: 'Mercado Pago is not configured.',
      });
      throw new ConvexError({ code: 'PAYMENT_NOT_CONFIGURED', message: 'Payment is unavailable.' });
    }

    if (reservation.externalPreferenceId) {
      const existingResponse = await fetch(
        `https://api.mercadopago.com/checkout/preferences/${encodeURIComponent(reservation.externalPreferenceId)}`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      if (existingResponse.ok) {
        const existingPreference = (await existingResponse.json()) as MercadoPagoPreference;
        const existingCheckoutUrl = existingPreference.init_point ?? existingPreference.sandbox_init_point;
        if (existingCheckoutUrl) {
          await ctx.runMutation(internal.orders.internal.updateOrderPreference, {
            orderId,
            externalPreferenceId: reservation.externalPreferenceId,
            checkoutUrl: existingCheckoutUrl,
          });
          console.log('Resuming existing Mercado Pago preference', {
            orderId: String(orderId),
            preferenceId: reservation.externalPreferenceId,
          });
          return { initPoint: existingCheckoutUrl, orderId: String(orderId) };
        }
      }
      throw new ConvexError({ code: 'PAYMENT_PROVIDER_ERROR', message: 'Could not resume checkout.' });
    }

    const siteUrl = (process.env.SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
    const convexSiteUrl = process.env.CONVEX_SITE_URL?.replace(/\/$/, '');
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'X-Idempotency-Key': String(orderId),
      },
      body: JSON.stringify({
        items: [
          {
            id: String(args.courseId),
            title: `${title} (${args.tier})`,
            quantity: 1,
            currency_id: 'ARS',
            unit_price: amountMinor / 100,
          },
        ],
        metadata: {
          order_id: String(orderId),
          user_id: String(userId),
          course_id: String(args.courseId),
        },
        external_reference: String(orderId),
        back_urls: {
          success: `${siteUrl}/checkout/${orderId}`,
          failure: `${siteUrl}/checkout/${orderId}`,
          pending: `${siteUrl}/checkout/${orderId}`,
        },
        auto_return: 'approved',
        expires: true,
        expiration_date_from: new Date(Date.now()).toISOString(),
        expiration_date_to: new Date(reservation.expiresAt).toISOString(),
        ...(convexSiteUrl
          ? { notification_url: `${convexSiteUrl}/mercadopago-webhook` }
          : {}),
      }),
    });

    if (!response.ok) {
      console.error('Mercado Pago preference creation failed', {
        orderId: String(orderId),
        status: response.status,
      });
      await ctx.runMutation(internal.orders.internal.markOrderRejected, {
        orderId,
        failureReason: `Preference creation failed (${response.status}).`,
      });
      throw new ConvexError({ code: 'PAYMENT_PROVIDER_ERROR', message: 'Could not start checkout.' });
    }

    const preference = (await response.json()) as MercadoPagoPreference;
    if (!preference.id || !preference.init_point) {
      console.error('Mercado Pago returned an incomplete preference', {
        orderId: String(orderId),
        preferenceId: preference.id,
      });
      await ctx.runMutation(internal.orders.internal.markOrderRejected, {
        orderId,
        failureReason: 'Mercado Pago returned an invalid preference.',
      });
      throw new ConvexError({ code: 'PAYMENT_PROVIDER_ERROR', message: 'Could not start checkout.' });
    }
    const checkoutUrl = await ctx.runMutation(internal.orders.internal.updateOrderPreference, {
      orderId,
      externalPreferenceId: preference.id,
      checkoutUrl: preference.init_point,
    });
    console.info('Mercado Pago preference created', {
      orderId: String(orderId),
      preferenceId: preference.id,
      expiresAt: reservation.expiresAt,
    });

    console.log("PREFERENCE CREATED");


    return {
      initPoint: checkoutUrl,
      sandboxInitPoint: preference.sandbox_init_point,
      orderId: String(orderId),
    };
  },
});

export const closePreference = internalAction({
  args: { orderId: v.id('orders') },
  handler: async (ctx, args) => {
    const order = await ctx.runQuery(internal.orders.internal.getProviderOrder, args);
    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!order || order.closedAt || !accessToken) return;
    try {
      const response = await fetch(
        `https://api.mercadopago.com/checkout/preferences/${encodeURIComponent(order.preferenceId)}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify({ expires: true, expiration_date_to: new Date().toISOString() }),
        },
      );
      if (!response.ok) {
        console.warn('Mercado Pago preference closure failed', { orderId: String(args.orderId), status: response.status });
        return;
      }
      await ctx.runMutation(internal.orders.internal.markPreferenceClosed, args);
    } catch (error) {
      console.warn('Mercado Pago preference closure failed', { orderId: String(args.orderId), error: error instanceof Error ? error.message : 'unknown' });
    }
  },
});

export const retryOpenPreferenceClosures = internalAction({
  args: {},
  handler: async (ctx) => {
    const orderIds = await ctx.runQuery(internal.orders.internal.listOpenApprovedPreferences, {});
    for (const orderId of orderIds) await ctx.scheduler.runAfter(0, internal.checkout.actions.closePreference, { orderId });
  },
});

export const reconcilePaymentById = action({
  args: { paymentId: v.string() },
  handler: async (ctx, args): Promise<{ orderId: string; status: string; enrolled: boolean; closePreference: boolean }> => {
    const userId = await getAuthUserId(ctx);
    if (!userId || await ctx.runQuery(internal.orders.internal.getUserRole, { userId }) !== 'admin') {
      throw new ConvexError({ code: 'FORBIDDEN', message: 'Administrator access is required.' });
    }
    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) throw new ConvexError({ code: 'PAYMENT_NOT_CONFIGURED', message: 'Payment is unavailable.' });
    let payment: Awaited<ReturnType<typeof fetchPaymentWithPreference>>['payment'];
    let preferenceId: string;
    try {
      ({ payment, preferenceId } = await fetchPaymentWithPreference(accessToken, args.paymentId));
    } catch (error) {
      throw new ConvexError({
        code: 'PAYMENT_PROVIDER_ERROR',
        message: error instanceof Error ? error.message : 'Could not retrieve the payment.',
      });
    }
    if (!payment.id || !payment.status || !payment.external_reference || typeof payment.transaction_amount !== 'number' || !payment.currency_id) {
      throw new ConvexError({ code: 'PAYMENT_PROVIDER_ERROR', message: 'Mercado Pago returned incomplete payment data.' });
    }
    const reconciliation = await ctx.runMutation(internal.orders.internal.reconcilePayment, {
      orderId: payment.external_reference, externalPaymentId: String(payment.id), externalPreferenceId: preferenceId,
      status: payment.status, amountMinor: Math.round(payment.transaction_amount * 100), currency: payment.currency_id,
      payerEmail: payment.payer?.email, allowReviewReplay: true,
    });
    if (reconciliation.closePreference) await ctx.scheduler.runAfter(0, internal.checkout.actions.closePreference, { orderId: reconciliation.orderId });
    return reconciliation;
  },
});

