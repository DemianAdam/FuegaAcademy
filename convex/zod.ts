import { customMutation, NoOp } from "convex-helpers/server/customFunctions";
import { zCustomQuery, zCustomMutation } from "convex-helpers/server/zod4";
import { mutation as rawMutation, query as rawQuery } from "./_generated/server";
import { customCtx } from "convex-helpers/server/customFunctions";
import { triggersDB } from "./triggers";

export const zQuery = zCustomQuery(rawQuery, NoOp);

const mutationWithTriggers = customMutation(rawMutation, customCtx(triggersDB));
export const zMutation = zCustomMutation(mutationWithTriggers, NoOp);
