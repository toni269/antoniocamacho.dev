import { afterEach, expect, it, vi } from 'vitest';
import { join } from 'node:path';
import { fixtureEnvironment, repository } from '../helpers/git';

afterEach(() => vi.unstubAllEnvs());

it('removes parent hook/repository selectors while preserving runtime and ordinary variables', () => {
  const source = {
    PATH: process.env.PATH,
    npm_execpath: process.env.npm_execpath,
    FIXTURE_VALUE: 'retained',
    GIT_DIR: '/parent/.git',
    GIT_WORK_TREE: '/parent',
    GIT_INDEX_FILE: '/parent/index',
    GIT_COMMON_DIR: '/parent/.git',
    LEFTHOOK: '0',
    LEFTHOOK_BIN: '/parent/lefthook',
    LEFTHOOK_CONFIG: '/parent/lefthook.yml',
    LEFTHOOK_EXCLUDE: 'quality',
  };
  const environment = fixtureEnvironment(source);
  for (const key of Object.keys(source).filter(
    (key) => key.startsWith('GIT_') || key.startsWith('LEFTHOOK'),
  ))
    expect(environment[key]).toBeUndefined();
  expect(environment.PATH).toBe(source.PATH);
  expect(environment.npm_execpath).toBe(source.npm_execpath);
  expect(environment.FIXTURE_VALUE).toBe('retained');
  expect(source.LEFTHOOK_BIN).toBe('/parent/lefthook');
});

it('keeps nested Git operations inside their own temporary repository under parent Git context', () => {
  // The outer repository is also disposable; deliberate context pollution never targets the real checkout.
  for (const key of [
    'GIT_DIR',
    'GIT_WORK_TREE',
    'GIT_INDEX_FILE',
    'GIT_COMMON_DIR',
  ])
    vi.stubEnv(key, undefined);
  const outer = repository('feat/outer');
  outer.write('outer.txt', 'Outer fixture.\n');
  const before = outer.commit('test: outer fixture');
  vi.stubEnv('GIT_DIR', join(outer.cwd, '.git'));
  vi.stubEnv('GIT_WORK_TREE', outer.cwd);
  const inner = repository('feat/inner');
  expect(inner.git('rev-parse', '--show-toplevel').stdout.trim()).toBe(
    inner.cwd,
  );
  inner.write('inner.txt', 'Inner fixture.\n');
  inner.commit('test: inner fixture');
  expect(outer.git('rev-parse', 'HEAD').stdout.trim()).toBe(before);
  expect(outer.git('status', '--porcelain').stdout).toBe('');
});
