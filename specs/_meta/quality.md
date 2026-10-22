# Quality Policy

## Quality Gates

| Command | Purpose |
| --- | --- |
| `npm run lint` | ESLint checks for application, backend, and test code. |
| `npm run lint:ox` | Fast complementary Oxlint checks. |
| `npm run test` | Deterministic Vitest unit and integration tests. |
| `npm run build` | TypeScript project build and production Vite bundle. |
| `npm run test:bundle` | Production entry-bundle budget validation. |
| `npm run test:e2e` | Playwright browser scenarios against a development deployment. |
| `npm run check` | Aggregate deterministic gate: both linters, unit tests, build, and bundle budget. |

Run focused checks while developing. Before a change becomes `implemented`, run `npm run check` and any relevant end-to-end scenarios. Record commands, results, and any justified omissions in the change's `verification.md`.

Do not mark a change `verified` while a requirement lacks evidence or a relevant gate is failing. Pre-existing failures must be identified explicitly and must not be represented as introduced by the change.

## Test Expectations

- Put pure domain-rule tests next to the relevant module using `*.test.ts` or `*.test.tsx`.
- Test Convex authorization, invariants, idempotency, and transactional behavior at the server boundary when applicable.
- Use component tests for meaningful user interaction or conditional rendering that does not require a full browser.
- Use Playwright for critical cross-boundary journeys such as authentication, protected routing, administration, and checkout behavior.
- Never call a real payment operation from automated tests. Mock or use approved sandbox/test boundaries.
- Map verification evidence to stable requirement IDs rather than relying only on aggregate coverage.

## Environment

- Use Node.js 22 or newer and install dependencies with `npm ci` when reproducing CI.
- The browser receives only `VITE_CONVEX_URL` from local Vite environment configuration.
- `SITE_URL`, `MP_ACCESS_TOKEN`, `MP_WEBHOOK_SECRET`, and `CONVEX_SITE_URL` are backend-only Convex deployment variables.
- Playwright requires a reachable development Convex deployment and suitable non-production data.
- Confirm `CONVEX_DEPLOYMENT=dev:...` before synchronizing functions or running development seeds.

## Review Standard

A review should be able to trace each implementation behavior to an approved requirement, each material technical choice to the design or an ADR, and each requirement to verification evidence. Generated output, credentials, local reports, coverage data, and build artifacts must remain uncommitted.
