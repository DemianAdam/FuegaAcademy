# Design: Simple course purchases

## Data and ownership

Orders snapshot student, course, tier, cohort, ARS minor-unit price, exam version and intended run. Individual payment attempts own provider IDs and current authoritative evidence; retained enrollments identify their exact funding attempt. Payment exceptions never change another payment's funding relationship. Completion ends learning access, not history or cohort occupancy. See [ADR 0001](../../decisions/0001-course-runs-and-payment-ownership.md).

## Checkout and notification flow

`reserveCheckout` atomically checks role, active runs, unresolved charges, trusted price, published exam, cohort start and capacity. Existing processing payments return status; an abandoned preference must close before a fresh order. A creation lease prevents parallel POST requests. Uncertain outcomes use provider preference search by external reference, with bounded retries and an administrator retry control. Known preferences are closed rather than resumed. Live holds last 30 minutes capped at cohort start; recorded preferences last 24 hours.

Signed notifications are recorded before processing. Scheduled processing fetches authoritative payment/preference evidence, checks timestamps and ownership, and fulfills transactionally. Retries are bounded and visible. Full reversals revoke only the funded run; mismatched or additional charges are independently settled after verified refunds. Pre-start approval timestamps may fulfill after delayed notification only if capacity remains.

Provider preference recovery uses the documented [search endpoint](https://www.mercadopago.com.ar/developers/en/reference/online-payments/checkout-pro-preferences/search-preferences/get). Empty search results alone do not authorize another checkout before the original validity deadline.

## Learning and exams

Protected resources live separately from public catalog data. Stable lesson IDs key optional progress. Versioned exams retain server-only answer keys. Each enrollment has one authorized attempt number; failed attempts require admin reopening, recorded on both the previous attempt and enrollment. Passing atomically completes the enrollment. Manual results require notes; file submissions retain owned upload records.

The authenticated `/private-file` endpoint stores upload bytes itself and registers metadata; clients cannot claim arbitrary storage IDs. Downloads re-check role, ownership, active access and tier on every request, return attachments with no-store caching, and never expose storage URLs. Public catalog responses contain no private resources or exam keys.

## Frontend and development rollout

The single Buy button preserves selection through authentication and routes unavailable/processing checkout to a status page. Dashboard separates active, completed and revoked runs. Classroom access ends immediately on passing/reversal. Admins author exams/resources on saved courses and handle only exceptional payments.

No migrations or compatibility adapters are introduced. Seeds target the new model. Existing development data may need clearing before a future schema deployment; no reset or deployment is part of this completed local change.

## Verification

Backend/HTTP regression evidence and isolated browser journeys are mapped in [verification.md](verification.md). The browser transport mock is only configured by `vite.e2e.config.ts`, not the production build. No test initiates real payments.
