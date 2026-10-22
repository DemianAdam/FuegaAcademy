import { customMutation, NoOp } from "convex-helpers/server/customFunctions";
import { zCustomQuery, zCustomMutation } from "convex-helpers/server/zod4";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { internalMutation, mutation as rawMutation, query as rawQuery } from "./_generated/server";
import { customCtx } from "convex-helpers/server/customFunctions";
import { triggersDB } from "./triggers";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from 'convex/values';

export const zQuery = zCustomQuery(rawQuery, NoOp);

export const zInternalMutation = zCustomMutation(internalMutation, customCtx(triggersDB));


const mutationWithTriggers = customMutation(rawMutation, customCtx(triggersDB));
export const zMutation = zCustomMutation(mutationWithTriggers, NoOp);

const adminContext = {
  args: {},
  input: async (ctx: QueryCtx | MutationCtx, args: Record<string, unknown>) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError({ code: 'UNAUTHENTICATED', message: 'Sign in to continue.' });
    }
    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") {
      throw new ConvexError({ code: 'FORBIDDEN', message: 'Administrator access is required.' });
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
  input: async (ctx: QueryCtx | MutationCtx, args: Record<string, unknown>) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError({ code: 'UNAUTHENTICATED', message: 'Sign in to continue.' });
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new ConvexError({ code: 'USER_NOT_FOUND', message: 'The authenticated user was not found.' });
    }
    if (user.role !== 'student') {
      throw new ConvexError({ code: 'FORBIDDEN', message: 'Student access is required.' });
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
