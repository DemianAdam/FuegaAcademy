# Fuega Academy

Fuega Academy is a React 19, TypeScript, Vite, and Convex application for Spanish-language course publishing, administration, checkout, and student enrollment.

## Development

Requirements: Node.js 22+, npm, and access to the Fuega Convex development deployment.

```bash
npm ci
npx convex dev
npm run dev
```

Copy `.env.example` to `.env.local` and set only browser-safe values there. Payment credentials are backend-only Convex environment variables and must never use a `VITE_` prefix.

### Stable public development URL

Mercado Pago return URLs must remain stable while testing. Reserve an ngrok static development domain in your ngrok account, then set its hostname (without `https://`) in your local shell profile:

```powershell
setx NGROK_STATIC_DOMAIN "fuega-dev.ngrok-free.app"
```

Open a new terminal after running `setx`. Start the application and tunnel in separate terminals:

```powershell
npm run dev
npm run tunnel
```

If Windows terminals do not inherit the saved variable, add `NGROK_STATIC_DOMAIN=fuega-dev.ngrok-free.app` to your ignored `.env.local`; `npm run dev:public` reads it automatically.

For the easiest all-in-one workflow, open a new terminal after setting `NGROK_STATIC_DOMAIN` and run:

```powershell
npm run dev:public
```

This starts Vite, waits for `http://localhost:3000`, starts ngrok with the reserved hostname, and stops both processes when you press `Ctrl+C`.
It requires port 3000 to be free; stop any separately running Vite process first.

Set the Convex development deployment's `SITE_URL` once to `https://fuega-dev.ngrok-free.app`. The tunnel targets this project's configured Vite port, `3000`. Do not commit an ngrok auth token or the static hostname into application runtime configuration. The `tunnel` script refuses URLs, paths, and non-ngrok hostnames so the command cannot accidentally expose an arbitrary target.

Required runtime configuration:

- `VITE_CONVEX_URL`: public Convex client URL used by the browser.
- `SITE_URL`: canonical application origin used for Mercado Pago return URLs.
- `MP_ACCESS_TOKEN`: Mercado Pago test credential used only by Convex actions.
- `MP_WEBHOOK_SECRET`: Mercado Pago webhook signing secret used only by the Convex HTTP endpoint.
- `CONVEX_SITE_URL`: Convex HTTP actions origin used as the notification URL.

OAuth used by the Mercado Pago MCP is tooling authentication; it does not replace the backend test access token required by the application.

## Architecture and SDD

The repository uses a native Spec-Driven Development lifecycle: `draft → approved → implemented → verified`.

- [`specs/README.md`](specs/README.md) defines the lifecycle, naming, approval, and traceability rules.
- [`specs/_meta`](specs/_meta) records the current product, architecture, and quality baselines.
- [`specs/changes`](specs/changes) contains requirement specifications, designs, task plans, and verification evidence.
- [`specs/decisions`](specs/decisions) contains architecture decision records.
- [`AGENTS.md`](AGENTS.md) defines repository instructions for coding agents.
- `src/app`: application composition, providers, routing, guards, and error boundaries.
- `src/features`: feature-owned UI and behavior.
- `src/shared`: frontend-only generic helpers.
- `shared`: transport-safe Zod schemas and domain utilities shared with Convex.
- `convex`: public, authenticated, administrator, and internal server boundaries.

Change packages use task files to plan approved implementation work; requirements and recorded verification evidence remain the source of traceability.

The MVP is Spanish-only. Application URLs are not language-prefixed, and catalog content is stored directly on course, module, and teacher records.

## Commerce safety

Mercado Pago is the only payment provider. Prices and immutable order snapshots use integer ARS minor units. A return URL never activates access. Enrollment is created only after a signed webhook has been checked against the authoritative payment for external reference, amount, currency, preference, payer, and approved status. Repeated notifications are processed idempotently.

Set test credentials only in the development deployment while developing. Never commit tokens, webhook secrets, OAuth state, or user-scoped MCP configuration.

## MCP tooling

The user-scoped Codex configuration defines:

- `fuega-convex`: local STDIO, locked to `--deployment dev`, with all environment-variable tools disabled.
- `mercadopago`: the official remote HTTP MCP authenticated by OAuth with a Mercado Pago test account.

Both servers use prompt approval. Payments, refunds, credential changes, data mutations, and other state-changing MCP calls require explicit user approval. The actual `config.toml` and OAuth credentials remain outside this repository.

## Quality commands

```bash
npm run lint
npm run lint:ox
npm run test
npm run build
npm run test:bundle
npm run test:e2e
```

`npm run check` runs every deterministic static/unit/build gate except Playwright. Playwright needs a reachable development Convex deployment and never performs a real payment.

## Deterministic development data

After confirming `CONVEX_DEPLOYMENT=dev:...`, synchronize functions and seed normalized development data:

```bash
npx convex dev --once
npx convex run teachers/seed:seedTeachers
npx convex run courses/seed:seedCourses
```

The seeds upsert Spanish course and teacher content, modules, and stable schedules. They are development-only.
