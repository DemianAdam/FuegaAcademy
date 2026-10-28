import { internalMutation, internalQuery } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { internal } from "../_generated/api";
import { tierIsActive } from "@shared/courseCommerce";
import { getPaymentMismatch } from "@shared/payments/checkoutRules";

const fail = (code: string) => {
  throw new ConvexError({ code, message: code });
};
export const reserveCheckout = internalMutation({
  args: {
    userId: v.id("users"),
    courseId: v.id("courses"),
    scheduleId: v.optional(v.id("schedules")),
    tier: v.union(v.literal("live"), v.literal("recorded")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const user = await ctx.db.get(args.userId);
    if (user?.role !== "student") return fail("FORBIDDEN");
    const course = await ctx.db.get(args.courseId);
    if (
      !course ||
      course.status !== "published" ||
      !tierIsActive(course.format, args.tier)
    )
      return fail("COURSE_UNAVAILABLE");
    const runs = await ctx.db
      .query("enrollments")
      .withIndex("by_user_course", (q) =>
        q.eq("userId", args.userId).eq("courseId", args.courseId),
      )
      .collect();
    if (runs.some((e) => e.status === "active"))
      return fail("ALREADY_ENROLLED");
    const orders = (
      await ctx.db
        .query("orders")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .collect()
    ).filter((o) => o.courseId === args.courseId);
    for (const order of orders) {
      const payments = await ctx.db
        .query("paymentAttempts")
        .withIndex("by_order", (q) => q.eq("orderId", order._id))
        .collect();
      if (payments.some((p) => p.exception)) return fail("PAYMENT_REVIEW");
      if (
        payments.some((p) =>
          ["pending", "in_process", "authorized"].includes(p.status),
        )
      )
        return { kind: "processing" as const, order };
      if (order.checkoutState !== "closed") {
        if (order.checkoutState === "creating" && order.leaseUntil > now)
          return { kind: "preparing" as const, order };
        if (!order.externalPreferenceId) {
          await ctx.db.patch(order._id, {
            checkoutState: "uncertain",
            failureReason: "La creación del checkout necesita verificación.",
          });
          return { kind: "preparing" as const, order };
        }
        await ctx.db.patch(order._id, {
          checkoutState: "closing",
          superseded: true,
        });
        return { kind: "close" as const, order };
      }
    }
    const exams = await ctx.db
      .query("exams")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .collect();
    const exam = exams
      .filter((e) => e.published)
      .sort((a, b) => b.version - a.version)[0];
    if (!exam) return fail("EXAM_NOT_READY");
    const price = course.pricing[args.tier];
    if (
      !price ||
      !Number.isSafeInteger(price.amountMinor) ||
      !price.amountMinor ||
      price.amountMinor <= 0 ||
      price.currency !== "ARS"
    )
      return fail("INVALID_PRICE");
    let expiresAt = now + 24 * 60 * 60 * 1000;
    if (args.tier === "live") {
      const schedule = args.scheduleId && (await ctx.db.get(args.scheduleId));
      if (
        !schedule ||
        schedule.courseId !== args.courseId ||
        schedule.isArchived ||
        schedule.startsAt <= now
      )
        return fail("SCHEDULE_UNAVAILABLE");
      const holds = (
        await ctx.db
          .query("orders")
          .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
          .collect()
      ).filter(
        (o) =>
          o.scheduleId === schedule._id &&
          o.status === "pending" &&
          !o.superseded &&
          o.checkoutState !== "closed" &&
          (o.expiresAt ?? 0) > now,
      );
      if (schedule.enrolledCount + holds.length >= schedule.capacity)
        return fail("SCHEDULE_FULL");
      expiresAt = Math.min(now + 30 * 60 * 1000, schedule.startsAt);
    } else if (args.scheduleId) return fail("INVALID_SCHEDULE");
    const orderId = await ctx.db.insert("orders", {
      ...args,
      amountMinor: price.amountMinor,
      currency: "ARS",
      status: "pending",
      provider: "mercadopago",
      courseTitle: course.title,
      courseSlug: course.slug,
      expiresAt,
      runNumber: Math.max(0, ...runs.map((r) => r.runNumber)) + 1,
      examId: exam._id,
      checkoutState: "creating",
      leaseUntil: now + 60000,
      superseded: false,
      closureAttempts: 0,
      recoveryAttempts: 0,
    });
    const order = await ctx.db.get(orderId);
    if (!order) return fail("ORDER_NOT_FOUND");
    return { kind: "create" as const, order };
  },
});
export const updateOrderPreference = internalMutation({
  args: {
    orderId: v.id("orders"),
    externalPreferenceId: v.string(),
    checkoutUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order || order.checkoutState !== "creating")
      return fail("ORDER_UNAVAILABLE");
    await ctx.db.patch(order._id, {
      externalPreferenceId: args.externalPreferenceId,
      checkoutUrl: args.checkoutUrl,
      checkoutState: "ready",
    });
    return args.checkoutUrl;
  },
});
export const creationFailed = internalMutation({
  args: { orderId: v.id("orders"), ambiguous: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, {
      checkoutState: args.ambiguous ? "uncertain" : "closed",
      status: args.ambiguous ? "pending" : "rejected",
      failureReason: args.ambiguous
        ? "Creación de checkout sin respuesta confirmada."
        : "No se pudo iniciar el pago.",
    });
  },
});
export const getProviderOrder = internalQuery({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => await ctx.db.get(args.orderId),
});
export const markPreferenceClosed = internalMutation({
  args: { orderId: v.id("orders"), success: v.boolean() },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) return;
    await ctx.db.patch(order._id, {
      closureAttempts: order.closureAttempts + 1,
      ...(args.success
        ? {
            checkoutState: "closed" as const,
            preferenceClosedAt: Date.now(),
            preferenceClosureStatus: "closed" as const,
            status:
              order.status === "pending" ? ("expired" as const) : order.status,
          }
        : { failureReason: "No se pudo cerrar el checkout." }),
    });
  },
});
export const listClosures = internalQuery({
  args: {},
  handler: async (ctx) =>
    (await ctx.db.query("orders").collect())
      .filter(
        (o) =>
          o.externalPreferenceId &&
          o.checkoutState !== "closed" &&
          o.closureAttempts < 6 &&
          (o.checkoutState === "closing" ||
            o.status !== "pending" ||
            (o.expiresAt ?? 0) <= Date.now()),
      )
      .map((o) => o._id),
});
export const getUserRole = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => (await ctx.db.get(args.userId))?.role ?? null,
});

export const acceptNotification = internalMutation({
  args: { paymentId: v.string() },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("paymentInbox", {
      paymentId: args.paymentId,
      attempts: 0,
      state: "pending",
    });
    await ctx.scheduler.runAfter(
      0,
      internal.checkout.actions.processNotification,
      { inboxId: id },
    );
    return id;
  },
});
export const getNotification = internalQuery({
  args: { inboxId: v.id("paymentInbox") },
  handler: async (ctx, args) => await ctx.db.get(args.inboxId),
});
export const notificationResult = internalMutation({
  args: { inboxId: v.id("paymentInbox"), error: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const row = await ctx.db.get(args.inboxId);
    if (!row || row.state === "done") return;
    const attempts = row.attempts + 1;
    await ctx.db.patch(row._id, {
      attempts,
      state: args.error ? (attempts >= 6 ? "failed" : "pending") : "done",
      error: args.error,
    });
    if (args.error && attempts < 6)
      await ctx.scheduler.runAfter(
        Math.min(300000, 1000 * 2 ** attempts),
        internal.checkout.actions.processNotification,
        { inboxId: row._id },
      );
  },
});
export const signedEvidence = internalQuery({
  args: { paymentId: v.string() },
  handler: async (ctx, args) =>
    !!(await ctx.db
      .query("paymentInbox")
      .withIndex("by_payment", (q) => q.eq("paymentId", args.paymentId))
      .first()),
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
    updatedAt: v.number(),
    approvedAt: v.optional(v.number()),
    refundedMinor: v.number(),
  },
  handler: async (ctx, args) => {
    const orderId = ctx.db.normalizeId("orders", args.orderId);
    if (!orderId) return fail("ORDER_NOT_FOUND");
    const order = await ctx.db.get(orderId);
    if (!order) return fail("ORDER_NOT_FOUND");
    const signed = !!(await ctx.db
      .query("paymentInbox")
      .withIndex("by_payment", (q) => q.eq("paymentId", args.externalPaymentId))
      .first());
    const prior = await ctx.db
      .query("paymentAttempts")
      .withIndex("by_payment", (q) =>
        q.eq("externalPaymentId", args.externalPaymentId),
      )
      .unique();
    if (prior && prior.orderId !== orderId)
      return fail("PAYMENT_OWNER_MISMATCH");
    const result = (status: string, enrolled = false) => ({
      orderId,
      status,
      enrolled,
      closePreference: status === "approved" || status === "review",
    });
    if (
      prior &&
      (args.updatedAt < prior.updatedAt ||
        (["refunded", "charged_back"].includes(prior.status) &&
          !["refunded", "charged_back"].includes(args.status)) ||
        (prior.status === "approved" &&
          [
            "pending",
            "in_process",
            "rejected",
            "cancelled",
            "authorized",
          ].includes(args.status)))
    )
      return result(order.status, order.status === "approved");
    const paymentData = {
      orderId,
      externalPaymentId: args.externalPaymentId,
      status: args.status,
      amountMinor: args.amountMinor,
      currency: args.currency,
      preferenceId: args.externalPreferenceId,
      payerEmail: args.payerEmail,
      updatedAt: args.updatedAt,
      approvedAt: args.approvedAt,
      refundedMinor: args.refundedMinor,
      signed,
    };
    const paymentId = prior
      ? prior._id
      : await ctx.db.insert("paymentAttempts", paymentData);
    if (prior) await ctx.db.patch(paymentId, paymentData);
    const review = async (reason: string) => {
      await ctx.db.patch(paymentId, { exception: reason });
      if (order.status !== "approved")
        await ctx.db.patch(orderId, {
          status: "review",
          failureReason: reason,
        });
      return result("review");
    };
    // Declined/pending attempts do not require payer evidence and must not create paid exceptions.
    if (
      !["approved", "refunded", "charged_back"].includes(args.status) &&
      args.refundedMinor === 0
    )
      return result(order.status);
    const mismatch = getPaymentMismatch({
      expectedAmountMinor: order.amountMinor,
      expectedCurrency: order.currency,
      expectedPreferenceId: order.externalPreferenceId,
      amountMinor: args.amountMinor,
      currency: args.currency,
      preferenceId: args.externalPreferenceId,
      payerEmail: args.payerEmail,
    });
    const verifiedReversalOfKnownCharge =
      ["refunded", "charged_back"].includes(args.status) &&
      prior &&
      signed &&
      prior.amountMinor === args.amountMinor &&
      prior.currency === args.currency &&
      prior.preferenceId === args.externalPreferenceId;
    if (
      (mismatch || !order.externalPreferenceId) &&
      !verifiedReversalOfKnownCharge
    )
      return await review(mismatch ?? "PREFERENCE_MISSING");
    const enrollment = await ctx.db
      .query("enrollments")
      .withIndex("by_order", (q) => q.eq("orderId", orderId))
      .unique();
    if (args.status === "refunded" || args.status === "charged_back") {
      if (args.status === "refunded" && args.refundedMinor < args.amountMinor)
        return await review("PARTIAL_REFUND");
      await ctx.db.patch(paymentId, { exception: undefined });
      if (
        enrollment?.fundingPaymentId === paymentId &&
        enrollment.status !== "revoked"
      ) {
        if (enrollment.scheduleId) {
          const schedule = await ctx.db.get(enrollment.scheduleId);
          if (
            schedule &&
            schedule.startsAt > Date.now() &&
            schedule.enrolledCount > 0
          )
            await ctx.db.patch(schedule._id, {
              enrolledCount: schedule.enrolledCount - 1,
            });
        }
        await ctx.db.patch(enrollment._id, { status: "revoked" });
        await ctx.db.patch(orderId, { status: args.status });
      } else if (!enrollment)
        await ctx.db.patch(orderId, { status: args.status });
      return result(args.status);
    }
    if (args.refundedMinor > 0) return await review("PARTIAL_REFUND");
    if (args.status !== "approved") return result(order.status);
    if (!signed) return await review("SIGNED_NOTIFICATION_REQUIRED");
    if (enrollment) {
      if (enrollment.fundingPaymentId === paymentId) {
        await ctx.db.patch(paymentId, { exception: undefined });
        return result("approved", enrollment.status === "active");
      }
      return await review("DUPLICATE_CHARGE");
    }
    if (order.superseded) return await review("SUPERSEDED_CHECKOUT");
    const runs = await ctx.db
      .query("enrollments")
      .withIndex("by_user_course", (q) =>
        q.eq("userId", order.userId).eq("courseId", order.courseId),
      )
      .collect();
    if (
      runs.some((e) => e.status === "active" || e.runNumber >= order.runNumber)
    )
      return await review("DUPLICATE_RUN");
    if (order.scheduleId) {
      const schedule = await ctx.db.get(order.scheduleId);
      if (!schedule || schedule.courseId !== order.courseId)
        return await review("SCHEDULE_UNAVAILABLE");
      if (!args.approvedAt || args.approvedAt >= schedule.startsAt)
        return await review("LATE_APPROVAL");
      const holds = (
        await ctx.db
          .query("orders")
          .withIndex("by_course", (q) => q.eq("courseId", order.courseId))
          .collect()
      ).filter(
        (o) =>
          o._id !== orderId &&
          o.scheduleId === order.scheduleId &&
          o.status === "pending" &&
          !o.superseded &&
          o.checkoutState !== "closed" &&
          (o.expiresAt ?? 0) > Date.now(),
      );
      if (schedule.enrolledCount + holds.length >= schedule.capacity)
        return await review("SCHEDULE_FULL");
      await ctx.db.patch(schedule._id, {
        enrolledCount: schedule.enrolledCount + 1,
      });
    }
    await ctx.db.insert("enrollments", {
      userId: order.userId,
      courseId: order.courseId,
      scheduleId: order.scheduleId,
      orderId,
      fundingPaymentId: paymentId,
      examId: order.examId,
      tier: order.tier,
      runNumber: order.runNumber,
      status: "active",
      completedClasses: 0,
      completedLessonIds: [],
      attemptNumber: 1,
      retryOpen: true,
    });
    await ctx.db.patch(paymentId, { exception: undefined });
    await ctx.db.patch(orderId, {
      status: "approved",
      externalPaymentId: args.externalPaymentId,
      preferenceClosureStatus: "pending",
    });
    return result("approved", true);
  },
});

export const recoverPreference = internalMutation({
  args: {
    orderId: v.id("orders"),
    preferenceId: v.optional(v.string()),
    confirmedAbsent: v.boolean(),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order || !["creating", "uncertain"].includes(order.checkoutState))
      return;
    await ctx.db.patch(order._id, {
      recoveryAttempts: order.recoveryAttempts + 1,
      ...(args.preferenceId
        ? {
            externalPreferenceId: args.preferenceId,
            checkoutState: "closing" as const,
            superseded: true,
          }
        : args.confirmedAbsent
          ? { checkoutState: "closed" as const, status: "rejected" as const }
          : { checkoutState: "uncertain" as const }),
    });
  },
});
export const listRecoveries = internalQuery({
  args: {},
  handler: async (ctx) =>
    (await ctx.db.query("orders").collect())
      .filter(
        (o) =>
          ["creating", "uncertain"].includes(o.checkoutState) &&
          o.leaseUntil <= Date.now() &&
          o.recoveryAttempts < 6,
      )
      .map((o) => o._id),
});

export const resolveFailedNotifications = internalMutation({
  args: { paymentId: v.string() },
  handler: async (ctx, args) => {
    for (const row of await ctx.db
      .query("paymentInbox")
      .withIndex("by_payment", (q) => q.eq("paymentId", args.paymentId))
      .collect())
      if (row.state === "failed")
        await ctx.db.patch(row._id, { state: "done", error: undefined });
  },
});
export const resetRecovery = internalMutation({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order || order.checkoutState === "closed") return;
    await ctx.db.patch(order._id, {
      recoveryAttempts: 0,
      closureAttempts: 0,
      leaseUntil: Date.now(),
    });
    if (order.externalPreferenceId)
      await ctx.scheduler.runAfter(
        0,
        internal.checkout.actions.closePreference,
        args,
      );
    else
      await ctx.scheduler.runAfter(
        0,
        internal.checkout.actions.recoverCheckout,
        args,
      );
  },
});
