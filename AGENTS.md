# Fuega Academy Agent Instructions

## Communication

- Always reply in English, even when the user writes in another language.
- State assumptions and report verification results accurately. Never claim a check passed when it was not run or did not complete.

## Spec-Driven Development

The repository follows the lifecycle `draft -> approved -> implemented -> verified`. The process and templates are defined in [`specs/README.md`](specs/README.md).

Before changing product behavior, runtime code, schemas, APIs, or externally visible configuration:

1. Read `specs/README.md` and the documents in `specs/_meta/`.
2. Create a change package under `specs/changes/` from `specs/changes/_template/`.
3. Keep the change in `draft` while its requirements, acceptance criteria, and design are being discussed. Do not implement it yet.
4. Move it to `approved` only after explicit user or product-owner approval.
5. Create or complete `tasks.md` from the change template to map approved requirements to ordered implementation and verification work.
6. Implement against the approved requirements and tasks, and record any material design decision in `specs/decisions/`.
7. Mark tasks complete only with linked implementation or verification evidence; then mark the change `implemented` when the code and applicable automated checks are complete.
8. Mark it `verified` only after every requirement has recorded evidence in `verification.md`.

Task files are implementation plans, not a substitute for requirements or verification evidence. Do not begin runtime implementation while the specification remains `draft`.

Documentation-only maintenance that does not change product behavior may be performed directly when explicitly requested. If implementation needs to depart from an approved spec, return the spec to `draft`, document the change, and obtain approval again.

## Current Product and Architecture

- The MVP is a Spanish-only course platform for students and administrators.
- The frontend uses React 19, TypeScript, Vite, React Router, Tailwind CSS, and Radix UI primitives.
- `src/app/` owns application composition, providers, routing, guards, and top-level error handling.
- `src/features/` owns feature behavior and feature-specific UI.
- `src/components/ui/` contains reusable UI primitives; generic frontend helpers belong in `src/shared/` or `src/lib/` as appropriate.
- `shared/` contains transport-safe Zod schemas, types, and domain utilities shared by the frontend and Convex.
- `convex/` contains the backend schema, queries, mutations, actions, HTTP handlers, authentication, and internal functions.
- `@/` resolves to `src/`, and `@shared/` resolves to `shared/`.

Do not restore the removed multilingual URL, translation-table, or `.opencode` agent architecture unless a newly approved specification explicitly reintroduces it.

## Backend and Commerce Invariants

- Enforce authorization on the server. Client-side route guards are not a security boundary.
- Mercado Pago is the only payment provider in the current scope.
- Prices and immutable order snapshots use integer ARS minor units.
- Never grant enrollment from a browser return URL. Enrollment is created only after a signed webhook and authoritative payment reconciliation succeed.
- Payment reconciliation must validate external reference, amount, currency, preference, payer, and approved status, and it must remain idempotent.
- Never expose backend credentials through a `VITE_` variable or commit tokens, webhook secrets, OAuth state, or user-scoped MCP configuration.
- Do not edit files under `convex/_generated/` manually; regenerate them through Convex tooling when an approved implementation requires it.

## Commands and Verification

- Development server: `npm run dev`
- ESLint: `npm run lint`
- Oxlint: `npm run lint:ox`
- Unit tests: `npm run test`
- Typecheck and production build: `npm run build`
- Bundle budget: `npm run test:bundle`
- End-to-end tests: `npm run test:e2e`
- Deterministic aggregate gate: `npm run check`

Run the smallest relevant checks while iterating and the full applicable gate before declaring a change implemented. Playwright requires a reachable development Convex deployment and must never perform a real payment.

## Working Safely

- Preserve unrelated user changes in a dirty worktree.
- Keep shared contracts in `shared/` synchronized with their Convex consumers.
- Prefer feature ownership over adding new behavior to generic component directories.
- Record durable, cross-cutting architectural choices as ADRs; do not use ADRs for routine implementation details.
