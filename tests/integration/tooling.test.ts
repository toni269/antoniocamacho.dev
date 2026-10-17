import { readFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { expect, it } from 'vitest';
import { repository, installedTools, root } from '../helpers/git';

/** Fake binaries report arguments, permitting adversarial paths without executing their text. */
function stagedFixture() {
  const repo = repository();
  for (const bin of [
    'eslint/bin/eslint.js',
    'prettier/bin/prettier.cjs',
    'cspell/bin.mjs',
  ]) {
    repo.write(
      `node_modules/${bin}`,
      `${bin.endsWith('.mjs') ? "import fs from 'node:fs'; fs" : "require('node:fs')"}.appendFileSync('trace', JSON.stringify(process.argv.slice(2))+'\\n'); process.exit(process.env.FAIL_TOOL ? 1 : 0);`,
    );
  }
  repo.write('.gitignore', 'node_modules/\ntrace\n');
  repo.commit('test: fixture tools');
  return repo;
}
it('dispatches NUL-separated unusual paths without mutation and skips deleted/no-applicable files', () => {
  const repo = stagedFixture();
  const path = 'a space;$(echo unsafe)\nname.ts';
  repo.write(path, 'export const answer = 42;\n');
  repo.git('add', '--', path);
  const before = repo.git('diff', '--cached').stdout;
  const result = repo.script('check-staged.mjs');
  expect(result.status, result.stdout + result.stderr).toBe(0);
  const trace = readFileSync(join(repo.cwd, 'trace'), 'utf8')
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line));
  expect(trace).toHaveLength(3);
  for (const args of trace) expect(args).toContain(path);
  expect(repo.git('diff', '--cached').stdout).toBe(before);
  expect(readFileSync(join(repo.cwd, path), 'utf8')).toBe(
    'export const answer = 42;\n',
  );
  repo.commit('test: tracked source');
  repo.git('rm', '--', path);
  expect(repo.script('check-staged.mjs').status).toBe(0);
});
it('rejects overlapping staged and unstaged edits before invoking tools', () => {
  const repo = stagedFixture();
  repo.write('file.ts', 'export const a = 1;\n');
  repo.git('add', '.');
  repo.write('file.ts', 'export const a = 2;\n');
  const result = repo.script('check-staged.mjs');
  expect(result.status).not.toBe(0);
  expect(result.stderr).toContain('staged and unstaged');
});
it('config changes invoke affected full checks and failures propagate', () => {
  const repo = stagedFixture();
  repo.write(
    'package.json',
    JSON.stringify({
      scripts: {
        lint: 'node -e "process.exit(7)"',
        'format:check': 'node -e "process.exit(0)"',
        spellcheck: 'node -e "process.exit(0)"',
      },
    }),
  );
  repo.git('add', '.');
  expect(repo.script('check-staged.mjs').status).not.toBe(0);
});
it('valid staged prose passes real formatting/spelling tools; missing tools fail clearly', () => {
  const repo = repository();
  repo.write('prose.md', 'Portfolio website documentation.\n');
  repo.git('add', '.');
  expect(repo.script('check-staged.mjs').status).not.toBe(0);
  installedTools(repo.cwd);
  repo.write(
    'prettier.config.mjs',
    `export { default } from '${root}/prettier.config.mjs';\n`,
  );
  repo.write(
    'cspell.config.json',
    JSON.stringify({ version: '0.2', language: 'en', files: ['**/*.md'] }),
  );
  expect(repo.script('check-staged.mjs').status).toBe(0);
  mkdirSync(join(repo.cwd, 'empty'));
});
