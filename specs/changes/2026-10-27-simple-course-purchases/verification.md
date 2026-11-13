# Verification: Simple course purchases

- Date: 2026-10-27
- Change status: implemented
- Result: all local automated gates passed; external deployment/provider smoke validation not performed.
- Branch: `codex/simple-course-purchases`
- No migration, deployment, production operation, data reset, or real payment was performed.

## Requirement evidence

| Requirement | Implementation and verification evidence | Result |
| --- | --- | --- |
| REQ-SIMPLE-001 | `convex/orders/internal.ts`, `convex/checkout/actions.ts`; checkout authorization, active enrollment, processing/closure, lease concurrency and mocked timeout tests in `convex/orders/internal.test.ts`; login selection browser journey | Passed |
| REQ-SIMPLE-002 | Payment attempts and signed inbox; tests for retries, failed attempts, stale observations, duplicate charges, funding-only reversals, partial refunds, mismatch refund settlement, unsigned webhooks and old-run payment replay | Passed |
| REQ-SIMPLE-003 | Atomic holds, future start cutoffs and retained occupancy; tests for last seat, expired holds, delayed pre-start approval, post-start approval, capacity exception; live/recorded browser scenario | Passed |
| REQ-SIMPLE-004 | `convex/learning/functions.ts`, authenticated HTTP file routes; tests for owner/tier isolation, public catalog exclusion, upload ownership/MIME, actual HTTP upload/download authorization and denial after completion | Passed |
| REQ-SIMPLE-005 | Versioned quizzes/manual results, attempt/reopening audit and retained runs; tests for answer-key privacy, exact threshold, incomplete answers, retry restrictions, manual results, grading revoked runs, idempotent passing, exam-version isolation and repeat run | Passed |
| REQ-SIMPLE-006 | Classroom, course learning editor, exam/admin exception queue, dashboard/history, auth routing; five browser journeys using actual React screens with an isolated mocked Convex transport | Passed |
| REQ-SIMPLE-007 | Commands below; test harness is separate from production Vite configuration and never contacts payment services | Passed |

## Commands

| Command | Result |
| --- | --- |
| `npm run check` | Passed: ESLint, Oxlint, 65 tests in 9 files, production build, bundle budget |
| `npx tsc --noEmit -p convex/tsconfig.json` | Passed |
| `npm run test:e2e` | Passed: 5 Chromium scenarios, 8.5 seconds, two workers |
| `npx convex codegen --typecheck disable` | Passed; generated API bindings through official tooling; codegen does not activate deployed functions |
| `git diff --check` | Passed; Git reports CRLF normalization warnings only |

Focused backend suite: 40 tests. Other existing suites account for 25 tests.
Largest production JavaScript chunk: 243,738 bytes (665,600-byte budget).

## Environment and limitations

The sandbox blocks localhost sockets, so Playwright ran with elevated tool permission. Chromium headless shell was installed for testing. A five-worker run initially exhausted Windows socket buffers on one page load; two-worker execution passed all scenarios.
Browser journeys mock the Convex transport and provider state, while backend tests use `convex-test` against the real functions and schema. They do not establish that live deployment environment variables, Mercado Pago notifications, or OAuth configuration are correct. A deployed development smoke test remains pending; the change is therefore marked implemented rather than externally verified.

External recording/meeting links and downloaded bytes cannot be recalled. Unknown preference-creation outcomes remain blocked until provider search establishes a known preference or an administrator retries recovery; no automatic extra charge is risked. Administrators perform exceptional refunds in Mercado Pago and the application verifies provider evidence.
