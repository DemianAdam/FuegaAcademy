import { spawn } from 'node:child_process';

const domain = process.env.NGROK_STATIC_DOMAIN?.trim();

if (!domain) {
  console.error('NGROK_STATIC_DOMAIN is required. Example: fuega-dev.ngrok-free.app');
  process.exit(1);
}

if (!/^[a-z0-9][a-z0-9.-]*\.ngrok(?:-free)?\.(?:app|dev)$/i.test(domain)) {
  console.error('NGROK_STATIC_DOMAIN must be an ngrok hostname, without https:// or a path.');
  process.exit(1);
}

console.log(`Exposing http://localhost:3000 at https://${domain}`);
const tunnel = spawn('ngrok', ['http', '--url', domain, '3000'], {
  stdio: 'inherit',
  shell: false,
});

tunnel.on('error', (error) => {
  console.error('Could not start ngrok. Confirm it is installed and authenticated.', error.message);
  process.exit(1);
});

tunnel.on('exit', (code) => process.exit(code ?? 1));
