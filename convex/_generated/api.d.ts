/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as courses_mutations from "../courses/mutations.js";
import type * as courses_queries from "../courses/queries.js";
import type * as courses_seed from "../courses/seed.js";
import type * as courses_validators from "../courses/validators.js";
import type * as enrollments_mutations from "../enrollments/mutations.js";
import type * as enrollments_queries from "../enrollments/queries.js";
import type * as enrollments_validators from "../enrollments/validators.js";
import type * as http from "../http.js";
import type * as languages_mutations from "../languages/mutations.js";
import type * as languages_queries from "../languages/queries.js";
import type * as languages_validators from "../languages/validators.js";
import type * as modules_validators from "../modules/validators.js";
import type * as schedules_validators from "../schedules/validators.js";
import type * as teachers_mutations from "../teachers/mutations.js";
import type * as teachers_queries from "../teachers/queries.js";
import type * as teachers_seed from "../teachers/seed.js";
import type * as teachers_validators from "../teachers/validators.js";
import type * as translations_mutations from "../translations/mutations.js";
import type * as translations_queries from "../translations/queries.js";
import type * as translations_validators from "../translations/validators.js";
import type * as triggers from "../triggers.js";
import type * as users_internal from "../users/internal.js";
import type * as users_queries from "../users/queries.js";
import type * as users_validators from "../users/validators.js";
import type * as zod from "../zod.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  "courses/mutations": typeof courses_mutations;
  "courses/queries": typeof courses_queries;
  "courses/seed": typeof courses_seed;
  "courses/validators": typeof courses_validators;
  "enrollments/mutations": typeof enrollments_mutations;
  "enrollments/queries": typeof enrollments_queries;
  "enrollments/validators": typeof enrollments_validators;
  http: typeof http;
  "languages/mutations": typeof languages_mutations;
  "languages/queries": typeof languages_queries;
  "languages/validators": typeof languages_validators;
  "modules/validators": typeof modules_validators;
  "schedules/validators": typeof schedules_validators;
  "teachers/mutations": typeof teachers_mutations;
  "teachers/queries": typeof teachers_queries;
  "teachers/seed": typeof teachers_seed;
  "teachers/validators": typeof teachers_validators;
  "translations/mutations": typeof translations_mutations;
  "translations/queries": typeof translations_queries;
  "translations/validators": typeof translations_validators;
  triggers: typeof triggers;
  "users/internal": typeof users_internal;
  "users/queries": typeof users_queries;
  "users/validators": typeof users_validators;
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
