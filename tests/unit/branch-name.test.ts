import { expect, it } from 'vitest';
import { validBranch } from '../../scripts/check-branch.mjs';
import { repository } from '../helpers/git';

it('accepts exactly the approved expression and permanent exceptions', () => {
  for (const type of [
    'feat',
    'fix',
    'docs',
    'test',
    'ci',
    'refactor',
    'chore',
    'perf',
    'build',
  ]) {
    for (const suffix of ['foundation', 'a1', '-', 'a--b-'])
      expect(validBranch(`${type}/${suffix}`)).toBe(true);
  }
  for (const branch of ['main', 'develop'])
    expect(validBranch(branch)).toBe(true);
  for (const branch of [
    '',
    'HEAD',
    'Feat/name',
    'feature/name',
    'feat/',
    'feat/Name',
    'feat/a_b',
    'feat/a/b',
    'main/foo',
  ])
    expect(validBranch(branch)).toBe(false);
});
it('resolves local branch or explicit CI input, rejecting detached or missing input', () => {
  const repo = repository();
  expect(repo.script('check-branch.mjs').status).toBe(0);
  expect(
    repo.script('check-branch.mjs', ['--branch', 'fix/example']).status,
  ).toBe(0);
  expect(repo.script('check-branch.mjs', ['--branch']).status).not.toBe(0);
  repo.write('file', 'content');
  const sha = repo.commit('test: initial fixture');
  repo.git('checkout', '--detach', sha);
  expect(repo.script('check-branch.mjs').status).not.toBe(0);
});
