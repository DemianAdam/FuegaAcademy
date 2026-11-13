# Design: Manual testing readiness

## Technical summary

Transcription of the owner-approved plan: add an internal, additive fixture mutation plus a local Node command; preserve the public application interfaces and existing commerce behavior.

## Interfaces and data

- Internal `manualTesting/seed:prepare({ session })` returns teacher/course/cohort IDs and slugs. Session is lowercase kebab text, 3–40 characters. A runtime deployment-origin guard permits only the intended development backend.
- `npm run prepare:manual -- --session <session> [--dry-run]` reads local Vite configuration using Vite's installed environment loader. It checks `CONVEX_DEPLOYMENT=dev:canny-raven-235`, `VITE_CONVEX_URL=https://canny-raven-235.convex.cloud`, process-level target overrides, and CLI-resolved development URL before explicitly invoking `--deployment dev`. Dry-run performs checks without running the mutation. Extra arguments fail closed.
- Fixture slugs use `manual-<session>-...`. Creation is one transaction. An existing teacher namespace with both expected courses returns their existing IDs without any writes; partial namespaces fail. Cohort IDs are returned from current data, so later admin edits remain authoritative.
- Hybrid price: ARS 1,500 live / ARS 1,000 recorded (150000 / 100000 minor units); recorded quiz price: ARS 1,000. Cohorts start 30 days ahead (capacity 10), 31 days ahead (capacity 1), and one day behind (capacity 10), measured at first creation only.
- Each course has two modules with two stable lessons. Quiz has ten equal-weight yes/no questions; the first option is correct. The hybrid course has a manual exam. Example.com links are explicitly sample links, not hosted teaching content. Fixture images use the canonical backend `SITE_URL`, which must be a public HTTPS origin before creation. The owner uploads `public/images/hero-background.jpg` as private material through the admin UI.

## Failure and security behavior

The mutation is internal, guarded by the built-in deployment origin, and has no password, enrollment or payment writes. The CLI does not accept a deployment argument, execute shell-built user input, or print credentials. Concurrent same-session mutations serialize through indexed reads. Missing/colliding namespaces abort atomically. Re-runs never republish exams or reset existing data. No public APIs, shared contracts, routes or schemas change.

## Environment and rollout

Audit local usage before deleting obsolete environment keys. Keep credentials backend-only. Check provider configuration through connected tools where possible and account UI where required; do not rotate working secrets. Google callback stays at the development Convex HTTP origin. Deploy with `npx convex dev --once` only after checking the dev selector; regenerate bindings with official tooling. Start the existing public dev runner and observe the actual outcome. No migration or destructive rollback is needed; test records remain namespaced.

## Test strategy

- REQ-MANUAL-001: pure command guard tests, dry-run, and production-origin rejection at the internal server boundary.
- REQ-MANUAL-002: convex-test fixture completeness, retry/no-write behavior after edits and purchases, separate-session isolation, malformed/colliding namespace rollback, and deployed idempotence.
- REQ-MANUAL-003: safe configuration audit, provider provenance evidence, deployed public browser smoke and origin consistency; record provider settings that cannot be inspected.
- REQ-MANUAL-004: guide review, `npm run check`, backend typecheck, isolated Playwright suite and evidence table. User-led auth/payment/manual results remain pending.

## Decisions

[ADR 0001](../../decisions/0001-course-runs-and-payment-ownership.md) is unchanged. Development fixture tooling is a routine implementation choice, so no new ADR is required.
