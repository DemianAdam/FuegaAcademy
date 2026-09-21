# i18n-audit

## Overview
Guidelines and automated inspection checks for internationalization keys across `src/locales/{en,es,pt}/`.

## Key Rules
1. **Translation Parity Check:** Ensure that every key present in `src/locales/en/` has corresponding equivalents in `src/locales/es/` and `src/locales/pt/`.
2. **Namespace Integrity:** Keep translation files organized by domain (`common.json`, `home.json`, `courses.json`, etc.).
3. **No Hardcoded Strings:** User-facing text in components must use the `useTranslation()` hook and translation keys rather than hardcoded literals.
4. **Interpolation Verification:** Validate that template variables match across all languages.
