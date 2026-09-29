import { zodOutputToConvex } from "convex-helpers/server/zod4";
import { defineTable } from "convex/server";
import { userValidator } from "./validators";

const schema = zodOutputToConvex(userValidator);

export const userSchema = defineTable(schema)
  .index("email", ["email"])
  .index("by_role", ["role"]);
