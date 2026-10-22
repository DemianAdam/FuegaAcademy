# Architecture Decision Records

Use an Architecture Decision Record for a durable or cross-cutting technical choice that is expensive to reverse or changes a boundary in `specs/_meta/architecture.md`.

## Naming

- Copy `0000-template.md` to `NNNN-short-kebab-title.md`.
- Use the next unused four-digit number in sequence.
- Never reuse a number, including when an ADR is superseded.

## Status

- `proposed`: under discussion and not authoritative.
- `accepted`: the decision is current and must guide related changes.
- `superseded`: a newer ADR replaces the decision; link both records.

Accepted ADR content is historical. Correct typographical errors or update references in place, but create a new ADR to change the decision itself.
