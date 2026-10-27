/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as analytics_queries from "../analytics/queries.js";
import type * as auth from "../auth.js";
import type * as checkout_actions from "../checkout/actions.js";
import type * as checkout_mercadoPago from "../checkout/mercadoPago.js";
import type * as courses_migrations from "../courses/migrations.js";
import type * as courses_mutations from "../courses/mutations.js";
import type * as courses_queries from "../courses/queries.js";
import type * as courses_seed from "../courses/seed.js";
import type * as courses_validators from "../courses/validators.js";
import type * as crons from "../crons.js";
import type * as enrollments_queries from "../enrollments/queries.js";
import type * as enrollments_validators from "../enrollments/validators.js";
import type * as finalProjects_mutations from "../finalProjects/mutations.js";
import type * as finalProjects_queries from "../finalProjects/queries.js";
import type * as http from "../http.js";
import type * as media_mutations from "../media/mutations.js";
import type * as modules_validators from "../modules/validators.js";
import type * as orders_internal from "../orders/internal.js";
import type * as orders_maintenance from "../orders/maintenance.js";
import type * as orders_queries from "../orders/queries.js";
import type * as orders_validators from "../orders/validators.js";
import type * as schedules_validators from "../schedules/validators.js";
import type * as teachers_mutations from "../teachers/mutations.js";
import type * as teachers_queries from "../teachers/queries.js";
import type * as teachers_seed from "../teachers/seed.js";
import type * as teachers_validators from "../teachers/validators.js";
import type * as triggers from "../triggers.js";
import type * as users_queries from "../users/queries.js";
import type * as users_validators from "../users/validators.js";
import type * as zod from "../zod.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "analytics/queries": typeof analytics_queries;
  auth: typeof auth;
  "checkout/actions": typeof checkout_actions;
  "checkout/mercadoPago": typeof checkout_mercadoPago;
  "courses/migrations": typeof courses_migrations;
  "courses/mutations": typeof courses_mutations;
  "courses/queries": typeof courses_queries;
  "courses/seed": typeof courses_seed;
  "courses/validators": typeof courses_validators;
  crons: typeof crons;
  "enrollments/queries": typeof enrollments_queries;
  "enrollments/validators": typeof enrollments_validators;
  "finalProjects/mutations": typeof finalProjects_mutations;
  "finalProjects/queries": typeof finalProjects_queries;
  http: typeof http;
  "media/mutations": typeof media_mutations;
  "modules/validators": typeof modules_validators;
  "orders/internal": typeof orders_internal;
  "orders/maintenance": typeof orders_maintenance;
  "orders/queries": typeof orders_queries;
  "orders/validators": typeof orders_validators;
  "schedules/validators": typeof schedules_validators;
  "teachers/mutations": typeof teachers_mutations;
  "teachers/queries": typeof teachers_queries;
  "teachers/seed": typeof teachers_seed;
  "teachers/validators": typeof teachers_validators;
  triggers: typeof triggers;
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
