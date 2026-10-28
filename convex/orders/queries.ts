import { z } from "zod";
import { zAdminQuery, zStudentQuery } from "../zod";

export const getMyStatus = zStudentQuery({
  args: z.object({ orderId: z.string().min(1) }),
  handler: async (ctx, args) => {
    const orderId = ctx.db.normalizeId("orders", args.orderId);
    if (!orderId) return null;
    const order = await ctx.db.get(orderId);
    if (!order || order.userId !== ctx.userId) return null;
    const course = await ctx.db.get(order.courseId);
    const attempts = await ctx.db
      .query("paymentAttempts")
      .withIndex("by_order", (q) => q.eq("orderId", orderId))
      .collect();
    const processing = attempts.some((p) =>
      ["pending", "in_process", "authorized"].includes(p.status),
    );
    const declined =
      attempts.length > 0 &&
      attempts.every((p) => ["rejected", "cancelled"].includes(p.status));
    return {
      id: String(order._id),
      status:
        order.status === "pending" && declined
          ? ("rejected" as const)
          : order.status,
      processing,
      courseTitle: order.courseTitle ?? course?.title ?? "Curso",
      courseSlug: order.courseSlug ?? course?.slug,
      tier: order.tier,
      checkoutUrl: order.checkoutUrl,
      expiresAt: order.expiresAt,
      amountMinor: order.amountMinor,
      currency: order.currency,
      checkoutState: order.checkoutState,
    };
  },
});

export const listReviewQueue = zAdminQuery({
  args: z.object({}),
  handler: async (ctx) => {
    const payments = (await ctx.db.query("paymentAttempts").collect()).filter(
      (p) => p.exception,
    );
    return await Promise.all(
      payments.map(async (payment) => {
        const order = await ctx.db.get(payment.orderId);
        const student = order && (await ctx.db.get(order.userId));
        return {
          ...payment,
          externalPaymentId: payment.externalPaymentId,
          failureReason: payment.exception,
          tier: order?.tier ?? "recorded",
          studentEmail: student?.email ?? "",
          courseTitle: order?.courseTitle ?? "Curso",
        };
      }),
    );
  },
});
export const failures = zAdminQuery({
  args: z.object({}),
  handler: async (ctx) => ({
    notifications: (await ctx.db.query("paymentInbox").collect()).filter(
      (n) => n.state === "failed",
    ),
    checkouts: (await ctx.db.query("orders").collect()).filter(
      (o) =>
        o.checkoutState !== "closed" &&
        (o.checkoutState === "uncertain" || o.closureAttempts >= 6),
    ),
  }),
});
