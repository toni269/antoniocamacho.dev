import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Return whether a runtime exactly matches the project pin, including the patch.
 * @param {string} actual
 * @param {string} expected
 */
export function validateRuntime(actual, expected) {
  return actual === expected;
}

/** Read the single exact Node pin; reject missing or floating configuration. */
export function expectedNode(cwd = process.cwd()) {
  const text = readFileSync(resolve(cwd, 'mise.toml'), 'utf8');
  const pin = text.match(/^\s*node\s*=\s*"(\d+\.\d+\.\d+)"\s*(?:#.*)?$/m)?.[1];
  if (!pin)
    throw new Error(
      'mise.toml must pin an exact Node version. Run mise install.',
    );
  return pin;
}

/** Validate a checkout without changing its runtime or installing dependencies. */
export function checkRuntime(
  cwd = process.cwd(),
  actual = process.versions.node,
) {
  const expected = expectedNode(cwd);
  if (!validateRuntime(actual, expected)) {
    throw new Error(
      `Expected Node ${expected}, received ${actual}. Run mise install, then mise exec -- npm ci.`,
    );
  }
  return expected;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    console.log(`Node ${checkRuntime()} matches mise.toml.`);
  } catch (error) {
    console.error(
      `Runtime check failed: ${error instanceof Error ? error.message : String(error)} Use mise install and mise exec -- npm ci.`,
    );
    process.exitCode = 1;
  }
}
