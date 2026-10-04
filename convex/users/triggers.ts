import { subscribeTrigger } from "../triggers";

subscribeTrigger("users", {
  insert: async (ctx, change) => {
    if (!change.newDoc.role) {
      await ctx.db.patch(change.id, { role: "student" });
    }
  },
});
