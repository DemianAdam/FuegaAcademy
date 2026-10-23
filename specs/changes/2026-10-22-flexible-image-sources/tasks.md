# Tasks: Flexible image sources for courses and teachers

### TASK-001: Define media contracts and persistence
- **Status:** Complete
- **Requirements:** `REQ-IMAGES-001`, `REQ-IMAGES-002`
- **Work:** Add image-source validation and the media registry schema.
- **Done when:** Sources are runtime validated and schema generation succeeds.

### TASK-002: Add trusted Convex media lifecycle
- **Status:** Complete
- **Requirements:** `REQ-IMAGES-002`, `REQ-IMAGES-004`
- **Work:** Add authorized upload registration, attachment validation, cleanup, and reference-safe deletion.
- **Done when:** Domain mutations use the lifecycle helpers.

### TASK-003: Integrate courses, teachers, and editors
- **Status:** Complete
- **Requirements:** `REQ-IMAGES-001`, `REQ-IMAGES-003`, `REQ-IMAGES-004`
- **Work:** Resolve stored URLs in queries and provide URL/upload controls in both editors.
- **Done when:** Both source choices save and preview.

### TASK-004: Verify implementation
- **Status:** In progress
- **Requirements:** `REQ-IMAGES-001`, `REQ-IMAGES-002`, `REQ-IMAGES-003`, `REQ-IMAGES-004`
- **Work:** Run focused and aggregate checks; record evidence.
- **Done when:** Applicable checks and requirement evidence are recorded. `npm run check` is currently blocked by the pre-existing commented `convex/orders/internal.test.ts` file, which Vitest treats as an empty suite.
