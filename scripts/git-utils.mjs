import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Run an argument array without a shell. Missing tools/failures are always errors.
 * @param {string} command @param {string[]} args @param {string | undefined} [input]
 */
export function run(command, args, input) {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    input,
    maxBuffer: 16 * 1024 * 1024,
  });
  if (result.error || result.status !== 0)
    throw new Error(
      `${command} check failed. ${result.error?.message ?? ''}\n${result.stdout ?? ''}${result.stderr ?? ''}`,
    );
  return result.stdout;
}
/** Run a project-local installed JS tool; npm ci repairs a missing binary.
 * @param {string} binary @param {string[]} args @param {string | undefined} [input]
 */
export function tool(binary, args, input) {
  try {
    return run(
      process.execPath,
      [resolve('node_modules', binary), ...args],
      input,
    );
  } catch (error) {
    throw new Error(
      `Local tool failed (${binary}). Run npm ci if dependencies are missing.\n${error instanceof Error ? error.message : String(error)}`,
      { cause: error },
    );
  }
}
/** Keep imported predicates side-effect free while CLI failures remain actionable.
 * @param {string} url @param {() => void} action
 */
export function cli(url, action) {
  if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(url)) {
    try {
      action();
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exitCode = 1;
    }
  }
}
