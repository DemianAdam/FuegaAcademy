# Design: Flexible image sources for courses and teachers

## Technical Summary

Image sources are a discriminated shared contract. Domain documents retain their legacy URL fields as optional compatibility data and add a source field for new records. Queries resolve storage IDs with `ctx.storage.getUrl()` and preserve their presentation URL fields. A media registry validates uploaded storage objects before domain mutations attach them.

## Interfaces and Data

- `ImageSource` is either `{ kind: "external", url }` or `{ kind: "storage", storageId }`.
- `media.generateUploadUrl` and `media.registerUpload` are administrator-only mutations.
- `mediaAssets` records validated uploads and attachment state; its storage ID index prevents duplicate registration.

## Data and Control Flow

The browser validates the selected file, obtains an authorized upload URL, uploads directly to Convex, registers the returned storage ID, and places the resulting storage source in editor state. Course and teacher mutations validate and attach sources. They release replaced sources only when no course or teacher still references them.

## Failure and Security Behavior

Server-side metadata checks enforce MIME type and size. Registering or attaching an unregistered storage ID fails. The upload URL and registry mutations use the existing administrator context. Failed browser uploads leave no persisted domain reference.

## Rollout and Compatibility

No data migration is required. Existing `imageUrl` and `polaroidImage` records remain the fallback until an administrator saves a selected source.

## Test Strategy

Shared validation tests cover mutually exclusive sources and accepted forms. Backend and UI behavior are covered by focused tests where the Convex test runtime supports storage metadata; aggregate checks provide type and lint evidence.

## Decisions

No ADR is required; this is a scoped domain persistence extension.
