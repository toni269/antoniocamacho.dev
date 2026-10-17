// cspell:ignore Mispelllled portfollllio docummentation
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { expect, it } from 'vitest';

const root = process.cwd();
/** Each fixture exercises installed tools and the actual checked-in configuration. */
function fixture(
  run: (
    cwd: string,
    invoke: (bin: string, args: string[]) => ReturnType<typeof spawnSync>,
  ) => void,
) {
  const cwd = mkdtempSync(join(tmpdir(), 'portfolio-config-'));
  const invoke = (bin: string, args: string[]) =>
    spawnSync(process.execPath, [resolve(root, 'node_modules', bin), ...args], {
      cwd,
      encoding: 'utf8',
    });
  try {
    run(cwd, invoke);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
}

it('lint rejects genuine violations and ignores generated output', () =>
  fixture((cwd, run) => {
    writeFileSync(join(cwd, 'good.mjs'), 'export const answer = 42;\n');
    writeFileSync(join(cwd, 'bad.mjs'), 'missingName();\n');
    const config = ['--config', resolve(root, 'eslint.config.mjs')];
    expect(run('eslint/bin/eslint.js', [...config, 'good.mjs']).status).toBe(0);
    expect(run('eslint/bin/eslint.js', [...config, 'bad.mjs']).status).toBe(1);
    writeFileSync(join(cwd, 'bad.ts'), 'const unused: string = "value";\n');
    expect(run('eslint/bin/eslint.js', [...config, 'bad.ts']).status).toBe(1);
    writeFileSync(
      join(cwd, 'bad.astro'),
      '---\nconst unused = 1;\n---\n<p>Hello</p>\n',
    );
    expect(run('eslint/bin/eslint.js', [...config, 'bad.astro']).status).toBe(
      1,
    );
    mkdirSync(join(cwd, 'dist'));
    writeFileSync(join(cwd, 'dist/bad.mjs'), 'missingName();\n');
    expect(
      run('eslint/bin/eslint.js', [...config, 'dist/bad.mjs']).status,
    ).toBe(0);
  }));

it('format checks report defects without changing the file', () =>
  fixture((cwd, run) => {
    const file = join(cwd, 'bad.mjs');
    const source = 'export const value={a:1}\n';
    writeFileSync(file, source);
    const result = run('prettier/bin/prettier.cjs', [
      '--config',
      resolve(root, 'prettier.config.mjs'),
      '--check',
      file,
    ]);
    expect(result.status).toBe(1);
    expect(readFileSync(file, 'utf8')).toBe(source);
  }));

it('spell checking accepts known prose and rejects a seeded misspelling', () =>
  fixture((cwd, run) => {
    const file = join(cwd, 'prose.md');
    const args = [
      '--config',
      resolve(root, 'cspell.config.json'),
      '--no-progress',
      file,
    ];
    writeFileSync(file, 'Portfolio website documentation.\n');
    expect(run('cspell/bin.mjs', args).status).toBe(0);
    writeFileSync(file, 'Mispelllled portfollllio docummentation.\n');
    expect(run('cspell/bin.mjs', args).status).toBe(1);
  }));

it('strict tooling types reject a genuine incompatible value', () =>
  fixture((cwd, run) => {
    writeFileSync(
      join(cwd, 'tsconfig.json'),
      JSON.stringify({
        extends: resolve(root, 'tsconfig.tooling.json'),
        include: ['./value.ts'],
        compilerOptions: {
          rootDir: cwd,
          typeRoots: [resolve(root, 'node_modules/@types')],
        },
      }),
    );
    writeFileSync(
      join(cwd, 'value.ts'),
      'export const name: string = "Antonio";\n',
    );
    expect(
      run('typescript/bin/tsc', ['-p', join(cwd, 'tsconfig.json')]).status,
    ).toBe(0);
    writeFileSync(join(cwd, 'value.ts'), 'export const name: string = 42;\n');
    const result = run('typescript/bin/tsc', [
      '-p',
      join(cwd, 'tsconfig.json'),
    ]);
    expect(result.status).toBe(2);
    expect(String(result.stdout)).toContain('not assignable');
  }));
