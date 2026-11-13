---
title: Correct course access copy
status: draft
owner: Product owner
created: 2026-11-12
updated: 2026-11-12
change-key: ACCESSCOPY
---

# Specification: Correct course access copy

## Problem

During the deployed manual-readiness smoke on 2026-11-12, the course hero displayed “Acceso de por vida” while the checkout correctly stated that passing the exam ends content access. The source is `src/components/course/CourseHero.tsx`. This contradicts REQ-SIMPLE-006 and the course-run access policy.

## REQ-ACCESSCOPY-001: Consistent access description

The course hero must describe the existing run-based access policy without promising lifetime access.

Acceptance: on live, recorded and hybrid course detail pages, no lifetime-access promise appears; the hero and checkout agree that passing ends access. Backend access rules remain unchanged.

## Constraints and non-goals

Copy-only correction. No pricing, enrollment, exam, routing or entitlement change. Draft only: no runtime implementation is authorized by this defect record.

## Open questions

Approve the correction and final Spanish wording before implementation.
