/// <reference types="node" />
import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { action, internalAction } from "../_generated/server";
import type { ActionCtx } from "../_generated/server";
import type { Id } from "../_generated/dataModel";
import { internal } from "../_generated/api";
import { fetchPaymentWithPreference } from "./mercadoPago";

async function close(ctx: ActionCtx, orderId: Id<"orders">): Promise<boolean> {
  const order = await ctx.runQuery(internal.orders.internal.getProviderOrder, {
    orderId,
  });
  if (!order) return false;
  if (order.checkoutState === "closed") return true;
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token || !order.externalPreferenceId) return false;
  let success = false;
  try {
    const response = await fetch(
      `https://api.mercadopago.com/checkout/preferences/${encodeURIComponent(order.externalPreferenceId)}`,
      {
        signal: AbortSignal.timeout(15000),
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          expires: true,
          expiration_date_to: new Date().toISOString(),
        }),
      },
    );
    success = response.ok;
  } catch {
    success = false;
  }
  await ctx.runMutation(internal.orders.internal.markPreferenceClosed, {
    orderId,
    success,
  });
  if (!success && order.closureAttempts < 5)
    await ctx.scheduler.runAfter(
      Math.min(300000, 1000 * 2 ** order.closureAttempts),
      internal.checkout.actions.closePreference,
      { orderId },
    );
  return success;
}
export const createPreference = action({
  args: {
    courseId: v.id("courses"),
    scheduleId: v.optional(v.id("schedules")),
    tier: v.union(v.literal("live"), v.literal("recorded")),
  },
  handler: async (
    ctx,
    args,
  ): Promise<{
    kind: "ready" | "preparing" | "processing";
    orderId: string;
    initPoint?: string;
  }> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError({ code: "UNAUTHENTICATED" });
    const token = process.env.MP_ACCESS_TOKEN;
    const site = process.env.SITE_URL?.replace(/\/$/, "");
    const convexSite = process.env.CONVEX_SITE_URL?.replace(/\/$/, "");
    if (!token || !site || !convexSite)
      throw new ConvexError({ code: "PAYMENT_NOT_CONFIGURED" });
    let reservation = await ctx.runMutation(
      internal.orders.internal.reserveCheckout,
      { ...args, userId },
    );
    if (reservation.kind === "close") {
      if (!(await close(ctx, reservation.order._id)))
        return { kind: "preparing", orderId: reservation.order._id };
      reservation = await ctx.runMutation(
        internal.orders.internal.reserveCheckout,
        { ...args, userId },
      );
    }
    if (reservation.kind !== "create")
      return {
        kind: reservation.kind === "processing" ? "processing" : "preparing",
        orderId: reservation.order._id,
      };
    const order = reservation.order;
    await ctx.scheduler.runAfter(
      61000,
      internal.checkout.actions.recoverCheckout,
      { orderId: order._id },
    );
    try {
      const response = await fetch(
        "https://api.mercadopago.com/checkout/preferences",
        {
          signal: AbortSignal.timeout(15000),
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Idempotency-Key": String(order._id),
          },
          body: JSON.stringify({
            items: [
              {
                id: String(order.courseId),
                title: `${order.courseTitle} (${order.tier})`,
                quantity: 1,
                currency_id: "ARS",
                unit_price: order.amountMinor / 100,
              },
            ],
            external_reference: String(order._id),
            back_urls: {
              success: `${site}/checkout/${order._id}`,
              failure: `${site}/checkout/${order._id}`,
              pending: `${site}/checkout/${order._id}`,
            },
            auto_return: "approved",
            notification_url: `${convexSite}/mercadopago-webhook`,
            expires: true,
            expiration_date_from: new Date().toISOString(),
            expiration_date_to: new Date(order.expiresAt!).toISOString(),
          }),
        },
      );
      if (!response.ok) {
        await ctx.runMutation(internal.orders.internal.creationFailed, {
          orderId: order._id,
          ambiguous: response.status >= 500,
        });
        return { kind: "preparing", orderId: order._id };
      }
      const preference = (await response.json()) as {
        id?: string;
        init_point?: string;
      };
      if (!preference.id || !preference.init_point)
        throw new Error("Incomplete preference");
      const url = await ctx.runMutation(
        internal.orders.internal.updateOrderPreference,
        {
          orderId: order._id,
          externalPreferenceId: preference.id,
          checkoutUrl: preference.init_point,
        },
      );
      return { kind: "ready", orderId: order._id, initPoint: url };
    } catch {
      await ctx.runMutation(internal.orders.internal.creationFailed, {
        orderId: order._id,
        ambiguous: true,
      });
      return { kind: "preparing", orderId: order._id };
    }
  },
});
export const closePreference = internalAction({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => await close(ctx, args.orderId),
});
export const retryOpenPreferenceClosures = internalAction({
  args: {},
  handler: async (ctx) => {
    const recoveries = await ctx.runQuery(
      internal.orders.internal.listRecoveries,
      {},
    );
    for (const orderId of recoveries)
      await ctx.scheduler.runAfter(
        0,
        internal.checkout.actions.recoverCheckout,
        { orderId },
      );
    const ids = await ctx.runQuery(internal.orders.internal.listClosures, {});
    for (const orderId of ids)
      await ctx.scheduler.runAfter(
        0,
        internal.checkout.actions.closePreference,
        { orderId },
      );
  },
});
async function reconcile(ctx: ActionCtx, paymentId: string) {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) throw new Error("Payment provider unavailable");
  const { payment, preferenceId } = await fetchPaymentWithPreference(
    token,
    paymentId,
  );
  if (
    String(payment.id) !== paymentId ||
    !payment.status ||
    !payment.external_reference ||
    typeof payment.transaction_amount !== "number" ||
    !payment.currency_id ||
    !payment.date_last_updated
  )
    throw new Error("Incomplete authoritative evidence");
  const updatedAt = Date.parse(payment.date_last_updated);
  const approvedAt = payment.date_approved
    ? Date.parse(payment.date_approved)
    : undefined;
  if (
    !Number.isFinite(updatedAt) ||
    (approvedAt !== undefined && !Number.isFinite(approvedAt))
  )
    throw new Error("Invalid provider timestamp");
  const result = await ctx.runMutation(
    internal.orders.internal.reconcilePayment,
    {
      orderId: payment.external_reference,
      externalPaymentId: paymentId,
      externalPreferenceId: preferenceId,
      status: payment.status,
      amountMinor: Math.round(payment.transaction_amount * 100),
      currency: payment.currency_id,
      payerEmail: payment.payer?.email,
      updatedAt,
      approvedAt,
      refundedMinor: Math.round(
        (payment.transaction_amount_refunded ?? 0) * 100,
      ),
    },
  );
  if (result.closePreference)
    await ctx.scheduler.runAfter(0, internal.checkout.actions.closePreference, {
      orderId: result.orderId,
    });
  return result;
}
export const processNotification = internalAction({
  args: { inboxId: v.id("paymentInbox") },
  handler: async (ctx, args) => {
    const row = await ctx.runQuery(
      internal.orders.internal.getNotification,
      args,
    );
    if (!row || row.state === "done") return;
    try {
      await reconcile(ctx, row.paymentId);
      await ctx.runMutation(internal.orders.internal.notificationResult, args);
    } catch {
      await ctx.runMutation(internal.orders.internal.notificationResult, {
        ...args,
        error: "No se pudo verificar el pago con el proveedor.",
      });
    }
  },
});
export const reconcilePaymentById = action({
  args: { paymentId: v.string() },
  handler: async (
    ctx,
    args,
  ): Promise<{
    orderId: string;
    status: string;
    enrolled: boolean;
    closePreference: boolean;
  }> => {
    const userId = await getAuthUserId(ctx);
    if (
      !userId ||
      (await ctx.runQuery(internal.orders.internal.getUserRole, { userId })) !==
        "admin"
    )
      throw new ConvexError({ code: "FORBIDDEN" });
    const result = await reconcile(ctx, args.paymentId);
    await ctx.runMutation(
      internal.orders.internal.resolveFailedNotifications,
      args,
    );
    return result;
  },
});

// Search by immutable reference after an ambiguous POST. Never repeat the POST blindly.
export const recoverCheckout = internalAction({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const order = await ctx.runQuery(
      internal.orders.internal.getProviderOrder,
      args,
    );
    if (
      !order ||
      !["uncertain", "creating"].includes(order.checkoutState) ||
      order.leaseUntil > Date.now() ||
      order.recoveryAttempts >= 6
    )
      return;
    const token = process.env.MP_ACCESS_TOKEN;
    let preferenceId: string | undefined;
    let confirmedAbsent = false;
    try {
      if (!token) throw new Error("Provider not configured");
      const response = await fetch(
        `https://api.mercadopago.com/checkout/preferences/search?external_reference=${encodeURIComponent(String(order._id))}`,
        {
          signal: AbortSignal.timeout(15000),
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!response.ok) throw new Error("Search failed");
      const body = (await response.json()) as {
        elements?: { id: string; external_reference: string }[];
        total?: number;
      };
      if (
        body.total === 1 &&
        body.elements?.length === 1 &&
        body.elements[0].external_reference === String(order._id)
      )
        preferenceId = body.elements[0].id;
      // Empty search results alone cannot prove that the provider never created the preference.
      // After the original deadline, its configured validity has ended even if indexing lagged.
      confirmedAbsent =
        body.total === 0 &&
        Array.isArray(body.elements) &&
        (order.expiresAt ?? Infinity) < Date.now();
    } catch {
      /* Retain uncertainty and escalate after bounded retries. */
    }
    await ctx.runMutation(internal.orders.internal.recoverPreference, {
      ...args,
      preferenceId,
      confirmedAbsent,
    });
    if (preferenceId) await close(ctx, order._id);
    else if (order.recoveryAttempts < 5)
      await ctx.scheduler.runAfter(
        Math.min(300000, 5000 * 2 ** order.recoveryAttempts),
        internal.checkout.actions.recoverCheckout,
        args,
      );
  },
});

export const retryCheckoutRecovery = action({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (
      !userId ||
      (await ctx.runQuery(internal.orders.internal.getUserRole, { userId })) !==
        "admin"
    )
      throw new ConvexError({ code: "FORBIDDEN" });
    await ctx.runMutation(internal.orders.internal.resetRecovery, args);
  },
});
