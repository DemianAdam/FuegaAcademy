---
title: "Course Creation Workspace Redesign"
status: approved
owner: "product owner"
created: 2026-10-22
updated: 2026-10-22
change-key: "COURSEWORKSPACE"
---

# Specification: Course Creation Workspace Redesign

## Summary

Administrators can create and edit courses in a guided workspace with accurate live previews of the public course page and catalog card.

## Goals

- Make course metadata, outcomes, curriculum, schedules, and pricing practical to author in one editor.
- Generate collision-safe public course URLs from titles on the server.
- Render previews from the production course display components.
- Keep the course-page preview readable in the split editor and inspectable in a focused workspace.
- Make course format authoritative for active prices, schedules, public purchase choices, and checkout eligibility.

## Non-Goals

- Media upload, hosted video playback, URL redirects, and payment-flow changes.

## Requirements

### REQ-COURSEWORKSPACE-001: Guided course workspace

The administrator editor must group the course form into compact Spanish-language sections and keep save and cancel actions available.

Acceptance criteria:

- **Given** an administrator opens a new or existing course
- **When** they edit a section
- **Then** the edited draft is retained and can be saved with the existing authorization model.

### REQ-COURSEWORKSPACE-002: Server-owned course URL

The course slug must be generated from the title by the server for creation and title changes.

Acceptance criteria:

- **Given** a title whose normalized URL is already in use
- **When** an administrator saves the course
- **Then** the server stores the next available numeric-suffixed slug.

### REQ-COURSEWORKSPACE-003: Outcome authoring

Administrators must choose achievement icons from a searchable curated Material Symbols picker and manage outcome order, text, highlighting, and removal.

### REQ-COURSEWORKSPACE-004: Curriculum and lessons

Administrators must manage ordered modules and ordered lessons, where lessons have title, duration, and description. Existing module topic strings must be converted to lessons without loss of their titles.

### REQ-COURSEWORKSPACE-005: Faithful safe previews

The editor must provide card and interactive desktop/mobile course-page previews rendered through shared production display components. Preview enrollment controls must not initiate checkout.

### REQ-COURSEWORKSPACE-006: Responsive preview canvas

The page preview must respond to its actual canvas width and must offer desktop, tablet, mobile, and focused workspace viewing without scaling text into an unreadable miniature.

Acceptance criteria:

- **Given** the normal split editor is open
- **When** the preview canvas is narrower than the browser viewport
- **Then** course-page sections use a readable compact layout based on the canvas width.
- **Given** an administrator opens the focused preview
- **When** they inspect or exit it with the return control or Escape
- **Then** the full workspace displays the page preview and the unchanged editor draft is restored on return.

### REQ-COURSEWORKSPACE-007: Format-aware commerce

The course format must determine active commerce tiers: Live supports only live price and schedules, Recorded supports only recorded price and no active schedules, and Hybrid supports both prices and schedules.

Acceptance criteria:

- **Given** an administrator saves a course in a single-tier format
- **When** the course is saved
- **Then** incompatible pricing is removed and Recorded schedules are archived.
- **Given** a course is published
- **When** an active price is missing or a live-capable format has no active schedule
- **Then** the server rejects publication.
- **Given** a visitor views or attempts checkout for a single-tier course
- **When** they use the purchase panel or send an incompatible tier
- **Then** only the compatible tier is displayed and accepted.

### REQ-COURSEWORKSPACE-008: Published-only course lifecycle

Courses must not have a draft state. Every create and update saves a fully validated published course; archived remains the only non-public lifecycle state.

Acceptance criteria:

- **Given** an administrator creates or edits a course
- **When** they save it
- **Then** the course is published immediately or the save is rejected with actionable validation errors.
- **Given** an existing course has `draft` status
- **When** the one-time cleanup migration runs
- **Then** its course record, modules, and schedules are permanently deleted.
- **Given** a course is archived
- **When** a public query or checkout request is made
- **Then** the course is unavailable.

### REQ-COURSEWORKSPACE-009: Editor interaction polish

Achievement editing, icon selection, duration previews, and schedule guidance must remain stable and understandable while administrators author a course.

Acceptance criteria:

- **Given** an administrator edits an achievement
- **When** they type, reorder, or remove it
- **Then** the row keeps its identity and input focus is not lost.
- **Given** an administrator chooses an achievement icon
- **When** they search or browse
- **Then** an inline, keyboard-accessible horizontal icon rail filters and selects icons without a dropdown remount.
- **Given** a course has active cohorts with different weekly cadences
- **When** its duration is previewed
- **Then** weeks use the most common sessions-per-week cadence, with first-seen tie breaking and a two-session fallback.
- **Given** an administrator removes a saved cohort
- **When** the course is saved
- **Then** the cohort is hidden from future enrollment but retained as archived history.

### REQ-COURSEWORKSPACE-010: Explicit course unarchive

Administrators must be able to return an archived course online through an explicit, authorized action.

Acceptance criteria:

- **Given** an archived Live or Hybrid course
- **When** an administrator chooses “Poner online”
- **Then** all associated schedules are reactivated, commerce readiness is validated, and the course becomes published.
- **Given** an archived Recorded course
- **When** an administrator chooses “Poner online”
- **Then** the course becomes published without active schedules.
- **Given** an archived course has invalid active pricing or no required schedule
- **When** restoration is attempted
- **Then** the mutation rejects the request and the course remains archived.
- **Given** an archived course is edited without restoration
- **When** it is saved
- **Then** it remains archived.

## Constraints

- Public course URLs intentionally expire after a title-driven slug change.
- Mercado Pago and enrollment authorization behavior remain unchanged.
- Existing draft course data is intentionally deleted by a one-time migration before the stored status contract removes `draft`.
- Restoring a course reactivates all schedules associated with it because schedule archive provenance is not stored.

## Open Questions

None.
