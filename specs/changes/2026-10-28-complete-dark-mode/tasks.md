# Tasks: Complete dark mode

All tasks implement the user-approved specification. Results are recorded in [verification.md](verification.md).

### TASK-001: Semantic palette and complete state coverage
- Status: Complete
- Requirements: REQ-DARK-001, REQ-DARK-004
- Implementation: [CSS tokens](../../../src/index.css), paired component foreground/background colors, native control boundaries, status colors and responsive toolbar corrections.
- Evidence: Semantic and rendered contrast browser tests; desktop/mobile screenshot review in verification.md.

### TASK-002: Reliable pre-paint lifecycle
- Status: Complete
- Requirements: REQ-DARK-002
- Implementation: [blocking bootstrap](../../../public/theme-init.js), [provider](../../../src/lib/ThemeContext.tsx) and typed runtime accessor.
- Evidence: Four lifecycle unit tests and browser startup/reload/OS/cross-tab tests; production output inspected.

### TASK-003: Accessible theme selection
- Status: Complete
- Requirements: REQ-DARK-003
- Implementation: [radio selector](../../../src/components/ui/ThemeToggle.tsx), dropdown primitives, student desktop/mobile controls and editor toolbar.
- Evidence: Keyboard/radio-state and responsive viewport-bound assertions in browser tests.

### TASK-004: Styled browser fixtures
- Status: Complete
- Requirements: REQ-DARK-005
- Implementation: [theme scenarios](../../../e2e/theme.spec.ts) and test-only primitive gallery; fixture loads production CSS and the same blocking script. Mock transport supplies visitor/student/admin data, published teachers and payment warnings.
- Evidence: 17 passing combined browser scenarios, followed by four passing final populated-teacher screen scenarios.

### TASK-005: Quality gate and verification
- Status: Complete
- Requirements: REQ-DARK-001 through REQ-DARK-005
- Evidence: `npm run check` passed (69 unit tests, build and bundle gate), browser checks passed, screenshots reviewed, final fixture lint and whitespace checks passed. See verification.md for exact scope and limitations.

### TASK-006: Darken and neutralize backgrounds
- Status: Complete
- Requirements: REQ-DARK-001, REQ-DARK-004
- Work: Applied #0B0C0E canvas, #141517 panels, #1C1D20 elevation and #252629 hover surfaces; reduced blue/purple tint in large containers.
- Evidence: `npm run check` passed with 69 tests; `npm run test:e2e -- e2e/theme.spec.ts` passed 12 Chromium scenarios, including semantic and rendered contrast checks at desktop and mobile sizes.
