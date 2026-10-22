# Architecture Context

## System Shape

Fuega Academy is a React single-page application backed by Convex. The browser uses generated Convex APIs for application data and Convex Auth for identity. Convex actions and HTTP handlers integrate with Mercado Pago for checkout and signed webhook processing.

## Repository Boundaries

- `src/app/`: composition root, providers, routing, protected layouts, and top-level error boundaries.
- `src/pages/`: route entrypoints that compose features and layouts.
- `src/features/`: feature-owned behavior and UI, including course catalog and course administration.
- `src/components/ui/`: reusable Radix-based UI primitives.
- `src/components/`: cross-page presentation components and layouts that do not own backend contracts.
- `src/lib/`: frontend infrastructure such as authentication, theming, and the Convex client.
- `shared/`: environment-neutral Zod schemas, inferred types, and domain utilities shared by browser and backend code.
- `convex/`: database schema and all trusted server boundaries, organized by domain.

The `@/` alias points to `src/`; `@shared/` points to `shared/`.

## Domain and Data Boundaries

The Convex schema currently composes authentication, users, teachers, courses, modules, schedules, orders, and enrollments. Domain-specific schema and functions stay within their matching `convex/<domain>/` directory, while shared validation contracts live in `shared/validators/`.

Generated files under `convex/_generated/` are tool output and are never hand-edited.

## Primary Flows

### Authentication and routing

`src/app/AppProviders.tsx` installs Convex Auth, theme, routing, and application auth state. `src/app/AppRouter.tsx` separates public pages from student and administrator routes. Convex remains responsible for enforcing authorization for all protected data and mutations.

### Catalog and administration

Public pages query published catalog data. Administrator features create and update domain records through authenticated Convex functions. Shared Zod contracts keep browser inputs and backend validation aligned.

### Checkout and enrollment

The backend derives trusted pricing and schedule information, creates a Mercado Pago preference, stores an immutable order snapshot, and receives provider notifications through a Convex HTTP endpoint. A valid signature alone is insufficient: authoritative payment data must match the order before an idempotent reconciliation creates enrollment and updates capacity.

## Architectural Invariants

- Server-side authorization protects every privileged operation.
- Browser input, redirect parameters, and webhook payloads are untrusted.
- Public queries expose only intentionally public data.
- Shared contracts remain runtime-safe in both browser and Convex environments.
- Order snapshots, payment reconciliation, enrollment uniqueness, and schedule capacity remain consistent across webhook retries.
- Backend-only secrets never enter the Vite client bundle.
- New behavior should live in an owning feature or domain rather than expanding generic components into feature containers.

## Decisions That Require an ADR

Record changes to authentication, authorization, persistence boundaries, payment providers, currency representation, routing strategy, internationalization strategy, shared-contract ownership, or major framework/infrastructure choices in `specs/decisions/`.
