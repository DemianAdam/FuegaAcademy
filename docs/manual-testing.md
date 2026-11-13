# Manual testing on Windows

Use the development database and the public origin below throughout the session. Keep an ordinary Chrome window for your existing administrator and an Incognito window (or separate browser profiles) for students. The application UI and fixture content are Spanish; these instructions are English.

## Prepared environment

| Item | Value |
| --- | --- |
| Browser origin | [Open Fuega Academy](https://eternal-informally-shad.ngrok-free.app) |
| Convex deployment | `dev:canny-raven-235` |
| Dashboard | [Development database and logs](https://dashboard.convex.dev/d/canny-raven-235) |
| Current fixture session | `2026-11-12-round-01` |
| Hybrid/manual course | [Open course](https://eternal-informally-shad.ngrok-free.app/course/manual-2026-11-12-round-01-hibrido) · [Admin editor](https://eternal-informally-shad.ngrok-free.app/admin/courses/j574w3h1tcgkt6zhwtm27v1ced8j4j2c/edit) |
| Recorded/quiz course | [Open course](https://eternal-informally-shad.ngrok-free.app/course/manual-2026-11-12-round-01-quiz) · [Admin editor](https://eternal-informally-shad.ngrok-free.app/admin/courses/j57c95pdt004y4d54dx6fw0w2h8j4wg4/edit) |
| Payment application | [FuegaAcademyDev](https://www.mercadopago.com.ar/developers/panel/app/591685359387386) |
| Google project | `fuegaacademy`, project number `402526656230` |

Existing records are preserved. No student accounts, orders, enrollments or payment evidence are inserted by preparation. The ordinary browser already had a working admin session during setup; it was left signed in. Automatic tests use isolated data/transport and do not exercise the live Mercado Pago integration.

### Start, stop and prepare another session

From PowerShell in the project directory:

```powershell
# Synchronize only when backend code has changed. Check the selector first.
Select-String -Path .env.local -Pattern '^CONVEX_DEPLOYMENT='
# Expected: CONVEX_DEPLOYMENT=dev:canny-raven-235 (an inline comment is fine)
npx convex dev --once --typecheck enable

# Check the local AND resolved server targets without creating records.
npm run prepare:manual -- --session 2026-11-12-round-01 --dry-run

# Same session: return current IDs without resetting any records.
npm run prepare:manual -- --session 2026-11-12-round-01

# New session: independent fixtures for cases blocked by previous purchases.
npm run prepare:manual -- --session 2026-11-12-round-02

# Start Vite on port 3000 plus the reserved ngrok hostname.
npm run dev:public
```

The app and tunnel were started during preparation. Do not start a second copy while port 3000 is in use. Stop with **Ctrl+C** in the terminal running `dev:public`. If the assistant started the process, ask it to stop the running manual-testing server. Closing the browser does not stop it. For future sessions, run the command yourself to keep direct terminal control.

The runner reads `NGROK_STATIC_DOMAIN` from the ignored `.env.local`. Local configuration contains `CONVEX_DEPLOYMENT`, `VITE_CONVEX_URL` and the tunnel hostname; credentials remain in Convex. The fixture command rejects production, alternate targets, deploy-key/self-hosted overrides and unsupported arguments. It never deploys automatically. An incomplete namespace fails without repair: use a new session name. Dates remain fixed after creation; create a fresh session when cohorts become old. Do not run the generic teacher/course seeds for this test round.

### Accounts and provider prerequisites

1. Reuse your existing administrator; do not promote a student or change existing credentials.
2. Register **Student A** and **Student B** through `/register` with different email addresses and passwords you choose. Use them in isolated browser profiles. Never record passwords in this guide or commit them.
3. For Google testing, choose one of your existing Google OAuth test users. The FuegaAcademy console showed external/testing mode, the correct callback below, and two existing test users. Your account was on that list. Actual Google authorization remains a manual case.
4. In Mercado Pago, use the **buyer test account**, not your seller or real buyer account. Backend credentials were checked with `/users/me`: Argentine site `MLA`, seller tagged `test_user`, user ID `3760410780`. The same test seller appears under FuegaAcademyDev's test credentials. The MCP-connected `Test-convex` app is a different application/account context; do not replace working backend credentials with its tokens.
5. FuegaAcademyDev's test webhook URL is `https://canny-raven-235.convex.site/mercadopago-webhook`, with **Pagos (legacy)** enabled. Its signing secret matched the backend secret in a private comparison. No secret was changed. The server also sets this notification URL in checkout preferences.
6. Google callback: `https://canny-raven-235.convex.site/api/auth/callback/google`. `SITE_URL` must remain the browser origin above for OAuth return URLs, payment returns and private file CORS.

Use the application's current [test-account instructions](https://www.mercadopago.com/developers/en/docs/checkout-pro-preferences/test-accounts) and [Argentina test cards](https://www.mercadopago.com.ar/developers/panel/app/591685359387386/test-cards) for buyer credentials and approved/rejected/pending simulations. Confirm the test environment before submitting. Token prefixes alone do not prove whether an account is a test account. Do not make real payments or rotate secrets for these tests.

## Fixtures and preparation through the UI

The hybrid course costs **ARS 1,500 live** / **ARS 1,000 recorded**. The quiz course costs **ARS 1,000 recorded**. Stored amounts are 150000 / 100000 ARS minor units. Each course contains two modules with four stable lessons in total.

The hybrid course includes a future 10-seat cohort, a future one-seat cohort, and an already-started cohort. Dates are calculated once from the backend clock at creation (+30 days, +31 days, -1 day); the UI displays Buenos Aires time. Existing sessions are never refreshed or reset. Capacity includes temporary holds. The example recording and meeting URLs open **example.com**, intentionally; they contain no real video or meeting. A recorded student must see no cohort meeting link; a live student sees only their own cohort's link.

Before classroom testing, sign in as admin and open the hybrid editor. In **Contenido privado y examen → Materiales, grabaciones y sesiones**:

1. Enter `Material privado de prueba` in **Título del recurso** and select **Material**.
2. Choose the existing `public\images\hero-background.jpg` from this project using **O archivo (hasta 25 MB)**; leave the HTTPS field empty.
3. Click **Agregar recurso** and expect **Guardado.** plus the resource in the list. Repeat for the quiz course if testing private downloads there.

This upload intentionally uses the normal authenticated upload flow and administrator ownership. Uploading a private material is not performed by the seed. For manual exam submission, Student A may use the same JPEG. Test unsupported file types and files exceeding 25 MB separately; expect refusal and no usable attached resource.

## Ordered test cases

Keep this order within each journey. Use another fixture session when an earlier active enrollment, pending payment or failed/reopened exam prevents an independent case. An active enrollment blocks another purchase of the same course; do not edit database statuses to get around this. Use the quiz course for repeated exam runs and another session for independent live/recorded and refund cases.

### 1. Catalog and layouts — MT-01

- Open home, `/courses`, `/teachers` and both fixture detail pages. Expect the Spanish teacher/content, course images, modules and prices; unpublished/archived records must not become purchasable.
- Compare a wide desktop window and a narrow phone-width window. Check navigation, tabs, form fields, price/cohort selection and keyboard focus without clipped controls.
- Select **En vivo** and **Grabado** on the hybrid course. Future cohorts are selectable; **Cohorte ya iniciada — no comprar** is disabled. Recorded purchase does not require a cohort.
- Known defect: the hero still says **Acceso de por vida**, although checkout correctly says access ends after passing. Track it against the separate [draft defect](../specs/changes/2026-11-12-course-access-copy/spec.md); do not interpret that copy as the expected access policy.

### 2. Authentication and role boundaries — MT-02

- In a signed-out student window, select recorded tier or a future live cohort, then choose **Ingresá para pagar**. Complete registration/login; expect the original course and selection to be restored.
- Sign out and test a wrong password, valid password login, refresh, then logout. Expect understandable errors and a cleared authenticated session after logout.
- Choose **Continuar con Google**, complete Google consent yourself using an allowlisted test account, and verify the original destination is restored. If Google already corresponds to the administrator, expect `/admin`; use a distinct allowlisted account to exercise student onboarding.
- Signed-out `/dashboard` and `/admin` must require login. A student must not access admin data/actions. The administrator must reach `/admin` and must not be able to buy a student course.
- From Student B, open Student A's order/classroom URL once those exist. Expect hidden/not-found purchase information or denied classroom access, with no private resources.

### 3. Administration and published exams — MT-03

- Open the fixture editor, edit the description, save and refresh. Verify persistence on the public course; verify image URL and uploaded-image modes using disposable fixture data.
- Edit modules/lessons and cohort dates/capacity through the UI; save/reopen and verify stable lesson identities and unchanged existing run history.
- Upload the private material as described above. Add/remove a disposable sample resource; leave at least one recording and the intended meeting links for later cases.
- Use **Editar desde versión 1** before modifying a seeded exam, then **Publicar examen**. Expect a new version. Existing purchases retain their prior exam. Publish only on disposable fixtures when checking version changes.
- Re-run preparation for this session. Expect `created: false` and all admin edits/purchases retained.

### 4. Checkout outcomes and returns — MT-04

- As Student A, initiate a recorded test checkout. Confirm the provider shows the expected course and ARS amount. Use only the provider's test account/card instructions.
- Perform separate approved, rejected and pending/in-process cases using fresh sessions as needed. Approved becomes active only after server verification. Rejected/pending states must not grant content access.
- Abandon a checkout. Returning to the status page, refreshing it, or adding provider-looking URL parameters must not create enrollment. Starting a new checkout must close/supersede the old preference; a genuinely processing payment blocks replacement.
- Record order ID from `/checkout/<orderId>`, provider payment ID, outcome and time. A saved checkout URL is not proof of payment. No enrollment should appear merely because the browser returned successfully.

### 5. Webhooks, ownership and last seat — MT-05

- After an approved test payment, inspect development `paymentInbox`, `paymentAttempts`, `orders` and `enrollments` plus function logs. Expect signed notification evidence, authoritative reconciliation and exactly one funded run.
- In the correct provider app, inspect notification delivery for **Modo de prueba**. If replay is available, resend the same actual test-payment notification. Expect no additional enrollment or seat consumption. A generic simulator with invented Data ID `123456` cannot prove authoritative payment reconciliation.
- In a fresh session, have Student A start checkout for **Cohorte futura — último cupo** without paying. Student B should be unable to reserve that seat while the hold remains. Let the hold expire (30 minutes maximum, capped at start) and retry; do not fake enrolled counts. If paying, use a test payment and expect one occupant only.
- On another future cohort, buy live access and compare its classroom links with a recorded run from another session/account. Passing the exam must retain the live cohort occupancy.

### 6. Classroom, progress and private files — MT-06

- After enrollment, follow **Continuar curso**. Toggle lesson completion, refresh and expect progress persistence for the current run.
- Open the example recording link and download **Material privado de prueba**. Expect the JPEG bytes and filename; inspect the browser Network panel for successful authenticated `/private-file` requests and matching CORS origin.
- A recorded student must see no live meeting link. A live student must see only the enrolled cohort's meeting link.
- Try another student's classroom URL, a signed-out private download, and replay a private download request after completion/revocation. Expect denied access. Already downloaded files and copied external links cannot be recalled.

### 7. Exams, reopening, completion and new runs — MT-07

- Quiz answer key for this fixture: **Sí** is correct for every question. First submit six **Sí** and four **No** (60%): expect failed, with no immediate student retry.
- In admin **Revisiones → Exámenes**, reopen that attempt. Submit seven **Sí** and three **No** (70%): expect passed/completed and content access to end. Acknowledgment that passing ends access must be required.
- Open the previous classroom/download again and expect denial. Dashboard history should retain the completed run. Choose **Comprar otra cursada**, pay in test mode, and expect a fresh run with new progress/attempts while old history remains.
- In the hybrid course, upload the JPEG for the manual final exam and submit. Expect pending review. As admin, review once with feedback; test a failed review/reopening and then a passing review. Expect immutable attempt history, reviewer evidence and access ending only on pass.
- Test publishing a newer exam before a later purchase: a new run uses the newer version; the older run retains its original version.

### 8. Test refunds and payment review — MT-08

- On a separate active test run, perform the test refund yourself in the correct Mercado Pago test account. Wait for signed notification/reconciliation; expect funded access revoked and history retained. Never issue a real refund.
- In `/admin` → **Revisiones → Pagos para revisar**, inspect any exceptional charges and the provided reconciliation/recovery controls. Administrator lookup must not force enrollment without signed payment evidence. If no exception occurs, record the queue as empty; use the automated invariant tests as separate evidence rather than fabricating provider data.

## Results and defect reporting

All owner-led results start **Pending**, regardless of automated tests. Use **Passed**, **Failed** or **Blocked** only after observation. Copy this table for another session. Record no passwords, card numbers, tokens, signing secrets, Google codes or OAuth state.

| Case | Result | Account role / session | Order / payment ID | Observed result / defect / time |
| --- | --- | --- | --- | --- |
| MT-01 Catalog/layouts | Pending | | | Known access-copy defect documented separately |
| MT-02 Password + Google auth | Pending | | | |
| MT-03 Administration/files/exams | Pending | | | |
| MT-04 Checkout outcomes | Pending | | | |
| MT-05 Webhooks/capacity/ownership | Pending | | | |
| MT-06 Classroom/progress/downloads | Pending | | | |
| MT-07 Exams/retries/new runs | Pending | | | |
| MT-08 Test refund/review | Pending | | | |

For a defect, record the case/session, role, route, steps, expected vs actual result, timestamp, order/payment IDs if relevant, and a screenshot with secrets redacted. Do not modify historical payment or enrollment evidence to work around it.

## Troubleshooting and verification

| Symptom | Check / next action |
| --- | --- |
| Tunnel offline or wrong port | Keep `dev:public` running; ensure port 3000 is free before starting; confirm saved ngrok authentication/domain. Use the public hostname consistently. |
| ngrok visitor notice | If ngrok displays its ordinary visitor notice, continue through it yourself for this known domain. A browser certificate/security warning requires user review, not an automated bypass. |
| Google `redirect_uri_mismatch` | Check the exact Convex callback above in the `fuegaacademy` web client. Do not use the ngrok hostname as the Google callback. |
| Google access denied | Use an existing allowlisted test account; complete consent yourself. Check **Google Auth Platform → Público** under the owning account/project. Do not publish the app or rotate credentials just to test. |
| Private file CORS error | Browser origin and Convex `SITE_URL` must both be the public ngrok origin; avoid mixing localhost and ngrok. Check token expiry and active enrollment as well. |
| Checkout configuration/provider error | Check backend variable presence and test seller provenance. Admins cannot purchase. A published exam and positive price are required. Keep working tokens out of `.env.local`. |
| Payment stuck verifying | Check the actual test app's notification history, test environment filter, webhook delivery/signature, `paymentInbox` processing and authoritative payment status. Preserve payment evidence; never manually enroll. |
| Retrying a course is blocked | Check active run, pending payment, preference recovery and exceptional charge state. Use a new fixture session for independent cases. |
| Existing fixtures unchanged after prepare | Expected: preparation is additive and never resets. Use a new namespace for fresh dates/content/state. |
| ESLint reports a missing `test-results` directory | Do not run the aggregate check concurrently with Playwright, which recreates its artifacts. Finish Playwright, then rerun the aggregate gate. |

Run these checks sequentially, allowing each to finish:

```powershell
npm run check
npx tsc --noEmit -p convex/tsconfig.json
npm run test:e2e
```

Playwright runs on port 3001 against isolated mocked transport, not the real dev database. These results do not confirm Google consent, payment delivery, or external refunds. Preparation evidence is recorded in [verification.md](../specs/changes/2026-11-12-manual-testing-readiness/verification.md); the purchase feature remains externally unverified until real development/sandbox observations support it.
