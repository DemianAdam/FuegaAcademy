import { internalMutation, internalQuery } from "../_generated/server";
import { v } from "convex/values";
import { orderValidator } from "./validators";

export const createPendingOrder = internalMutation({
  args: {
    userId: orderValidator.shape.userId,
    courseId: orderValidator.shape.courseId,
    scheduleId: orderValidator.shape.scheduleId.optional(),
    tier: orderValidator.shape.tier,
    amount: orderValidator.shape.amount,
    currency: orderValidator.shape.currency,
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("orders", {
      userId: args.userId,
      courseId: args.courseId,
      scheduleId: args.scheduleId,
      tier: args.tier,
      amount: args.amount,
      currency: args.currency,
      status: "pending",
      provider: "mercadopago",
    });
  },
});

export const updateOrderPreference = internalMutation({
  args: {
    orderId: v.id("orders"),
    externalPreferenceId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, {
      externalPreferenceId: args.externalPreferenceId,
    });
  },
});

export const fulfillOrderInternal = internalMutation({
  args: {
    orderId: v.id("orders"),
    externalPaymentId: v.string(),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new Error(`Order not found: ${args.orderId}`);
    }

    if (order.status === "approved") {
      return order._id;
    }

    await ctx.db.patch(args.orderId, {
      status: "approved",
      externalPaymentId: args.externalPaymentId,
    });

    const existingEnrollment = await ctx.db
      .query("enrollments")
      .withIndex("by_user_course", (q) =>
        q.eq("userId", order.userId).eq("courseId", order.courseId)
      )
      .unique();

    if (!existingEnrollment) {
      if (order.scheduleId) {
        const schedule = await ctx.db.get(order.scheduleId);
        if (schedule) {
          await ctx.db.patch(order.scheduleId, {
            enrolledCount: schedule.enrolledCount + 1,
          });
        }
      }

      await ctx.db.insert("enrollments", {
        userId: order.userId,
        courseId: order.courseId,
        scheduleId: order.scheduleId,
        completedClasses: 0,
      });
    }

    return order._id;
  },
});

export const getOrderByExternalPreference = internalQuery({
  args: { externalPreferenceId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_external_preference", (q) =>
        q.eq("externalPreferenceId", args.externalPreferenceId)
      )
      .unique();
  },
});

export const getCourseById = internalQuery({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.courseId);
  },
});
