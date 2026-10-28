import { defineTable } from "convex/server";
import { v } from "convex/values";
export const paymentSchema = defineTable({
  orderId: v.id("orders"),
  externalPaymentId: v.string(),
  status: v.string(),
  amountMinor: v.number(),
  currency: v.string(),
  preferenceId: v.optional(v.string()),
  payerEmail: v.optional(v.string()),
  updatedAt: v.number(),
  approvedAt: v.optional(v.number()),
  refundedMinor: v.number(),
  exception: v.optional(v.string()),
  signed: v.boolean(),
})
  .index("by_payment", ["externalPaymentId"])
  .index("by_order", ["orderId"]);
export const inboxSchema = defineTable({
  paymentId: v.string(),
  attempts: v.number(),
  state: v.union(v.literal("pending"), v.literal("done"), v.literal("failed")),
  error: v.optional(v.string()),
}).index("by_payment", ["paymentId"]);
