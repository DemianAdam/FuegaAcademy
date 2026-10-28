# ADR 0001: Course runs, funding payments and private content

Status: accepted, 2026-10-27. Approved by the user with the simple-purchases plan.

Separate provider payment attempts from orders. Retained enrollments identify their funding payment, intended run and immutable exam version. Reversal only affects that funding relationship. Signed webhook evidence is required for fulfillment. Completion ends access but preserves cohort occupancy and history. Private file downloads check authorization per request; public storage URLs are not returned. External links and already downloaded bytes cannot be recalled.

This replaces final-project-only completion and order-level payment identity. No migration is required for development data.
