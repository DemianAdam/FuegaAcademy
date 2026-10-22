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
