# Design: <Change Title>

## Technical Summary

Explain the implementation approach and why it satisfies the approved specification.

## Affected Boundaries

Identify the affected frontend features, Convex domains, shared contracts, routes, integrations, and operational configuration. Explicitly state when a boundary is unaffected if that fact prevents a likely misunderstanding.

## Interfaces and Data

Describe changes to public APIs, Convex functions, shared schemas, stored data, component contracts, environment variables, and external integrations. Include compatibility or migration handling where applicable.

## Data and Control Flow

Describe the important path from user or external event through validation, authorization, persistence, and returned UI state. Reference the requirement IDs satisfied by each non-obvious part of the flow.

## Failure and Security Behavior

Define validation failures, authorization failures, retries, idempotency, partial failure handling, logging, and secret boundaries relevant to this change.

## Rollout and Compatibility

Describe deployment order, data migration, feature gating, fallback, or rollback needs. Write `None` with a short reason when no special handling is required.

## Test Strategy

Map each `REQ-<KEY>-NNN` requirement to the planned unit, integration, component, or end-to-end evidence. Verification results belong in `verification.md`.

## Decisions

Link any ADR created or relied upon by this design. Routine implementation details do not require an ADR.
