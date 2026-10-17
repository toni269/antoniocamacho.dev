import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

// Lefthook hides unstaged edits before pre-commit by default. Disable that mechanism so
// check-staged can reject overlaps without stash/index mutation. All configured gates still run.
const args = process.argv.slice(2);
if (args[0] === 'run') args.push('--no-stage-fixed');
const result = spawnSync(
  process.execPath,
  [resolve('node_modules/lefthook/bin/index.js'), ...args],
  { stdio: 'inherit' },
);
if (result.error)
  console.error(
    'Cannot start local Lefthook. Run npm ci and npm run hooks:install.',
    result.error.message,
  );
process.exitCode = result.status ?? 1;
