import { zInternalMutation } from "../zod";
import { setUserRoleValidator } from "./validators";

export const setUserRole = zInternalMutation({
  args: setUserRoleValidator,
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { role: args.role });
  },
});
