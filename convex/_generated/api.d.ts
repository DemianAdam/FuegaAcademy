/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as courses_validators from "../courses/validators.js";
import type * as mentors_validators from "../mentors/validators.js";
import type * as modules_validators from "../modules/validators.js";
import type * as schedules_validators from "../schedules/validators.js";
import type * as teachers_mutations from "../teachers/mutations.js";
import type * as teachers_queries from "../teachers/queries.js";
import type * as teachers_seed from "../teachers/seed.js";
import type * as teachers_validators from "../teachers/validators.js";
import type * as triggers from "../triggers.js";
import type * as zod from "../zod.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "courses/validators": typeof courses_validators;
  "mentors/validators": typeof mentors_validators;
  "modules/validators": typeof modules_validators;
  "schedules/validators": typeof schedules_validators;
  "teachers/mutations": typeof teachers_mutations;
  "teachers/queries": typeof teachers_queries;
  "teachers/seed": typeof teachers_seed;
  "teachers/validators": typeof teachers_validators;
  triggers: typeof triggers;
  zod: typeof zod;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
