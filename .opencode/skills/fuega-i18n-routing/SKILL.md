---
name: fuega-i18n-routing
description: Hybrid i18n, /:lang route prefixing, localStorage caching, browser-native fallback, and missing language telemetry for Fuega Academy. Use when implementing or refactoring internationalization and routing.
---

# Fuega Academy: Hybrid i18n, /:lang Routing & Telemetry Plan

## 1. Executive Summary & Goals
- **Localized URLs (`/:lang` routes):** Full locale-prefixed routing (`/en/...`, `/es/...`, `/pt/...`) for SEO and shareable deep-linking.
- **Smart First-Time Visitor Detection:** Automatically detect visitor language from `localStorage` or `navigator.language`, with intelligent root redirection (`/` -> `/:lang`).
- **Hybrid Translation Architecture:**
  - Instant initial load using bundled static English (`en`) JSON translation files.
  - Database-driven overrides and additional languages stored in Convex and loaded dynamically into i18next.
  - `localStorage` caching for instant subsequent loads and offline resilience.
- **Browser-Native Fallback & Missing Language Telemetry:** Unsupported languages fall back to English (triggering browser native translation prompts), while recording telemetry in Convex (`missingLanguages` table) to power an admin dashboard tracking requested languages.
- **Admin Translation Manager:** An admin UI in Convex/Dashboard to view, edit, and add translation strings or new languages without code deployments.

## 2. Technical Architecture & Component Design
### A. Convex Backend Schema (`convex/schema.ts`)
- **`translations` Table:**
  - Fields: `key` (string), `namespace` (string), `language` (string), `value` (string), `updatedAt` (number).
  - Indexes: `.index("by_lang_ns_key", ["language", "namespace", "key"])`.
- **`missingLanguages` Table:**
  - Fields: `languageCode` (string), `count` (number), `lastRequestedAt` (number).
  - Indexes: `.index("by_lang", ["languageCode"])`.

### B. i18n & Hydration (`src/lib/i18n.ts` & `src/lib/LanguageContext.tsx`)
- **Static Fallback:** i18next initializes with bundled static `en` JSON files (`src/locales/en/*.json`) for zero-latency first paint.
- **Convex Hydration:** When LanguageProvider mounts or language changes, it fetches translation bundles for the active language from Convex (`api.translations.getByLanguage`) and injects them via `i18n.addResourceBundle()`.
- **Caching:** Cached in `localStorage` for high performance.

### C. Routing & Navigation (`src/App.tsx` & `src/components/shared/LocalizedLink.tsx`)
- **Routes:**
  - Root `/`: Smart redirect to `/:detectedLang` (e.g., `/en`, `/es`, `/pt`).
  - `/:lang?` routes for MainLayout (Home, CoursesPage, CoursePage).
  - `/:lang/dashboard` for Dashboard.
- **`<LocalizedLink>` Component:** Wrapper around React Router `<Link>` that automatically prepends `/${language}` to all internal paths.

### D. Telemetry & Fallback for Unsupported Languages
- If `navigator.language` matches a language not natively supported (and not in Convex):
  - Falls back to `en` (letting the browser offer native translation).
  - Fires a lightweight Convex mutation `api.languages.reportMissingLanguage` to track user demand.

## 3. Step-by-Step Implementation Sequence
- **Step 1 (Convex Backend):** Add `translations` and `missingLanguages` tables to `convex/schema.ts`. Create Convex queries/mutations in `convex/translations.ts` and `convex/languages.ts`.
- **Step 2 (i18n & Context Refactoring):** Update `src/lib/i18n.ts` and `src/lib/LanguageContext.tsx` to support asynchronous Convex translation bundle loading and `localStorage` caching.
- **Step 3 (Localized Routing & Link Component):** Create `src/components/shared/LocalizedLink.tsx`. Update `src/App.tsx` with `/:lang?` route wrappers and root language redirection.
- **Step 4 (Navigation & UI Updates):** Update `Header.tsx` and `LanguageSlider.tsx` to use `<LocalizedLink>` and synchronize URL parameters with `i18n.changeLanguage()`.
- **Step 5 (Admin Dashboard):** Implement the missing languages telemetry widget and translation editor UI in the admin section.
