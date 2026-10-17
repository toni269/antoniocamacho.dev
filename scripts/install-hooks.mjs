import { existsSync } from 'node:fs';
import { cli, run, tool } from './git-utils.mjs';
/** prepare is harmless for CI and non-Git source archives; an actual checkout must install.
 * Lefthook's local optional platform binary is selected by its own supported entry point.
 */
cli(import.meta.url, () => {
  if (process.env.CI) {
    console.log('CI: local hooks skipped; run independent quality gates.');
    return;
  }
  if (!existsSync('.git')) {
    console.log('Source archive: no Git hooks to install.');
    return;
  }
  run('git', ['rev-parse', '--git-dir']);
  tool('lefthook/bin/index.js', ['install']);
});
