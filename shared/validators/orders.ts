import { z } from "zod";
import { zid } from "convex-helpers/server/zod4";
import type { Doc, Id } from "../../convex/_generated/dataModel";

export type OrderId = Id<"orders">;
export type OrderDoc = Doc<"orders">;
export type OrderInput = Omit<OrderDoc, "_id" | "_creationTime">;

export const orderValidator = z.object({
  userId: zid("users"),
  courseId: zid("courses"),
  scheduleId: zid("schedules").optional(),
  tier: z.enum(["live", "recorded"]),
  amount: z.number(),
  currency: z.string(),
  status: z.enum(["pending", "approved", "rejected", "refunded"]),
  provider: z.string(),
  externalPreferenceId: z.string().optional(),
  externalPaymentId: z.string().optional(),
});

export const createCheckoutSessionValidator = z.object({
  courseId: zid("courses"),
  scheduleId: zid("schedules").optional(),
  tier: z.enum(["live", "recorded"]),
});

export type CreateCheckoutSessionInput = z.infer<typeof createCheckoutSessionValidator>;
