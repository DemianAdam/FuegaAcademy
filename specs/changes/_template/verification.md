# Verification: <Change Title>

## Result

- **Change status:** implemented
- **Verified by:** <name or role>
- **Verification date:** YYYY-MM-DD
- **Overall result:** pending

Set `spec.md` to `verified` only after the overall result is `passed` and every requirement below has sufficient evidence.

## Requirement Evidence

| Requirement | Evidence | Result |
| --- | --- | --- |
| `REQ-<KEY>-001` | Test name, command output, or concise manual observation | Pending |

Use `Passed`, `Failed`, or `Not run` for each result. A `Not run` result requires a reason and blocks verification when the evidence is relevant.

## Quality Gates

| Command | Result | Notes |
| --- | --- | --- |
| `npm run lint` | Not run | |
| `npm run lint:ox` | Not run | |
| `npm run test` | Not run | |
| `npm run build` | Not run | |
| `npm run test:bundle` | Not run | |
| `npm run test:e2e` | Not run | State whether end-to-end coverage applies and whether its environment was available. |

## Manual Validation

Record only manual checks needed to supplement automated evidence, including the environment and observed outcome.

## Residual Risks

List known limitations or follow-up risks. Write `None identified` when appropriate; unresolved failures cannot be treated as residual risk to obtain verification.
