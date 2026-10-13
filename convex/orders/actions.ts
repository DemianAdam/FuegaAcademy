/// <reference types="node" />
import { action } from "../_generated/server";
import { internal } from "../_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import type { CourseDoc } from "@shared/validators/courses";
import type { Id } from "../_generated/dataModel";

export const createCheckoutSession = action({
  args: {
    courseId: v.id("courses"),
    scheduleId: v.optional(v.id("schedules")),
    tier: v.union(v.literal("live"), v.literal("recorded")),
  },
  handler: async (ctx, args): Promise<{ initPoint: string; sandboxInitPoint?: string; orderId: string }> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized: Not logged in");
    }

    const existingEnrollment = await ctx.runQuery(
      internal.orders.internal.getEnrollmentByUserCourse,
      {
        userId,
        courseId: args.courseId,
      }
    );

    if (existingEnrollment) {
      throw new Error("User is already enrolled in this course");
    }

    const course = (await ctx.runQuery(internal.orders.internal.getCourseById, {
      courseId: args.courseId,
    })) as CourseDoc | null;

    if (!course) {
      throw new Error("Course not found");
    }

    const pricingTier = course.pricing?.[args.tier as "live" | "recorded"];
    if (!pricingTier) {
      throw new Error(`Pricing tier ${args.tier} not found for this course.`);
    }

    const amount: number = pricingTier.amount;

    // 1. Create pending order
    const orderId = (await ctx.runMutation(internal.orders.internal.createPendingOrder, {
      userId,
      courseId: args.courseId,
      scheduleId: args.scheduleId,
      tier: args.tier,
      amount,
      currency: "ARS",
    })) as Id<"orders">;

    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error("Missing MP_ACCESS_TOKEN environment variable");
    }

    // 2. Call Mercado Pago Preferences API
    const siteUrl = process.env.SITE_URL || "http://localhost:5173";
    const convexSiteUrl = process.env.CONVEX_SITE_URL;

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
            description: course.description,
            quantity: 1,
            currency_id: "ARS",
            unit_price: amount,
          },
        ],
        external_reference: orderId,
        back_urls: {
          success: `${siteUrl}/dashboard?payment=success`,
          failure: `${siteUrl}/dashboard?payment=failure`,
          pending: `${siteUrl}/dashboard?payment=pending`,
        },
        auto_return: "approved",
        ...(convexSiteUrl ? { notification_url: `${convexSiteUrl}/mercadopago-webhook` } : {}),
      }),
    });

    if (!mpResponse.ok) {
      const errText = await mpResponse.text();
      throw new Error(`Mercado Pago preference creation failed: ${mpResponse.status} - ${errText}`);
    }

    const preference = (await mpResponse.json()) as any;

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
