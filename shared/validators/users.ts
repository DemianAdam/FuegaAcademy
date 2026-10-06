import { z } from "zod";
import type { Doc, Id } from "../../convex/_generated/dataModel";

export type UserId = Id<"users">;
export type UserDoc = Doc<"users">;

export const userRolesValidator = z.enum(["admin", "student"]);

export const userValidator = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  emailVerificationTime: z.number().optional(),
  image: z.string().optional(),
  phone: z.string().optional(),
  isAnonymous: z.boolean().optional(),
  role: userRolesValidator.optional(),
});
  
export const userInputValidator = userValidator;