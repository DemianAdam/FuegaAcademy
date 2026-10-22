# Product Context

## Purpose

Fuega Academy is a Spanish-language course platform for publishing and selling courses, managing teachers and schedules, and giving enrolled students access to their learning dashboard.

## Users

- **Visitors** browse the home page, published courses, course details, and teachers, and can register or sign in.
- **Students** view their dashboard and enrolled courses and can purchase available course access.
- **Administrators** manage courses, teachers, modules, schedules, and the catalog presented to students.

Authorization-sensitive capabilities must be enforced by Convex functions; the role-aware frontend is only the presentation layer.

## Current Capabilities

- Public course and teacher discovery.
- Course detail pages with live or recorded access options where configured.
- Password and Google authentication through Convex Auth.
- Student and administrator route areas.
- Course, teacher, curriculum, and schedule administration.
- Mercado Pago checkout, webhook reconciliation, orders, and enrollment creation.

## Current Scope Boundaries

- The MVP UI and catalog content are Spanish-only.
- URLs are not language-prefixed, and catalog content is stored directly on its domain records.
- Mercado Pago is the only payment provider.
- Monetary values use integer Argentine peso minor units (`ARS`).
- Development and automated testing must not initiate real payments.

Changes to these boundaries require an approved change specification and, when durable or cross-cutting, an ADR.

## Product Principles

- Enrollment access follows authoritative payment confirmation, never a client redirect.
- Catalog information shown to users must come from the same validated domain model used by the backend.
- Administrative convenience must not weaken authorization, payment validation, capacity, or idempotency guarantees.
- User-visible behavior must be expressible as testable acceptance criteria.
