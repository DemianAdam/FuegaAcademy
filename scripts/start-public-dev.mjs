import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const port = 3000;
const localEnvPath = join(process.cwd(), '.env.local');
if (existsSync(localEnvPath)) {
  const localDomain = readFileSync(localEnvPath, 'utf8').match(/^NGROK_STATIC_DOMAIN\s*=\s*["']?([^"'\r\n]+)["']?\s*$/m)?.[1]?.trim();
  if (localDomain && !process.env.NGROK_STATIC_DOMAIN) process.env.NGROK_STATIC_DOMAIN = localDomain;
}
const npmCommand = process.platform === 'win32' ? (process.env.ComSpec ?? 'cmd.exe') : 'npm';
const npmArgs = process.platform === 'win32'
  ? ['/d', '/s', '/c', 'npm run dev -- --host 127.0.0.1 --port 3000 --strictPort']
  : ['run', 'dev', '--', '--host', '127.0.0.1'];
const children = [];
let shuttingDown = false;

if (!process.env.NGROK_STATIC_DOMAIN?.trim()) {
  console.error('NGROK_STATIC_DOMAIN is required. Example: fuega-dev.ngrok-free.app');
  process.exit(1);
}

function stopAll(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) child.kill('SIGTERM');
  }
  setTimeout(() => process.exit(exitCode), 500);
}

function start(command, args) {
  const child = spawn(command, args, { stdio: 'inherit', env: process.env });
  children.push(child);
  child.on('error', (error) => {
    console.error(`Could not start ${command}: ${error.message}`);
    stopAll(1);
  });
  child.on('exit', (code, signal) => {
    if (!shuttingDown && (code ?? 0) !== 0) {
      console.error(`${command} stopped${signal ? ` (${signal})` : ` with exit code ${code}`}.`);
      stopAll(code ?? 1);
    }
  });
  return child;
}

async function waitForDevServer() {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}`);
      if (response.ok || response.status < 500) return;
    } catch {
      // Vite is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Vite did not become reachable on port ${port} within 30 seconds.`);
}

process.on('SIGINT', () => stopAll(0));
process.on('SIGTERM', () => stopAll(0));

try {
  start(npmCommand, npmArgs);
  await waitForDevServer();
  console.log(`Vite is ready at http://localhost:${port}`);
  start(process.execPath, ['scripts/start-tunnel.mjs']);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  stopAll(1);
}
