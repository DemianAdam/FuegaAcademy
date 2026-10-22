# Design: Course Creation Workspace Redesign

## Technical Summary

Split editor-only course input from persisted public course data. Convex derives a unique slug and synchronizes schedules and curriculum in the existing authorized mutations. Extract public display layouts so persisted courses and editor drafts share them.

## Interfaces and Data

- Admin create/update inputs omit `slug` and include modules with lessons.
- Stored courses retain `slug`; stored modules retain legacy `items` while adding normalized `lessons` for compatibility.
- A lesson has `title`, optional/zero `durationMinutes`, and optional/empty `description` to preserve converted legacy content.

## Data and Control Flow

- Admin input is validated in shared schemas, authorized in Convex, slugged server-side, and saved with schedules and modules.
- The editor maps its local draft plus selected teacher to the public layout contract; its sidebar runs in preview mode and cannot call checkout.
- A preview frame owns the selected device viewport and focus-mode interactions. The public page continues to use viewport breakpoints; preview markup uses a container-query boundary so it responds to the canvas width.

## Failure and Security Behavior

Slug creation and conflict resolution are server-only. Existing admin authorization, payment validation, and enrollment flows are unchanged. Invalid module ownership or invalid editor data reject the mutation.

## Rollout and Compatibility

Existing module `items` are converted to lessons on read and persisted as lessons when an administrator saves the course. No URL aliases are created.

The split workspace retains the editor and preview. Focus mode hides the editor without unmounting it, so unsaved draft state and selected viewport are retained. Escape exits focus mode and returns focus to its trigger.

## Test Strategy

Test slug collision/update behavior, mutation persistence and authorization, legacy conversion, and editor/preview interactions for REQ-COURSEWORKSPACE-001 through `006`, including canvas breakpoints and focus-mode keyboard behavior.

## Decisions

No ADR is required; this does not change a durable architecture boundary.
