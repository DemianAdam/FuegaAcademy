/// <reference types="node" />
import { getAuthUserId } from '@convex-dev/auth/server';
import { ConvexError, v } from 'convex/values';
import { action } from '../_generated/server';
import { internal } from '../_generated/api';
import { validateCheckoutRules } from '@shared/payments/checkoutRules';
import { tierIsActive } from '@shared/courseCommerce';

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
    if (checkout.enrollment) {
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
    const orderId = await ctx.runMutation(internal.orders.internal.createPendingOrder, {
      userId,
      courseId: args.courseId,
      scheduleId: args.scheduleId,
      tier: args.tier,
      amountMinor,
      currency: 'ARS',
      courseTitle: title,
      courseSlug: slug,
      payerEmail: checkout.user.email,
    });

    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      await ctx.runMutation(internal.orders.internal.markOrderRejected, {
        orderId,
        failureReason: 'Mercado Pago is not configured.',
      });
      throw new ConvexError({ code: 'PAYMENT_NOT_CONFIGURED', message: 'Payment is unavailable.' });
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
        payer: checkout.user.email ? { email: checkout.user.email } : undefined,
        metadata: {
          order_id: String(orderId),
          user_id: String(userId),
          course_id: String(args.courseId),
        },
        external_reference: String(orderId),
        back_urls: {
          success: `${siteUrl}/dashboard?payment=success&order=${orderId}`,
          failure: `${siteUrl}/dashboard?payment=failure&order=${orderId}`,
          pending: `${siteUrl}/dashboard?payment=pending&order=${orderId}`,
        },
        auto_return: 'approved',
        ...(convexSiteUrl
          ? { notification_url: `${convexSiteUrl}/mercadopago-webhook` }
          : {}),
      }),
    });

    if (!response.ok) {
      await ctx.runMutation(internal.orders.internal.markOrderRejected, {
        orderId,
        failureReason: `Preference creation failed (${response.status}).`,
      });
      throw new ConvexError({ code: 'PAYMENT_PROVIDER_ERROR', message: 'Could not start checkout.' });
    }

    const preference = (await response.json()) as MercadoPagoPreference;
    if (!preference.id || !preference.init_point) {
      await ctx.runMutation(internal.orders.internal.markOrderRejected, {
        orderId,
        failureReason: 'Mercado Pago returned an invalid preference.',
      });
      throw new ConvexError({ code: 'PAYMENT_PROVIDER_ERROR', message: 'Could not start checkout.' });
    }
    await ctx.runMutation(internal.orders.internal.updateOrderPreference, {
      orderId,
      externalPreferenceId: preference.id,
    });

    return {
      initPoint: preference.init_point,
      sandboxInitPoint: preference.sandbox_init_point,
      orderId: String(orderId),
    };
  },
});

