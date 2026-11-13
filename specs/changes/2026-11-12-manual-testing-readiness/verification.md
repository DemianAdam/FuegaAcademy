# Verification: Manual testing readiness

- Change status: implemented
- Verification date: 2026-11-12
- Overall result: preparation implemented; automated readiness checks and deployed smoke passed. Owner-led manual acceptance remains pending.
- Approval: explicit product-owner request in this chat, 2026-11-12, to implement the complete manual-testing preparation plan.

## Requirement evidence

| Requirement | Evidence | Result |
| --- | --- | --- |
| REQ-MANUAL-001 | `scripts/prepare-manual.mjs`, `scripts/prepare-manual.test.ts`: 19 tests cover unsafe selectors/URLs/keys, malformed/extra arguments, resolved target mismatch, dry-run and query-before-mutation order. `convex/manualTesting/seed.test.ts` rejects other deployments at the server boundary. Deployed dry-run succeeded. | Passed |
| REQ-MANUAL-002 | `convex/manualTesting/seed.ts`, 7 backend tests cover fixture completeness, no-write retries after admin edits/checkout/resource removal, session isolation, namespace collisions, invalid names, deployment guard and public SITE_URL. Real dev creation/retry returned the same IDs with `created: true` then `false`. Existing records' counts/fingerprints were unchanged. | Passed |
| REQ-MANUAL-003 | Development sync succeeded against the explicitly reported expected deployment. Local config cleaned; safe provider audit and browser observations below. Local/public URLs and sample JPEG returned HTTP 200. Vite/ngrok left running. | Passed |
| REQ-MANUAL-004 | [Manual guide](../../../docs/manual-testing.md) linked from README; current session links, profiles, upload instructions, eight ordered scenario groups, expected outcomes, troubleshooting and pending results table. Fresh final automated checks below. | Passed |

## Quality gates

No results from the prior planning turn are counted as checks of this implementation.

| Command | Result | Evidence / limitations |
| --- | --- | --- |
| `npx vitest run convex/manualTesting/seed.test.ts scripts/prepare-manual.test.ts` | Passed | Initial 25 safety/fixture tests; the final full gate includes an additional public-origin test, for 26 new tests total. |
| `npm run check` | Passed | Final tree: ESLint, Oxlint, 91 tests in 11 files, TypeScript/Vite build and bundle budget; largest entry chunk 243738 bytes. |
| `npx tsc --noEmit -p convex/tsconfig.json` | Passed | Explicit backend typecheck; development sync also used `--typecheck enable`. |
| `npm run test:e2e -- --global-timeout=120000` | Passed | Five isolated Chromium journeys, two workers, 17.1 seconds; no provider calls or dev-data changes. Final subsequent code adjustment only changes seed image-origin lookup and adds its backend test; the UI/transport is unchanged. |
| `npx convex codegen --typecheck disable` | Passed | Official generated bindings; no manual changes under `_generated`. |
| `npx convex dev --once --typecheck enable` | Passed | Final sync explicitly reported `[Development] ... canny-raven-235`, functions ready. No reset/migration. |
| `npm run prepare:manual -- --session 2026-11-12-round-01 --dry-run` | Passed | Checked local selection and guarded remote query, with no fixture mutation. Repeated after final deployment. |
| `npm run prepare:manual -- --session 2026-11-12-round-01` (twice) | Passed | First created fixtures; second returned identical IDs and dates without writing. |
| `git diff --check` | Passed | Git's generated-file CRLF normalization warning is informational. |

An earlier aggregate run failed during lint discovery because concurrent Playwright cleanup removed `test-results`. After Playwright finished, the aggregate gate passed; the final gate also passed. The guide now specifies sequential execution. No lint rule was disabled to conceal this failure.

## Development setup and provider audit

- Session: `2026-11-12-round-01`; browser origin and `SITE_URL`: `https://eternal-informally-shad.ngrok-free.app`.
- Hybrid: `j574w3h1tcgkt6zhwtm27v1ced8j4j2c`, slug `manual-2026-11-12-round-01-hibrido`.
- Quiz: `j57c95pdt004y4d54dx6fw0w2h8j4wg4`, slug `manual-2026-11-12-round-01-quiz`.
- Teacher: `jn7c6nmm4fasyw0xfjgx1v4p1d8j58fq`.
- Future normal cohort: `jh75704frn656nbczyjgqgv3118j5eac`; one-seat cohort: `jh7a4dq42cem48vr856n85h3918j50e8`; started cohort: `jh7ej8wscga621340q83qe0ky18j41gy`.
- Creation added 1 teacher, 2 courses, 4 modules, 3 schedules, 2 published exams and 5 sample resources. No users, orders, enrollments or provider evidence were created by preparation.
- Compared serialized-record fingerprints/counts before and after seed/retry, excluding the new namespace: existing 5 users, 1 teacher, 1 course, 1 module, 1 schedule, 1 exam, 4 orders and 1 enrollment unchanged; existing resource count remained zero.
- Removed unused Stripe/language/public-site keys and the misplaced local `MP_ACCESS_TOKEN` from ignored `.env.local`; preserved the dev selector and public client URL, and saved the ngrok hostname locally. Convex CLI may regenerate the unused, browser-safe `VITE_CONVEX_SITE_URL`; it is not a credential and is not required by the app.
- Backend names include `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `JWT_PRIVATE_KEY`, `JWKS`, `MP_ACCESS_TOKEN`, `MP_WEBHOOK_SECRET`, `SITE_URL`; secret values were not printed or committed.
- Mercado Pago `/users/me` returned HTTP 200, `site_id: MLA`, user `3760410780`, tags including `test_user`. After the owner completed account verification, the developer console's **FuegaAcademyDev** app `591685359387386` showed the same test seller. This establishes the intended test-account provenance. The MCP-connected **Test-convex** app `7320085989313392` is a different account/application context and was not used to replace any backend credential.
- FuegaAcademyDev **Modo de prueba** had the exact Convex `/mercadopago-webhook` URL and **Pagos (legacy)** selected. The existing provider signing secret matched the backend through a private fingerprint comparison, then the provider field was re-hidden. No secret rotation, webhook save, simulation or payment was performed.
- After the owner switched Google accounts, inspected project `fuegaacademy` (number `402526656230`). **Fuega Academy Web Client** lists the exact callback `https://canny-raven-235.convex.site/api/auth/callback/google`, an enabled secret, external/testing mode and two existing allowlisted test users, including the owner's browser account. No OAuth settings or audience permissions were changed. Actual consent/login remains owner-led.
- Started `npm run dev:public` (agent process session `22231`) and left it running. HTTP checks: localhost:3000, public origin and public sample JPEG all returned 200; JPEG content type `image/jpeg`. Stop with Ctrl+C in the runner terminal, or ask the assistant to stop that process session. Restart with the documented command.

## Deployed browser smoke

- Chrome loaded the hybrid fixture title, description, image, prices, both future cohorts and disabled started cohort from development.
- Selecting recorded tier displayed ARS 1000. The administrator's purchase action remained disabled, as expected.
- Opening login with the existing authenticated admin session redirected to `/admin`; the administration panel loaded current counts. The session was preserved; no forced logout or credential entry occurred.
- Hybrid admin editor loaded the seeded teacher, two modules, three cohorts, four private-link resources and published manual exam version 1. Private file upload remains an owner-led case.
- Recorded quiz course loaded its fixture description and ARS 1000 price. The course tab was left open as a deliverable.
- Observed existing conflicting lifetime-access copy in the hero; recorded the separate [draft access-copy change](../2026-11-12-course-access-copy/spec.md) without changing runtime behavior.

## Manual validation

Owner-led password registration/login, Google consent/login, private uploads/downloads, test payments, webhook fulfillment/replay, exams, capacity races and refunds remain **Pending** in the guide. No real payment or forced enrollment was performed. The simple-course-purchases change remains `implemented`; this readiness work does not mark it externally verified.

## Residual risks

## Branch integration — 2026-11-13

The owner explicitly requested merging all changes needed for manual testing. Integrated `codex/muted-blue-dark-mode` (`6eb97e0`) into `codex/simple-course-purchases`, preserving manual-testing fixtures, CLI, documentation and generated internal API bindings. Conflicting purchase UI files differ between branch tips only in approved theme presentation; retained the theme branch's combined versions. Older remote branches were already ancestors; a fresh `git fetch origin` confirmed no additional feature branch was missing. The other worktree had no uncommitted changes.

Merged-tree verification: `npm run check` passed (95 tests in 12 files, both linters, build and 243661-byte entry bundle); `npx tsc --noEmit -p convex/tsconfig.json` passed; `npm run test:e2e -- --global-timeout=180000` passed all 17 Chromium scenarios in 1.3 minutes. No backend/shared-contract changes relative to the manual-testing branch, so no deployment or data mutation was needed. Restarted `npm run dev:public` (process session `82770`); the public URL returned HTTP 200 and included the merged `/theme-init.js` bootstrap. Owner-led transactions and acceptance cases remain pending. Integration was committed locally; no remote push was requested.

Actual provider transactions and Google authorization are unobserved. Sample external links deliberately lead to example.com. Future cohorts eventually age out; use a new session instead of resetting records. The draft lifetime-access copy defect remains unresolved. Preparation is complete, but these facts prevent claiming end-to-end manual acceptance.
