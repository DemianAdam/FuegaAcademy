import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const assetsDir = path.resolve('dist/assets');
const entries = await readdir(assetsDir);
const JavaScriptBudgetBytes = 650 * 1024;
const bundles = [];

for (const entry of entries.filter((file) => file.endsWith('.js'))) {
  const size = (await stat(path.join(assetsDir, entry))).size;
  bundles.push({ entry, size });
}

const largest = bundles.sort((left, right) => right.size - left.size)[0];
if (!largest) {
  throw new Error('No production JavaScript bundle was found. Run npm run build first.');
}

if (largest.size > JavaScriptBudgetBytes) {
  throw new Error(
    `Largest JavaScript chunk ${largest.entry} is ${largest.size} bytes; budget is ${JavaScriptBudgetBytes} bytes.`,
  );
}

console.log(`Bundle budget passed: ${largest.entry} is ${largest.size} bytes.`);
