# Fuega Academy - Agent Instructions

## Commands & Verification
- **Build & Typecheck:** `npm run build` (runs `tsc -b && vite build`)
- **Linting:** `npm run lint` (runs `oxlint`)
- **Development Server:** `npm run dev` (Vite dev server)
- **Required Verification Order:** Always run `npm run build` after making changes to verify TypeScript strict mode and Vite bundling.

## Tech Stack & Architecture
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, React Router v7.
- **UI Primitives:** Radix UI primitives (`@radix-ui/react-accordion`, `tabs`, `dialog`, `dropdown-menu`, `tooltip`) wrapped in `src/components/ui/`.
- **Backend / Database:** Convex (`convex/schema.ts`, client initialized via `src/lib/convex.ts`).
- **Internationalization (i18n):** `i18next` with locales (`en`, `es`, `pt`) under `src/locales/`.

## Key Directories
- `src/components/ui/`: Reusable primitive components (Button, Card, Accordion, Tabs, Dialog, DropdownMenu, Tooltip).
- `src/components/shared/`: Shared feature components (CourseCard, PolaroidFrame, etc.).
- `src/components/home/`: Landing page sections.
- `src/components/dashboard/`: Student dashboard views and widgets.
- `src/pages/`: Page entrypoints (`Home.tsx`, `CoursesPage.tsx`, `CoursePage.tsx`, `Dashboard.tsx`).
- `src/locales/`: Translation resource JSON files (`common.json`, `home.json`, `dashboard.json`).
- `convex/`: Backend schema and functions.

## Agents & Subagents Routing
Whenever a request is made related to a specific domain or topic, delegate to the corresponding specialized agent/subagent:
- **`frontend-component`** (`.opencode/agents/frontend-component.md`): Use for any task involving building or refactoring React components. Enforces self-contained component architecture (direct Convex queries/mutations inside components to avoid prop drilling and optimize pricing/cost efficiency), Radix UI primitives, Tailwind v4 styling, and i18n parity (`en`, `es`, `pt`).
- **`convex-architect`** (`.opencode/agents/convex-architect.md`): Use for any task involving Convex backend design, modular schemas (`zodOutputToConvex`), Zod v4 validators, custom query/mutation wrappers, relational triggers, and database indexing.

## Conventions & Gotchas
- **Path Aliases:** `@/` maps to `./src/` in Vite and TypeScript.
- **Styling:** Tailwind CSS v4 with Material Design 3 tokens.
- **i18n:** Ensure all new user-facing text is added across `en`, `es`, and `pt` translation JSON files.
- **Schedules / Capacity:** Course schedules support multi-session weekly blocks with capacity and enrollment tracking (`schedules` table in Convex schema).

## Agent Interaction Rule: Code Review & Permission
- **Always Show Code & Ask Permission:** Agents must **ALWAYS** present the proposed code/changes and explicitly ask for user permission before writing, editing, or implementing any piece of code.
