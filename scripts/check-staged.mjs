import { cli, run, tool } from './git-utils.mjs';

/** Read NUL-delimited tracked paths, preserving whitespace, newlines and shell metacharacters.
 * @param {string[]} args
 */
const paths = (args) => run('git', args).split('\0').filter(Boolean);
cli(import.meta.url, () => {
  const staged = paths([
    'diff',
    '--cached',
    '--name-only',
    '-z',
    '--diff-filter=ACMR',
  ]);
  const unstaged = new Set(paths(['diff', '--name-only', '-z']));
  if (staged.some((path) => unstaged.has(path)))
    throw new Error(
      'File has staged and unstaged edits. Stage the complete intended file or separate your edits, then retry.',
    );
  // A configuration change can affect untouched files, so run its complete gate.
  const shared = staged.some((path) =>
    ['package.json', 'package-lock.json', '.gitignore'].includes(path),
  );
  const fullLint = shared || staged.includes('eslint.config.mjs');
  const fullFormat =
    shared ||
    staged.some((path) =>
      ['prettier.config.mjs', '.prettierignore'].includes(path),
    );
  const fullSpell =
    shared ||
    staged.some((path) =>
      ['cspell.config.json', 'cspell-project-words.txt'].includes(path),
    );
  const owned = staged.filter(
    (path) =>
      !path.startsWith('.agents/') &&
      !path.startsWith('.specify/') &&
      path !== 'package-lock.json',
  );
  const lint = owned.filter((path) => /\.(?:[cm]?js|tsx?|astro)$/.test(path));
  const format = owned.filter((path) =>
    /\.(?:[cm]?js|tsx?|astro|css|md|json|ya?ml)$/.test(path),
  );
  const spell = staged.filter(
    (path) =>
      !path.startsWith('.agents/') &&
      (!path.startsWith('.specify/') ||
        path === '.specify/memory/constitution.md') &&
      /\.(?:[cm]?js|tsx?|astro|css|md|json|toml|ya?ml)$/.test(path) &&
      !['package-lock.json', 'cspell-project-words.txt'].includes(path),
  );
  if (fullLint) run('npm', ['run', 'lint']);
  else if (lint.length) tool('eslint/bin/eslint.js', ['--', ...lint]);
  if (fullFormat) run('npm', ['run', 'format:check']);
  else if (format.length)
    tool('prettier/bin/prettier.cjs', ['--check', '--', ...format]);
  if (fullSpell) run('npm', ['run', 'spellcheck']);
  else if (spell.length)
    tool('cspell/bin.mjs', [
      '--no-progress',
      '--no-must-find-files',
      '--',
      ...spell,
    ]);
  console.log('Applicable staged checks passed (no files were modified).');
});
