// cspell:ignore Mispelllled portfollllio docummentation
import { copyFileSync, cpSync, readFileSync, unlinkSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { expect, it } from 'vitest';
import { repository, installedTools, root } from '../helpers/git';

/** Controlled npm stages preserve real Lefthook boundaries without recursively running this suite. */
function hookFixture() {
  const repo = repository();
  installedTools(repo.cwd);
  cpSync(resolve(root, 'scripts'), join(repo.cwd, 'scripts'), {
    recursive: true,
  });
  for (const file of [
    'lefthook.yml',
    'eslint.config.mjs',
    'prettier.config.mjs',
    'cspell.config.json',
    'cspell-project-words.txt',
    'commitlint.config.mjs',
    'mise.toml',
  ]) {
    try {
      copyFileSync(resolve(root, file), join(repo.cwd, file));
    } catch {
      /* Future config is absent during the red run. */
    }
  }
  repo.write('.gitignore', 'node_modules/\ntrace\n');
  repo.write(
    'gate.mjs',
    `import fs from 'node:fs'; const stage=process.argv[2]; fs.appendFileSync('trace',stage+'\\n'); if(fs.existsSync('fail-'+stage)) process.exit(1);\n`,
  );
  repo.write(
    'scoped.test.js',
    `import {it,expect} from 'vitest'; import fs from 'node:fs'; it('fixture unit boundary',()=>{expect(fs.existsSync('fail-test')).toBe(false);});\n`,
  );
  repo.write(
    'vitest.config.mjs',
    `export default {test:{include:['scoped.test.js']}};\n`,
  );
  const scripts = {
    'check:runtime': 'node scripts/check-runtime.mjs',
    'lint:branch': 'node scripts/check-branch.mjs',
    'check:staged': 'node scripts/check-staged.mjs',
    'lint:commits': 'commitlint',
    'check:push-commits': 'node scripts/check-push-commits.mjs',
    'check:types': 'node gate.mjs types',
    test: 'node gate.mjs test && vitest run --config vitest.config.mjs',
  };
  repo.write('package.json', JSON.stringify({ type: 'module', scripts }));
  repo.commit('test: fixture baseline');
  spawnSync(
    process.execPath,
    [resolve(root, 'node_modules/lefthook/bin/index.js'), 'install'],
    { cwd: repo.cwd, encoding: 'utf8' },
  );
  return repo;
}
it('actual pre-commit and commit-msg hooks reject defects and allow a clean Conventional Commit', () => {
  const repo = hookFixture();
  for (const [path, source] of [
    ['bad.mjs', 'missingName();\n'],
    ['bad.md', 'Mispelllled portfollllio.\n'],
    ['bad.md', 'Text   with   bad formatting\n'],
  ]) {
    repo.write(path, source);
    repo.git('add', '--', path);
    const result = repo.git('commit', '-m', 'test: rejected defect');
    expect(result.status, result.stdout + result.stderr).not.toBe(0);
    repo.git('reset', '--hard', 'HEAD');
    repo.git('clean', '-fd', '--', path);
  }
  repo.write('good.md', 'Portfolio website documentation.\n');
  repo.git('add', 'good.md');
  repo.write('good.md', 'Portfolio website changed.\n');
  expect(repo.git('commit', '-m', 'docs: partial staging').status).not.toBe(0);
  repo.write('good.md', 'Portfolio website documentation.\n');
  unlinkSync(join(repo.cwd, 'node_modules'));
  expect(repo.git('commit', '-m', 'docs: missing tools').status).not.toBe(0);
  installedTools(repo.cwd);
  expect(repo.git('commit', '-m', 'invalid message').status).not.toBe(0);
  expect(repo.git('commit', '-m', 'docs: valid fixture').status).toBe(0);
  repo.git('checkout', '-b', 'invalid_branch');
  repo.write('more.md', 'Documentation.\n');
  repo.git('add', 'more.md');
  expect(repo.git('commit', '-m', 'docs: invalid branch').status).not.toBe(0);
});
it('actual pre-push hooks block types and scoped unit/integration failures and permit a local push', () => {
  const repo = hookFixture();
  const remote = repository();
  remote.git('init', '--bare', remote.cwd + '/remote.git');
  repo.git('remote', 'add', 'origin', remote.cwd + '/remote.git');
  for (const stage of ['types', 'test']) {
    repo.write(`fail-${stage}`, 'fixture failure');
    const result = repo.git('push', 'origin', 'HEAD:refs/heads/feat/fixture');
    expect(result.status).not.toBe(0);
    repo.git('clean', '-f', '--', `fail-${stage}`);
  }
  const success = repo.git('push', 'origin', 'HEAD:refs/heads/feat/fixture');
  expect(success.status, success.stdout + success.stderr).toBe(0);
  const trace = readFileSync(join(repo.cwd, 'trace'), 'utf8');
  expect(trace).not.toMatch(/build|e2e/);
  repo.git('checkout', '-b', 'invalid_branch');
  expect(
    repo.git('push', 'origin', 'HEAD:refs/heads/feat/other').status,
  ).not.toBe(0);
  repo.git('checkout', 'feat/fixture');
  const parent = repo.git('rev-parse', 'HEAD').stdout.trim();
  const tree = repo.git('rev-parse', 'HEAD^{tree}').stdout.trim();
  const bad = spawnSync('git', ['commit-tree', tree, '-p', parent], {
    cwd: repo.cwd,
    input: 'invalid outgoing message\n',
    encoding: 'utf8',
  }).stdout.trim();
  const good = spawnSync('git', ['commit-tree', tree, '-p', bad], {
    cwd: repo.cwd,
    input: 'feat: valid final outgoing message\n',
    encoding: 'utf8',
  }).stdout.trim();
  repo.git('update-ref', 'refs/heads/feat/fixture', good);
  expect(
    repo.git('push', 'origin', 'HEAD:refs/heads/feat/fixture').status,
  ).not.toBe(0);
});
it('aggregate scripts preserve order, stop on failure and build only in the full suite', () => {
  const repo = repository();
  const original = JSON.parse(
    readFileSync(resolve(root, 'package.json'), 'utf8'),
  ).scripts;
  const names = [
    'check:runtime',
    'lint:branch',
    'lint',
    'format:check',
    'spellcheck',
    'check:types',
    'test',
    'build',
    'test:e2e',
  ];
  const scripts: Record<string, string> = {
    quality: original.quality,
    'quality:full': original['quality:full'],
  };
  repo.write(
    'gate.mjs',
    `import fs from 'node:fs'; const stage=process.argv[2]; fs.appendFileSync('trace',stage+'\\n'); if(process.env.FAIL_STAGE===stage) process.exit(1);\n`,
  );
  for (const name of names) scripts[name] = `node gate.mjs ${name}`;
  repo.write('package.json', JSON.stringify({ type: 'module', scripts }));
  const run = (name: string, fail = '') =>
    spawnSync('npm', ['run', name], {
      cwd: repo.cwd,
      env: { ...process.env, FAIL_STAGE: fail },
      encoding: 'utf8',
    });
  expect(run('quality:full').status).toBe(0);
  expect(
    readFileSync(join(repo.cwd, 'trace'), 'utf8').trim().split('\n'),
  ).toEqual(names);
  repo.write('trace', '');
  expect(run('quality').status).toBe(0);
  expect(
    readFileSync(join(repo.cwd, 'trace'), 'utf8').trim().split('\n'),
  ).toEqual(names.slice(0, -2));
  repo.write('trace', '');
  expect(run('quality:full', 'lint').status).not.toBe(0);
  expect(
    readFileSync(join(repo.cwd, 'trace'), 'utf8').trim().split('\n'),
  ).toEqual(names.slice(0, 3));
});
