---
title: "Flexible image sources for courses and teachers"
status: approved
owner: "product owner"
created: 2026-10-22
updated: 2026-10-22
change-key: "IMAGES"
---

# Specification: Flexible image sources for courses and teachers

## Summary

Administrators can supply each course and teacher image from either an external URL or Convex File Storage.

## Goals

- Support external URLs and administrator uploads for course card/hero images, course polaroids, and teacher avatars.
- Keep existing externally hosted catalog images working without a migration.
- Safely validate, attach, replace, and clean up uploaded public images.

## Non-Goals

- Image transforms, crops, private media, and migration of static marketing images.

## Requirements

### REQ-IMAGES-001: Select an image source

Administrators must be able to select either an external URL or an uploaded image for every supported image role.

Acceptance criteria:

- **Given** an administrator edits a course or teacher, **when** they select a source, **then** exactly one source is persisted for that role.
- **Given** an existing URL-backed record, **when** it is displayed, **then** its image remains available.

### REQ-IMAGES-002: Secure uploads

The backend must authorize uploads and accept only JPEG, PNG, WebP, or GIF files no larger than 5 MB.

Acceptance criteria:

- **Given** a non-administrator, **when** they request or register an upload, **then** the backend rejects it.
- **Given** an invalid uploaded file, **when** it is registered, **then** it cannot be attached to a domain record.

### REQ-IMAGES-003: Render uploaded images

Catalog and administration queries must resolve stored image IDs to renderable public URLs while retaining their existing display URL fields.

Acceptance criteria:

- **Given** a record with a stored image, **when** it is queried, **then** its existing image URL presentation field contains a usable URL.

### REQ-IMAGES-004: Manage image lifecycle

Replacing or clearing an uploaded image must delete it only after its final course/teacher reference is gone; archived records retain their media.

Acceptance criteria:

- **Given** an image still has a reference, **when** another reference is replaced, **then** the shared object remains.
- **Given** a pending upload is never attached, **when** cleanup runs after its retention period, **then** it is removed.

## Constraints

- Convex Storage URLs are acceptable bearer URLs because all covered images are public catalog assets.
- Upload originals are preserved unchanged.

## Open Questions

None.
