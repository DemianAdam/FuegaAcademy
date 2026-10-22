import { zQuery } from "../zod";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getCurrentUser = zQuery({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    const user = await ctx.db.get(userId);
    return user ?? null;
  },
});
