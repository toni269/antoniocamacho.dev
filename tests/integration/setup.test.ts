import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { expect, it } from 'vitest';

it('checks a real checkout runtime and explains missing or incompatible configuration', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'portfolio-runtime-'));
  const script = resolve('scripts/check-runtime.mjs');
  const run = () =>
    spawnSync(process.execPath, [script], { cwd, encoding: 'utf8' });
  try {
    writeFileSync(
      join(cwd, 'mise.toml'),
      `[tools]\nnode = "${process.versions.node}"\n`,
    );
    expect(run().status).toBe(0);
    writeFileSync(join(cwd, 'mise.toml'), '[tools]\nnode = "24.0.0"\n');
    const mismatch = run();
    expect(mismatch.status).not.toBe(0);
    expect(mismatch.stderr).toContain('mise');
    rmSync(join(cwd, 'mise.toml'));
    expect(run().status).not.toBe(0);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});
