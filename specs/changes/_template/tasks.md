# Tasks: <Change Title>

## Rules

- Create and refine tasks from the approved `spec.md` and `design.md`; do not use task completion to bypass specification approval.
- Give each task a stable `TASK-NNN` identifier, starting at `TASK-001`. Do not renumber a task after implementation begins.
- Link every task to one or more `REQ-<KEY>-NNN` requirements. A task without a requirement link must explain why it is necessary.
- Keep tasks small enough to be reviewed and verified independently. Split work that spans unrelated domains or has separate rollout risk.
- Mark a task complete only when its implementation and relevant test or verification evidence are available.

## Implementation Tasks

### TASK-001: <Short action-oriented title>

- **Status:** Not started
- **Requirements:** `REQ-<KEY>-001`
- **Work:** Describe the concrete implementation change and its owning frontend, shared-contract, backend, or operational boundary.
- **Done when:** State the observable completion condition and the test or verification evidence to attach.
- **Dependencies:** None

Add tasks in implementation order. Use one of `Not started`, `In progress`, `Blocked`, or `Complete` for status. Replace this example with the actual first task rather than leaving it as a completed-looking placeholder.

## Verification Tasks

Add explicit tasks for required automated or manual evidence when verification is substantial enough to need sequencing. Link the final evidence to `verification.md`.

## Completion Review

Before setting every task to `Complete`, confirm that all approved requirements have evidence in `verification.md`, relevant quality gates have been run, and unresolved risks are documented.
