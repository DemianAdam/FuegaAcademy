import type { InsertOperation } from "../triggers";

export const userTriggers: {
  insert?: InsertOperation<"users">;
} = {
  insert: async (ctx, change) => {
    if (!change.newDoc.role) {
      await ctx.db.patch(change.id, { role: "student" });
    }
  },
};
