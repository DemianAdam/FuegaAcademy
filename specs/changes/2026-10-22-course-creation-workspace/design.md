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
- Shared commerce helpers derive active tiers from format, normalize stored/editor pricing, and validate published courses. Convex uses them before persistence and checkout preference creation.

## Failure and Security Behavior

Slug creation and conflict resolution are server-only. Existing admin authorization, payment validation, and enrollment flows are unchanged. Invalid module ownership or invalid editor data reject the mutation.

## Rollout and Compatibility

Existing module `items` are converted to lessons on read and persisted as lessons when an administrator saves the course. No URL aliases are created.

Recorded saves archive all schedules; public queries omit any legacy Recorded schedules and inactive pricing. Every create and update validates a positive ARS price for every active tier and an active schedule for Live or Hybrid before persisting the course as published.

The published-only lifecycle removes `draft` from shared contracts, Convex course storage validation, editor state, public queries, and checkout rules. A one-time internal migration must run before the schema contract is deployed: it deletes every draft course and its related modules and schedules. Archived courses remain stored, non-public, and unavailable for checkout.

The split workspace retains the editor and preview. Focus mode hides the editor without unmounting it, so unsaved draft state and selected viewport are retained. Escape exits focus mode and returns focus to its trigger.

Achievement rows receive client-only stable identities so editable text never participates in React keys. Icon browsing is an inline horizontal rail with search, selected-state styling, and keyboard-accessible previous/next controls. Course weeks remain derived from total classes and the most common active-cohort session cadence; ties use first appearance and no schedules fall back to two sessions per week. Removed saved cohorts continue through the existing soft-archive synchronization because enrollment and order history must remain addressable.

Course restoration is a separate authorized mutation from editing. It normalizes pricing, reactivates all associated schedules for Live and Hybrid courses, validates publish readiness, and changes status to `published` only after validation succeeds. Recorded restoration leaves schedules inactive. Archived edits preserve `archived` status until the administrator explicitly restores the course.

## Test Strategy

Test slug collision/update behavior, mutation persistence and authorization, legacy conversion, editor/preview interactions, format-aware commerce, and editor interaction polish for REQ-COURSEWORKSPACE-001 through `009`.

## Decisions

No ADR is required; this does not change a durable architecture boundary.
