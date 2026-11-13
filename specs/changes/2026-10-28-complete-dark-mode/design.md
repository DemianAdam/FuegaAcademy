# Design

Use src/index.css as the authoritative semantic palette with paired background/foreground tokens, theme-aware action/status colors and fixed promotional surfaces. Replace literal branding utility usage with semantic roles; remove the unused legacy Tailwind configuration after consumer audit and duplicate CSS.

A blocking public/theme-init.js script establishes the root class and color-scheme before styles/body paint. A small shared browser runtime on window supplies normalization, safe reading and applying to ThemeProvider, preventing divergent bootstrap/provider rules. Keep Theme, ThemeContext and fuega-theme compatible. React subscribes to OS and storage changes and cleans up listeners. Failures fall back to System and in-memory selection.

Expose accessible Radix radio items through existing dropdown primitives. Add selectors to student desktop/mobile shells and editor toolbar. Paired colors cover forms, portals and domain status states. The editor preview inherits the document theme.

The e2e fixture loads the same public script, production CSS and fonts, using only its mock Convex transport; extend transport for admin data. Browser tests measure computed colors, exercise preferences and capture responsive screenshots. Unit tests cover storage errors and cleanup. No data migration or backend deployment is required. Rollback is the frontend change. No cross-cutting backend ADR is needed.

## Implementation notes

- The existing `tailwind.config.js` had no `@config` or import consumers under the CSS-based Tailwind pipeline; its duplicate definitions were removed without changing active typography or spacing.
- Dark inverse promotional surfaces now use neutral panels; light inverse surfaces retain their prior colors. Focus on fixed dark promotional sections uses the action accent. Native field boundaries use outline rather than decorative outline-variant.
- Minor responsive toolbar wrapping and admin-tab horizontal scrolling keep the selector reachable without changing routes or business behavior.
- The fixture gallery is selected only by the e2e entrypoint. It cannot be reached from the production router. The existing mock-browser suite does not need a live Convex deployment; no production backend tooling was invoked.

## Darker background revision

User-authorized refinement: near-black #0B0C0E canvas, #141517 panels, #1C1D20 elevation and #252629 hover surfaces. Decorative outlines become #303236, selected containers #1B2533 and secondary containers #201F25. This reduces broad blue/purple casts without altering accent, text, status or light-theme colors.
