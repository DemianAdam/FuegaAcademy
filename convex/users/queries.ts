import { zQuery } from "../zod";
import { getAuthUserId } from "@convex-dev/auth/server";
import type { UserDoc } from "@shared/validators/users";

export const getCurrentUser = zQuery({
  args: {},
  handler: async (ctx): Promise<UserDoc | null> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    const user = await ctx.db.get(userId);
    return user ?? null;
  },
});
