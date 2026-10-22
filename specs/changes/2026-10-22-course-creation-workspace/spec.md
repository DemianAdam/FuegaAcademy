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

## Constraints

- Public course URLs intentionally expire after a title-driven slug change.
- Mercado Pago and enrollment authorization behavior remain unchanged.

## Open Questions

None.
