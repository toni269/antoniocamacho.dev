import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  rmSync,
  symlinkSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { afterEach } from 'vitest';

export const root = process.cwd();
const fixtures: string[] = [];
afterEach(() => {
  for (const path of fixtures.splice(0))
    rmSync(path, { recursive: true, force: true });
});
/** All Git mutations are confined to disposable local repositories, never the real checkout. */
export function repository(branch = 'feat/fixture') {
  const cwd = mkdtempSync(join(tmpdir(), 'portfolio-git-'));
  fixtures.push(cwd);
  const env = fixtureEnvironment();
  const git = (...args: string[]) =>
    spawnSync('git', args, { cwd, env, encoding: 'utf8' });
  git('init', '-b', branch);
  git('config', 'user.email', 'fixture@example.com');
  git('config', 'user.name', 'Fixture');
  const write = (path: string, value: string) => {
    mkdirSync(resolve(cwd, path, '..'), { recursive: true });
    writeFileSync(join(cwd, path), value);
  };
  const commit = (message: string) => {
    git('add', '.');
    const result = git('commit', '-m', message);
    if (result.status) throw new Error(result.stderr + result.stdout);
    return git('rev-parse', 'HEAD').stdout.trim();
  };
  const script = (name: string, args: string[] = [], input?: string) =>
    spawnSync(process.execPath, [resolve(root, 'scripts', name), ...args], {
      cwd,
      env,
      input,
      encoding: 'utf8',
    });
  return { cwd, env, git, write, commit, script };
}
/** Real installed tools are shared read-only; generated state stays inside the fixture. */
export function installedTools(cwd: string) {
  symlinkSync(resolve(root, 'node_modules'), join(cwd, 'node_modules'), 'dir');
}

// Ask Git for its repository-local variables instead of maintaining a partial hardcoded list.
const localGitVariables = spawnSync('git', ['rev-parse', '--local-env-vars'], {
  encoding: 'utf8',
});
if (localGitVariables.error || localGitVariables.status !== 0) {
  throw new Error(
    'Git is required to isolate temporary repository environments.',
    { cause: localGitVariables.error },
  );
}

/** Isolate foreign repositories from the parent Git/hook context, preserving runtime PATH.
 * Return a copy: never change the real hook's environment or weaken its validation policy.
 */
export function fixtureEnvironment(
  source: NodeJS.ProcessEnv = process.env,
): NodeJS.ProcessEnv {
  const env = { ...source };
  for (const key of localGitVariables.stdout.trim().split('\n'))
    delete env[key];
  for (const key of Object.keys(env)) {
    if (key === 'LEFTHOOK' || key.startsWith('LEFTHOOK_')) delete env[key];
  }
  return env;
}
