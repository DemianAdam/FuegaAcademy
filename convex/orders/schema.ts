import { defineTable } from "convex/server";
import { zodOutputToConvex } from "convex-helpers/server/zod";
import { orderValidator } from "@shared/validators/orders";

export const orderSchema = defineTable(zodOutputToConvex(orderValidator))
  .index("by_user", ["userId"])
  .index("by_course", ["courseId"])
  .index("by_status", ["status"])
  .index("by_external_preference", ["externalPreferenceId"])
  .index("by_external_payment", ["externalPaymentId"]);
