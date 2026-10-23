# Tasks: Course Creation Workspace Redesign

## Implementation Tasks

### TASK-001: Define editor and lesson contracts

- **Status:** Complete
- **Requirements:** `REQ-COURSEWORKSPACE-002`, `REQ-COURSEWORKSPACE-004`
- **Work:** Add shared lesson/editor schemas and compatibility normalization.
- **Done when:** Browser and Convex inputs agree on the new course draft shape. Evidence: `npm run build` passed on 2026-10-22.
- **Dependencies:** None

### TASK-002: Update authorized course persistence

- **Status:** Complete
- **Requirements:** `REQ-COURSEWORKSPACE-002`, `REQ-COURSEWORKSPACE-004`
- **Work:** Derive unique slugs and synchronize modules and lessons in course mutations.
- **Done when:** Create and update persist the complete editor draft. Evidence: Convex TypeScript check and `npm run lint` passed on 2026-10-22.
- **Dependencies:** TASK-001

### TASK-003: Build the workspace and shared previews

- **Status:** Complete
- **Requirements:** `REQ-COURSEWORKSPACE-001`, `REQ-COURSEWORKSPACE-003`, `REQ-COURSEWORKSPACE-005`
- **Work:** Rebuild the editor and extract reusable public course display components.
- **Done when:** Card and page previews reflect the draft without checkout side effects. Evidence: `npm run build` passed on 2026-10-22.
- **Dependencies:** TASK-001

### TASK-004: Verify the redesign

- **Status:** Blocked
- **Requirements:** `REQ-COURSEWORKSPACE-001`, `REQ-COURSEWORKSPACE-002`, `REQ-COURSEWORKSPACE-003`, `REQ-COURSEWORKSPACE-004`, `REQ-COURSEWORKSPACE-005`
- **Work:** Add focused tests and run applicable gates.
- **Done when:** Evidence is recorded in `verification.md`. Blocked by the pre-existing all-commented `convex/orders/internal.test.ts`, which causes Vitest to fail with no test suite found.
- **Dependencies:** TASK-002, TASK-003

### TASK-005: Make the preview canvas responsive

- **Status:** Complete
- **Requirements:** `REQ-COURSEWORKSPACE-005`, `REQ-COURSEWORKSPACE-006`
- **Work:** Add container-responsive course presentation styles, device viewports, and focused preview mode while retaining the unsaved editor draft.
- **Done when:** The page preview is readable in split mode and expands to a keyboard-accessible focused workspace. Evidence: Chrome visual validation, Escape/focus restoration check, `npm run lint`, and `npm run build` passed on 2026-10-22.
- **Dependencies:** TASK-003

### TASK-006: Enforce format-aware commerce

- **Status:** Complete
- **Requirements:** `REQ-COURSEWORKSPACE-007`
- **Work:** Normalize format-specific prices and schedules in editor, server, public output, and checkout.
- **Done when:** Only active tiers can be published, displayed, or purchased. Evidence: focused commerce tests, Convex TypeScript check, `npm run lint`, `npm run build`, and Chrome Recorded-mode validation passed on 2026-10-22.
- **Dependencies:** TASK-001, TASK-002

### TASK-007: Remove draft lifecycle

- **Status:** Complete
- **Requirements:** `REQ-COURSEWORKSPACE-008`
- **Work:** Remove draft from contracts, editor state, Convex mutations, public queries, and checkout rules; add and document the one-time draft deletion migration.
- **Done when:** New and edited courses always persist as published, archived courses remain unavailable, draft cleanup mutation is present, and focused checks plus build/lint pass. Evidence: published-only contract tests, Convex typecheck, `npm run lint`, `npm run build`, and focused commerce tests passed on 2026-10-22.
- **Dependencies:** TASK-006

### TASK-008: Polish editor interactions and duration previews

- **Status:** Complete
- **Requirements:** `REQ-COURSEWORKSPACE-009`
- **Work:** Stabilize achievement row identity, replace the icon dropdown with an inline horizontal picker, centralize deterministic weeks calculation, and clarify cohort archival guidance.
- **Done when:** Focused component/unit tests, lint, and build pass, with no loss of editor focus or preview reactivity. Evidence: `CourseEditorSections.test.tsx` and `utils.test.ts` passed, plus `npm run lint` and `npm run build` on 2026-10-22.
- **Dependencies:** TASK-003, TASK-006

### TASK-009: Add explicit course restoration

- **Status:** Complete
- **Requirements:** `REQ-COURSEWORKSPACE-010`
- **Work:** Add the authorized restore mutation, preserve archived status during edits, and make admin course actions status-aware.
- **Done when:** Restore validation, schedule reactivation, authorization, UI actions, focused tests, lint, and build are complete. Evidence: 11 focused tests, ESLint, and production build passed on 2026-10-22.
- **Dependencies:** TASK-007, TASK-008
