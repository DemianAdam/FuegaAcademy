import { customMutation, customQuery, NoOp } from "convex-helpers/server/customFunctions";
import { zCustomQuery, zCustomMutation } from "convex-helpers/server/zod4";
import { mutation as rawMutation, query as rawQuery } from "./_generated/server";
import { customCtx } from "convex-helpers/server/customFunctions";
import { triggersDB } from "./triggers";
import { getAuthUserId } from "@convex-dev/auth/server";

export const zQuery = zCustomQuery(rawQuery, NoOp);

const mutationWithTriggers = customMutation(rawMutation, customCtx(triggersDB));
export const zMutation = zCustomMutation(mutationWithTriggers, NoOp);

const adminContext = customCtx(async (ctx) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Unauthorized: Not logged in");
  }
  const user = await ctx.db.get(userId);
  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }
  return { userId, user };
});

const adminQuery = customQuery(rawQuery, adminContext);
export const zAdminQuery = zCustomQuery(adminQuery, NoOp);

const adminMutationRaw = customMutation(rawMutation, adminContext);
const adminMutationWithTriggers = customMutation(adminMutationRaw, customCtx(triggersDB));
export const zAdminMutation = zCustomMutation(adminMutationWithTriggers, NoOp);
