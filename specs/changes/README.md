# Change Specifications

Each behavior-changing initiative gets one directory named `YYYY-MM-DD-short-kebab-name`. Copy `_template/` rather than creating a new format.

A change package contains exactly these core documents:

- `spec.md`: intent, scope, stable requirements, acceptance criteria, and authoritative lifecycle status.
- `design.md`: the approved technical approach, affected boundaries, risks, and test strategy.
- `tasks.md`: ordered, requirement-linked implementation and verification work.
- `verification.md`: requirement-by-requirement evidence and quality-gate results.

Tasks refine an approved design; they do not replace specification requirements or acceptance criteria. If the implementation needs a durable architectural choice, add a separately numbered ADR under `specs/decisions/` and link it from the design.

The package remains in the active directory after verification so that requirements, design, and evidence stay together in version history. Superseded behavior should link to the change or ADR that replaced it rather than rewriting historical intent.

See the repository-level [SDD guide](../README.md) for lifecycle, naming, and approval rules.
