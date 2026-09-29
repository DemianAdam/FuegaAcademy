import { internalMutation, internalQuery } from "../_generated/server";
import { v } from "convex/values";

export const getUserById = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

export const setUserRole = internalMutation({
  args: { userId: v.id("users"), role: v.union(v.literal("admin"), v.literal("student"), v.literal("teacher")) },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { role: args.role });
  },
});
