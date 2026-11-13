import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { loadEnv } from 'vite';

export const expectedDeployment = 'dev:canny-raven-235';
export const expectedCloud = 'https://canny-raven-235.convex.cloud';
export const expectedSite = 'https://canny-raven-235.convex.site';
export const browserOrigin = 'https://eternal-informally-shad.ngrok-free.app';

export function parseArgs(args) {
  let session;
  let dryRun = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--session' && session === undefined) session = args[++i];
    else if (args[i] === '--dry-run' && !dryRun) dryRun = true;
    else throw new Error('Usage: npm run prepare:manual -- --session <name> [--dry-run]');
  }
  if (!session || session.length < 3 || session.length > 40 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(session)) {
    throw new Error('Supply --session with 3–40 lowercase letters/digits separated by single hyphens.');
  }
  return { session, dryRun };
}

export function assertLocalTarget(localEnv, shellEnv) {
  for (const env of [localEnv, shellEnv]) {
    for (const key of ['CONVEX_DEPLOY_KEY', 'CONVEX_DEPLOYMENT_TOKEN', 'CONVEX_SELF_HOSTED_URL', 'CONVEX_SELF_HOSTED_ADMIN_KEY']) {
      if (env[key]) throw new Error(`Unset ${key} before preparing manual fixtures; use your normal development login.`);
    }
    if (env.CONVEX_DEPLOYMENT && env.CONVEX_DEPLOYMENT !== expectedDeployment) {
      throw new Error(`CONVEX_DEPLOYMENT must be ${expectedDeployment}.`);
    }
    if (env.VITE_CONVEX_URL && env.VITE_CONVEX_URL !== expectedCloud) {
      throw new Error(`VITE_CONVEX_URL must be ${expectedCloud}.`);
    }
  }
  if (localEnv.CONVEX_DEPLOYMENT !== expectedDeployment || localEnv.VITE_CONVEX_URL !== expectedCloud) {
    throw new Error('Set the expected development deployment and browser URL in local environment configuration.');
  }
}

export function assertRemoteTarget(target) {
  if (target.cloudUrl !== expectedCloud || target.siteUrl !== expectedSite) {
    throw new Error('CLI resolved a different deployment. No fixture mutation was run.');
  }
}

export function prepareManual(args, localEnv, shellEnv, runConvex) {
  const { session, dryRun } = parseArgs(args);
  assertLocalTarget(localEnv, shellEnv);
  // Always resolve the selected dev backend using a read-only, server-guarded query first.
  assertRemoteTarget(runConvex('manualTesting/seed:target', {}));
  if (dryRun) return { dryRun: true, session, deployment: expectedDeployment, browserOrigin };
  const result = runConvex('manualTesting/seed:prepare', { session });
  return {
    ...result,
    browserOrigin,
    links: {
      hybrid: `${browserOrigin}/course/${result.hybrid.slug}`,
      quiz: `${browserOrigin}/course/${result.quiz.slug}`,
      hybridAdmin: `${browserOrigin}/admin/courses/${result.hybrid.id}/edit`,
      quizAdmin: `${browserOrigin}/admin/courses/${result.quiz.id}/edit`,
    },
  };
}

function main() {
  // Invoke the installed CLI through Node: no shell parsing of session names or JSON on Windows.
  const cli = fileURLToPath(new URL('../node_modules/convex/bin/main.js', import.meta.url));
  const runConvex = (name, args) => JSON.parse(execFileSync(process.execPath, [
    cli, 'run', '--deployment', 'dev', '--codegen', 'disable', name, JSON.stringify(args),
  ], { cwd: process.cwd(), env: process.env, encoding: 'utf8', timeout: 60000, stdio: ['ignore', 'pipe', 'pipe'] }));
  const result = prepareManual(process.argv.slice(2), loadEnv('development', process.cwd(), ''), process.env, runConvex);
  console.log(JSON.stringify(result, null, 2));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); }
  catch (error) {
    // Child command output can include backend logs. Emit only the CLI's sanitized failure context.
    console.error(error?.status !== undefined || error?.code ? 'Convex preparation failed. Confirm dev login/network and that functions are synchronized; no reset was attempted.' : error.message);
    process.exitCode = 1;
  }
}
