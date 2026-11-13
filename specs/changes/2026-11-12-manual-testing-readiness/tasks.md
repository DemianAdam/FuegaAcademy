# Tasks: Manual testing readiness

## TASK-001: Add guarded session fixtures

- **Status:** Complete
- **Requirements:** REQ-MANUAL-001, REQ-MANUAL-002
- **Work:** Implement the internal mutation, preparation CLI and meaningful safety/isolation tests; regenerate bindings.
- **Done when:** Complete: [implementation and 26 new safety/fixture tests](verification.md#requirement-evidence) are recorded; bindings regenerated through official tooling.
- **Dependencies:** Approved specification/design.

## TASK-002: Prepare development environment

- **Status:** Complete
- **Requirements:** REQ-MANUAL-003
- **Work:** Audit safe configuration/provider prerequisites, clean unused local keys, synchronize development, create/retry fixtures and start the public workflow.
- **Done when:** Complete: [deployed session, repeatability, environment/provider checks and running workflow](verification.md#development-setup-and-provider-audit) are recorded.
- **Dependencies:** TASK-001.

## TASK-003: Document and verify the handoff

- **Status:** Complete
- **Requirements:** REQ-MANUAL-004
- **Work:** Write the guide, link README, run gates and public browser smoke, and record owner-led scenarios as pending.
- **Done when:** Complete: [guide, passing final gates and deployed browser smoke](verification.md) are recorded. Owner-led test results remain pending as designed.
- **Dependencies:** TASK-001, TASK-002.

## Completion review

Do not mark a task complete without evidence. Configuration/access limitations must remain explicit. User-led Google authorization, private uploads and payment tests are separate from automated readiness evidence.
