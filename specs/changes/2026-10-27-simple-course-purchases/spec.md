---
title: Simple course purchases
status: implemented
owner: Product owner
created: 2026-10-27
updated: 2026-10-27
change-key: SIMPLE
---

# Specification

Approved explicitly by the user in this chat: PLEASE IMPLEMENT THIS PLAN, on codex/simple-course-purchases, without migration work.

## REQ-SIMPLE-001: Authenticated checkout

Only students may buy; one active run per course. Fresh checkout closes the prior preference. Processing payments block replacement. Atomic trusted pricing, exam readiness and seat checks.

Acceptance: automated scenarios must demonstrate these invariants at the server boundary and applicable UI.

## REQ-SIMPLE-002: Payment ownership

Signed durable notifications and authoritative evidence automatically fulfill once. Individual payment IDs own funding; duplicates, stale events, mismatches and reversals cannot corrupt another payment. Exceptions require verified refunds, not forced enrollment.

Acceptance: automated scenarios must demonstrate these invariants at the server boundary and applicable UI.

## REQ-SIMPLE-003: Cohort capacity

Thirty-minute holds capped at cohort start; recorded checkout lasts 24 hours. Pre-start approvals may fulfill on delayed notification if capacity remains. Completion retains occupancy.

Acceptance: automated scenarios must demonstrate these invariants at the server boundary and applicable UI.

## REQ-SIMPLE-004: Protected classroom

Active owner-only classroom, tier-specific links, authenticated private downloads, owned uploads, stable lessons and optional progress. Completion/revocation ends access.

Acceptance: automated scenarios must demonstrate these invariants at the server boundary and applicable UI.

## REQ-SIMPLE-005: Exams and repeat runs

Versioned manual/quiz exams, server-only answer keys, 70% default, single-answer equal-weight questions, admin-controlled retries, audited manual results, immutable attempts. Passing completes the run; new purchase starts fresh.

Acceptance: automated scenarios must demonstrate these invariants at the server boundary and applicable UI.

## REQ-SIMPLE-006: Student and admin experience

Spanish states, restored auth destinations/selections, active/completed/revoked history, resource/exam/cohort administration and exceptional payment handling. No resume UI or lifetime access claims.

Acceptance: automated scenarios must demonstrate these invariants at the server boundary and applicable UI.

## REQ-SIMPLE-007: Verification

Focused backend, UI and browser regressions; full applicable gates. No real payments, migrations, legacy compatibility or production resets.

Acceptance: automated scenarios must demonstrate these invariants at the server boundary and applicable UI.

## Non-goals
Google Forms, hosted video, automatic refunds, cohort reassignment, migrations. Previously copied external links/downloads cannot be recalled.

## Open questions
None.
