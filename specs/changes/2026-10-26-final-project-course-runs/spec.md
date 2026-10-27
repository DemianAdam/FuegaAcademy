---
title: "Final Project Course Runs"
status: approved
owner: "Product owner"
created: 2026-10-26
updated: 2026-10-26
change-key: "RUNS"
---

# Specification: Final Project Course Runs

## Summary

Administrators can require a final project for a course. Students submit a project file for their active enrollment, an administrator reviews it, and approval completes that run and unlocks a new paid run.

## Requirements

### REQ-RUNS-001: Configurable final project

Administrators must be able to configure whether a course requires a final project. Existing courses default to not requiring one.

### REQ-RUNS-002: Secure student submission

An active student enrollment in a course requiring a final project must be able to submit one PDF, supported image, or ZIP file no larger than 25 MB. Only the submitting student and administrators may access the file.

### REQ-RUNS-003: Administrator review

Administrators must be able to approve or reject submitted projects with optional feedback. Rejected work may be reopened only by an administrator.

### REQ-RUNS-004: Repeat course run

Approval must mark that enrollment completed. Only a completed enrollment for a course requiring a final project may unlock a new paid active enrollment for that course. New runs retain separate order and submission history.

## Constraints

- Project files are limited to PDF, JPEG, PNG, WebP, GIF, and ZIP files up to 25 MB.
- Courses that do not require a final project remain non-repeatable.

## Open Questions

None.
