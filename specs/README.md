# Spec-Driven Development

Fuega Academy uses a lightweight, repository-native Spec-Driven Development process. Specifications describe observable intent before implementation, designs describe how the approved intent will fit the system, and verification records the evidence that the result satisfies each requirement.

No external SDD tool is required. Markdown in this directory is the source of truth.

## Repository Layout

- [`_meta/product.md`](_meta/product.md): stable product purpose, users, capabilities, and scope boundaries.
- [`_meta/architecture.md`](_meta/architecture.md): current system boundaries, data flow, and technical invariants.
- [`_meta/quality.md`](_meta/quality.md): quality gates, test expectations, and environment constraints.
- [`changes/`](changes/README.md): change packages and their authoring rules.
- [`changes/_template/`](changes/_template/spec.md): specification, design, task, and verification templates copied when a new change begins.
- [`decisions/`](decisions/README.md): accepted and superseded Architecture Decision Records.

## Lifecycle

Every behavior-changing change moves through these states:

1. `draft`: the problem, requirements, acceptance criteria, and design are still being refined. Runtime implementation must not start.
2. `approved`: the user or product owner has explicitly accepted the specification and design. Implementation may begin.
3. `implemented`: the approved behavior has been implemented and the applicable automated gates have completed, with results recorded.
4. `verified`: every requirement has evidence and its acceptance criteria have been confirmed.

The `status` field in `spec.md` is authoritative. Design or scope changes discovered during implementation return the change to `draft`; update the documents and obtain approval before continuing.

## Naming and Traceability

- Name change directories `YYYY-MM-DD-short-kebab-name`, using the date the draft is created.
- Give each change a short uppercase key derived from its name, such as `CHECKOUT`.
- Identify requirements as `REQ-<KEY>-NNN`, starting at `001` and never reusing an identifier within the change.
- Reference requirement IDs from design decisions, tests, and `verification.md` when the relationship is not obvious.
- Name ADRs `NNNN-short-kebab-title.md`, using the next available four-digit number. Numbers are never reused.

## Starting a Change

1. Read the three `_meta` documents and any relevant accepted ADRs.
2. Copy `changes/_template/` to a correctly named change directory.
3. Complete `spec.md` and `design.md`, removing instructions that do not apply rather than leaving ambiguous placeholders.
4. Resolve every open question and obtain explicit approval before changing the status from `draft` to `approved`.
5. Complete `tasks.md` from the approved specification and design before implementation begins.
6. During implementation, keep requirement IDs stable, complete tasks with linked evidence, and update the design if approved technical details change.
7. Complete `verification.md` with evidence before setting the change to `verified`.

The specification states what must be true, `tasks.md` orders the work needed to achieve it, and `verification.md` records the evidence. Task completion alone never verifies a requirement.

## Architecture Decisions

Create an ADR when a choice is durable, cross-cutting, expensive to reverse, or changes a boundary recorded in `_meta/architecture.md`. Routine implementation choices stay in the change's `design.md`. An accepted ADR is immutable except for corrections and status/reference updates; replace it with a new ADR when the decision changes.
