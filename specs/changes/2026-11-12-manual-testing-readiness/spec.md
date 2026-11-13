---
title: Manual testing readiness
status: implemented
owner: Product owner
created: 2026-11-12
updated: 2026-11-12
change-key: MANUAL
---

# Specification: Manual testing readiness

## Summary and problem

Prepare the Windows development environment and Convex deployment `canny-raven-235` for owner-led manual testing. Existing records lack upcoming cohorts and classroom resources; the generic seeds overwrite matching catalog records.

## Approval

The product owner explicitly approved the specification and implementation design in this chat on 2026-11-12: “PLEASE IMPLEMENT THIS PLAN: Prepare Fuega Academy for Manual Testing.” This package transcribes that approved plan. No further approval is needed for work within it.

## Requirements

### REQ-MANUAL-001: Explicit development targeting

The preparation command must validate the expected development deployment and browser URL before invoking an internal fixture mutation, and explicitly select development. It must reject production, mismatched local configuration, and unsupported arguments.

Acceptance: invalid targets fail before any mutation; the correct target prepares data without contacting a payment API.

### REQ-MANUAL-002: Additive, repeatable session fixtures

Preparation must create one Spanish teacher, a hybrid/manual course with future normal-capacity, single-seat and already-started cohorts, and a recorded/ten-question quiz course with a 70% threshold. Both courses must contain stable lessons, integer ARS prices and labeled sample resources. Existing records, users, orders and enrollments must be preserved. Reusing a session must return its IDs without resetting edits, capacity, purchases or exams; a new session must create independent records.

Acceptance: backend tests and a deployed repeat run show stable IDs and unchanged records. An incomplete/colliding namespace fails atomically rather than repairing or overwriting records.

### REQ-MANUAL-003: Environment and integration readiness

Use the existing ngrok origin matching SITE_URL, preserve the existing administrator, remove unused local configuration and misplaced payment credentials, synchronize only development, and leave the public development workflow running. Inspect Mercado Pago test credential provenance/webhook configuration and Google OAuth configuration without exposing secrets. Record any inaccessible provider settings as unverified rather than assuming success.

Acceptance: the public application serves the development catalog and authentication entrypoints; configuration checks and limitations are recorded. The owner performs Google consent and payment interactions.

### REQ-MANUAL-004: Executable manual guide and evidence

Provide a README-linked Windows guide with fixture links, accounts, upload instructions, ordered scenarios, expected results, troubleshooting and a results table. Include catalog, both authentication providers, admin editing, test-payment outcomes, webhooks, capacity, ownership, classroom/files, exams/retries/completion/repeat purchases and test refunds. Run applicable automated gates and keep unobserved manual scenarios pending.

Acceptance: the guide and verification evidence distinguish automated checks, deployed smoke checks, and owner-led tests. Mocked tests never establish external payment verification.

## Constraints and non-goals

No reset, migration, production operation, real payment, forced enrollment, password seeding, public test bypass, application schema change or commerce-rule change. The owner registers students through normal authentication and uploads the sample JPEG through the existing admin UI. Existing ADR 0001 remains authoritative. Discovered product defects require separate draft changes.

## Open questions

None.
