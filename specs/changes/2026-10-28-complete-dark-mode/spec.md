---
title: Complete dark mode with muted blue
status: verified
owner: Fuega Academy
created: 2026-10-28
updated: 2026-10-28
change-key: DARK
---

# Complete dark mode

## Summary and approval
Replace dark-mode lime with muted blue on neutral charcoal throughout public, student and admin screens. Preserve light-mode design except shared readability defects. The user approved the complete chat plan and implementation in a new worktree on 2026-10-28 ("Ok implement on a new worktree branch"). This package records that approved specification before runtime changes.

The user requested and authorized a darker, less tinted background on 2026-10-28. This revision lowers the neutral surface scale and reduces blue/purple saturation in large containers while retaining the approved accent colors.

## Requirements

### REQ-DARK-001: Consistent palette
Dark mode must use #0B0C0E background, #141517 panels, #1C1D20 elevated surfaces, #252629 hover surfaces, #E8EAED text, #ABB4C0 secondary text, #303236 decorative borders, #778393 control boundaries, #8AB4F8 primary accent, #101C2E primary-button text, #1B2533 selected containers and #D3E3FD container text. Lavender is secondary; large panels are neutral and neon glows are absent. Given either theme, all semantic foreground/background pairs must remain readable, including promotional panels, badges and status messages. Original image and third-party logo colors remain unchanged. Light styling stays visually consistent except readability fixes.

### REQ-DARK-002: Reliable preference lifecycle
Given a valid saved preference, initial paint and React must agree on light/dark/system resolution. Missing or invalid preferences use System. OS changes affect System only; valid cross-tab changes synchronize and preference removal restores System. Storage failures must not crash rendering or disable in-session selection. Native controls must use the resolved color scheme.

### REQ-DARK-003: Accessible controls everywhere
Visitors, students and admins must access Claro/Oscuro/Sistema on desktop and mobile, including the course editor. The menu must expose radio selection and a visible checked indicator, with keyboard operation and visible focus.

### REQ-DARK-004: Complete screen and state coverage
Public catalog, teachers, authentication, student dashboard, classroom, checkout, admin queues and course editor/preview must inherit the theme. Shared controls, portals, loading, empty, error, invalid and disabled states must remain readable. Normal text must reach 4.5:1 contrast; large text and essential control/focus indicators 3:1. Reduced motion must remain supported.

### REQ-DARK-005: Regression evidence
Production CSS/bootstrap must be exercised by deterministic browser fixtures for visitor, student and administrator scenarios without real payments. Tests must cover lifecycle, responsive controls, contrast and representative screenshots in both themes; run the aggregate gate and relevant browser tests.

## Constraints and non-goals
No backend, schema, route, payment, layout or typography redesign. No account-level preference persistence. Preserve unrelated baseline changes. No new dependencies are needed.

## Open questions
None.
