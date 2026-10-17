import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { expect, it } from 'vitest';
import { repository, installedTools, root } from '../helpers/git';
const zero = '0'.repeat(40);
/** Empty local bare remotes model a first push without upstream or network credentials. */
function candidate() {
  const repo = repository();
  const remote = repository();
  remote.git('init', '--bare', remote.cwd + '/remote.git');
  installedTools(repo.cwd);
  repo.write('.gitignore', 'node_modules/\n');
  repo.write(
    'commitlint.config.mjs',
    `export { default } from '${root}/commitlint.config.mjs';\n`,
  );
  repo.git('remote', 'add', 'origin', remote.cwd + '/remote.git');
  return { repo, remote };
}
it('checks every first-push message, not just the valid last commit, and all updates', () => {
  const { repo } = candidate();
  const bad = repo.commit('invalid earlier message');
  repo.write('file', 'next');
  const good = repo.commit('feat: good final message');
  const update = `refs/heads/feat/fixture ${good} refs/heads/feat/fixture ${zero}\n`;
  expect(
    repo.script('check-push-commits.mjs', ['origin'], update).status,
  ).not.toBe(0);
  expect(
    repo.script(
      'check-push-commits.mjs',
      ['origin'],
      `refs/heads/x ${zero} refs/heads/x ${good}\n`,
    ).status,
  ).toBe(0);
  expect(
    repo.script(
      'check-push-commits.mjs',
      ['origin'],
      `refs/heads/a ${good} refs/heads/a ${bad}\nrefs/heads/b ${bad} refs/heads/b ${zero}\n`,
    ).status,
  ).not.toBe(0);
  const range = spawnSync(
    process.execPath,
    [
      resolve(root, 'node_modules/@commitlint/cli/cli.js'),
      '--from',
      bad,
      '--to',
      good,
    ],
    { cwd: repo.cwd, encoding: 'utf8' },
  );
  expect(range.status).toBe(0);
});
it('allows a valid first push and excludes already advertised remote history on a new branch', () => {
  const { repo } = candidate();
  const base = repo.commit('legacy unvalidated baseline');
  expect(repo.git('push', 'origin', `${base}:refs/heads/main`).status).toBe(0);
  repo.write('file', 'new');
  const head = repo.commit('feat: new branch');
  expect(
    repo.script(
      'check-push-commits.mjs',
      ['origin'],
      `refs/heads/new ${head} refs/heads/new ${zero}\n`,
    ).status,
  ).toBe(0);
  const clean = candidate();
  const sha = clean.repo.commit('feat: first valid commit');
  expect(
    clean.repo.script(
      'check-push-commits.mjs',
      ['origin'],
      `refs/heads/new ${sha} refs/heads/new ${zero}\n`,
    ).status,
  ).toBe(0);
});
it('fails closed for missing advertised history and malformed input', () => {
  const { repo, remote } = candidate();
  repo.commit('feat: candidate');
  remote.write('remote-only', 'x');
  // A separate worktree exports a commit that has not been fetched by the candidate.
  const other = repository();
  other.write('remote-only', 'x');
  const sha = other.commit('feat: remote history');
  other.git('push', remote.cwd + '/remote.git', `${sha}:refs/heads/main`);
  const head = repo.git('rev-parse', 'HEAD').stdout.trim();
  const result = repo.script(
    'check-push-commits.mjs',
    ['origin'],
    `refs/heads/new ${head} refs/heads/new ${zero}\n`,
  );
  expect(result.status).not.toBe(0);
  expect(result.stderr).toContain('fetch');
  expect(
    repo.script('check-push-commits.mjs', ['origin'], 'malformed\n').status,
  ).not.toBe(0);
});
