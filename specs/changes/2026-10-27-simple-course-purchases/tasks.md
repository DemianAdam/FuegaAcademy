# Tasks

## TASK-001: Authenticated checkout
- Status: Complete
- Requirement: REQ-SIMPLE-001
- Work: Only students may buy; one active run per course. Fresh checkout closes the prior preference. Processing payments block replacement. Atomic trusted pricing, exam readiness and seat checks.
- Evidence: implementation and passing test coverage linked in [verification.md](verification.md).

## TASK-002: Payment ownership
- Status: Complete
- Requirement: REQ-SIMPLE-002
- Work: Signed durable notifications and authoritative evidence automatically fulfill once. Individual payment IDs own funding; duplicates, stale events, mismatches and reversals cannot corrupt another payment. Exceptions require verified refunds, not forced enrollment.
- Evidence: implementation and passing test coverage linked in [verification.md](verification.md).

## TASK-003: Cohort capacity
- Status: Complete
- Requirement: REQ-SIMPLE-003
- Work: Thirty-minute holds capped at cohort start; recorded checkout lasts 24 hours. Pre-start approvals may fulfill on delayed notification if capacity remains. Completion retains occupancy.
- Evidence: implementation and passing test coverage linked in [verification.md](verification.md).

## TASK-004: Protected classroom
- Status: Complete
- Requirement: REQ-SIMPLE-004
- Work: Active owner-only classroom, tier-specific links, authenticated private downloads, owned uploads, stable lessons and optional progress. Completion/revocation ends access.
- Evidence: implementation and passing test coverage linked in [verification.md](verification.md).

## TASK-005: Exams and repeat runs
- Status: Complete
- Requirement: REQ-SIMPLE-005
- Work: Versioned manual/quiz exams, server-only answer keys, 70% default, single-answer equal-weight questions, admin-controlled retries, audited manual results, immutable attempts. Passing completes the run; new purchase starts fresh.
- Evidence: implementation and passing test coverage linked in [verification.md](verification.md).

## TASK-006: Student and admin experience
- Status: Complete
- Requirement: REQ-SIMPLE-006
- Work: Spanish states, restored auth destinations/selections, active/completed/revoked history, resource/exam/cohort administration and exceptional payment handling. No resume UI or lifetime access claims.
- Evidence: implementation and passing test coverage linked in [verification.md](verification.md).

## TASK-007: Verification
- Status: Complete
- Requirement: REQ-SIMPLE-007
- Work: Focused backend, UI and browser regressions; full applicable gates. No real payments, migrations, legacy compatibility or production resets.
- Evidence: implementation and passing test coverage linked in [verification.md](verification.md).