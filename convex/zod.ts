import { customMutation, customQuery, NoOp } from "convex-helpers/server/customFunctions";
import { zCustomQuery, zCustomMutation } from "convex-helpers/server/zod4";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { mutation as rawMutation, query as rawQuery } from "./_generated/server";
import { customCtx } from "convex-helpers/server/customFunctions";
import { triggersDB } from "./triggers";
import { getAuthUserId } from "@convex-dev/auth/server";

export const zQuery = zCustomQuery(rawQuery, NoOp);

const mutationWithTriggers = customMutation(rawMutation, customCtx(triggersDB));
export const zMutation = zCustomMutation(mutationWithTriggers, NoOp);

const adminContext = {
  args: {},
  input: async (ctx: QueryCtx | MutationCtx, args: Record<string, any>) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized: Not logged in");
    }
    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }
    return {
      ctx: { userId, user },
      args,
    };
  },
};

export const zAdminQuery = zCustomQuery(rawQuery, adminContext);

const adminMutationRaw = customMutation(rawMutation, customCtx(triggersDB));
export const zAdminMutation = zCustomMutation(adminMutationRaw, adminContext);

const studentContext = {
  args: {},
  input: async (ctx: QueryCtx | MutationCtx, args: Record<string, any>) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized: Not logged in");
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("Unauthorized: User not found");
    }
    return {
      ctx: { userId, user },
      args,
    };
  },
};

export const zStudentQuery = zCustomQuery(rawQuery, studentContext);

const studentMutationRaw = customMutation(rawMutation, customCtx(triggersDB));
export const zStudentMutation = zCustomMutation(studentMutationRaw, studentContext);
