import { action } from "../_generated/server";
import { internal } from "../_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
import { createCheckoutSessionValidator } from "./validators";

export const createCheckoutSession = action({
  args: createCheckoutSessionValidator,
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized: Not logged in");
    }

    const course = await ctx.runQuery(internal.orders.internal.getCourseById, {
      courseId: args.courseId,
    });

    if (!course) {
      throw new Error("Course not found");
    }

    const pricingTier = course.pricing?.[args.tier];
    if (!pricingTier) {
      throw new Error(`Pricing tier ${args.tier} not found or price not set for this course.`);
    }

    const amount = pricingTier.amount;
    const currency = "ARS";

    // 1. Create pending order
    const orderId = await ctx.runMutation(internal.orders.internal.createPendingOrder, {
      userId,
      courseId: args.courseId,
      scheduleId: args.scheduleId,
      tier: args.tier,
      amount,
      currency,
    });

    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error("Missing MP_ACCESS_TOKEN environment variable");
    }

    // 2. Call Mercado Pago Preferences API
    const mpResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        items: [
          {
            title: `${course.title} (${args.tier})`,
            quantity: 1,
            currency_id: "ARS",
            unit_price: amount,
          },
        ],
        external_reference: orderId,
        back_urls: {
          success: `${process.env.SITE_URL || "http://localhost:5173"}/dashboard?status=success`,
          failure: `${process.env.SITE_URL || "http://localhost:5173"}/dashboard?status=failure`,
          pending: `${process.env.SITE_URL || "http://localhost:5173"}/dashboard?status=pending`,
        },
        auto_return: "approved",
        notification_url: process.env.CONVEX_SITE_URL ? `${process.env.CONVEX_SITE_URL}/mercadopago-webhook` : undefined,
      }),
    });

    if (!mpResponse.ok) {
      const errText = await mpResponse.text();
      throw new Error(`Mercado Pago preference creation failed: ${mpResponse.status} - ${errText}`);
    }

    const preference = await mpResponse.json();

    // 3. Save external preference ID
    await ctx.runMutation(internal.orders.internal.updateOrderPreference, {
      orderId,
      externalPreferenceId: preference.id,
    });

    return {
      initPoint: preference.init_point,
      sandboxInitPoint: preference.sandbox_init_point,
      orderId,
    };
  },
});
